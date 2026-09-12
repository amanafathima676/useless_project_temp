/**
 * Hand Tracker Module for Act 2 (Indian Education Machine)
 * Runs directly in the browser using HTML5 MediaDevices / Canvas CV.
 *
 * Features:
 * 1. WebRTC camera feed via navigator.mediaDevices.getUserMedia
 * 2. Real-time index finger / hand centroid tracking with smoothing
 * 3. Cyber HUD reticle, target crosshair, and deadzone ring overlay
 * 4. Graceful Mouse Control fallback (toggle with key 'M' or button)
 *
 * Supports Browser (window.HandTracker) and Node.js mock.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.HandTracker = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  class HandTracker {
    constructor(videoElement, canvasOverlay, options = {}) {
      this.video = videoElement;
      this.canvas = canvasOverlay;
      this.ctx = canvasOverlay ? canvasOverlay.getContext("2d") : null;

      this.smoothingFactor = options.smoothingFactor || 0.4;
      this.smoothedX = 0.0;
      this.smoothedY = 0.0;
      this.rawX = 0.0;
      this.rawY = 0.0;

      this.handDetected = false;
      this.fingerPx = null;
      this.useMouseFallback = false;
      this.cameraActive = false;
      this.hudPulse = 0.0;
      this.camStatusMsg = "SEARCHING FOR CAMERA...";

      // Internal processing canvas for lightweight CV
      this.procCanvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
      this.procCtx = this.procCanvas ? this.procCanvas.getContext("2d", { willReadFrequently: true }) : null;
      if (this.procCanvas) {
        this.procCanvas.width = 160;
        this.procCanvas.height = 120;
      }
    }

    /**
     * Request webcam stream from user
     */
    async initCamera() {
      if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn("[HandTracker] getUserMedia not supported in this browser. Activating Mouse fallback.");
        this.useMouseFallback = true;
        this.camStatusMsg = "CAMERA NOT SUPPORTED — MOUSE CONTROL ACTIVE";
        return false;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          },
          audio: false
        });

        if (this.video) {
          this.video.srcObject = stream;
          await this.video.play();
          this.cameraActive = true;
          this.camStatusMsg = "CAMERA READY (WEBCAM ACTIVE)";
          console.log("[HandTracker] Camera started successfully.");
          return true;
        }
      } catch (err) {
        console.warn("[HandTracker] Webcam access denied or unavailable:", err.message);
        this.useMouseFallback = true;
        this.camStatusMsg = "CAMERA BLOCKED / IN USE — MOUSE CONTROL ACTIVE";
        return false;
      }
      return false;
    }

    toggleMouseFallback() {
      this.useMouseFallback = !this.useMouseFallback;
      if (!this.useMouseFallback && !this.cameraActive) {
        this.initCamera();
      }
      return this.useMouseFallback;
    }

    setMousePosition(screenW, screenH, mouseX, mouseY) {
      if (this.useMouseFallback) {
        let normX = (mouseX - screenW / 2.0) / (screenW / 2.0);
        let normY = (mouseY - screenH / 2.0) / (screenH / 2.0);

        normX = Math.max(-1.0, Math.min(1.0, normX));
        normY = Math.max(-1.0, Math.min(1.0, normY));

        this.rawX = normX;
        this.rawY = normY;
        this.smoothedX = normX;
        this.smoothedY = normY;
        this.handDetected = true;
      }
    }

    /**
     * Processes current frame, detects fingertip/hand centroid, renders Cyber HUD.
     * Returns: { detected, normX, normY, fingerPx }
     */
    processFrame() {
      this.hudPulse += 0.15;

      const w = this.canvas ? this.canvas.width : 640;
      const h = this.canvas ? this.canvas.height : 480;
      let detected = false;
      let targetX = 0.0;
      let targetY = 0.0;
      let fingerPx = null;

      // 1. Mouse Control Mode
      if (this.useMouseFallback || !this.cameraActive) {
        detected = this.handDetected;
        const cx = Math.floor(w / 2 + this.smoothedX * (w * 0.4));
        const cy = Math.floor(h / 2 + this.smoothedY * (h * 0.4));
        fingerPx = { x: cx, y: cy };
        this._drawHud(w, h, fingerPx, "MOUSE CONTROL ACTIVE (MOVE MOUSE)");
        return {
          detected: true,
          normX: this.smoothedX,
          normY: this.smoothedY,
          fingerPx
        };
      }

      // 2. Video Optical Centroid Tracking via Canvas
      if (this.video && this.video.readyState >= 2 && this.procCtx) {
        try {
          const pw = this.procCanvas.width;
          const ph = this.procCanvas.height;

          // Draw flipped mirror frame to procCanvas
          this.procCtx.save();
          this.procCtx.scale(-1, 1);
          this.procCtx.drawImage(this.video, -pw, 0, pw, ph);
          this.procCtx.restore();

          const imgData = this.procCtx.getImageData(0, 0, pw, ph);
          const data = imgData.data;

          // Skin / Motion centroid algorithm
          let sumX = 0;
          let sumY = 0;
          let count = 0;

          for (let y = 0; y < ph; y += 2) {
            for (let x = 0; x < pw; x += 2) {
              const idx = (y * pw + x) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];

              // Skin-like color filter
              if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
                sumX += x;
                sumY += y;
                count++;
              }
            }
          }

          if (count > 60) {
            detected = true;
            const avgX = sumX / count;
            const avgY = sumY / count;

            // Normalize to [-1, 1] with mirror correction
            targetX = (avgX / pw - 0.5) * 2.0;
            targetY = (avgY / ph - 0.5) * 2.0;

            fingerPx = {
              x: Math.floor(avgX * (w / pw)),
              y: Math.floor(avgY * (h / ph))
            };
          }
        } catch (e) {
          // ignore read errors
        }
      }

      // Smoothing Filter
      if (detected) {
        this.handDetected = true;
        this.rawX = targetX;
        this.rawY = targetY;
        this.smoothedX = this.smoothingFactor * targetX + (1.0 - this.smoothingFactor) * this.smoothedX;
        this.smoothedY = this.smoothingFactor * targetY + (1.0 - this.smoothingFactor) * this.smoothedY;
      } else {
        this.handDetected = false;
        this.smoothedX *= 0.88;
        this.smoothedY *= 0.88;
      }

      this.smoothedX = Math.max(-1.0, Math.min(1.0, this.smoothedX));
      this.smoothedY = Math.max(-1.0, Math.min(1.0, this.smoothedY));

      // Draw Cyber HUD
      const statusTxt = detected ? "FOREFINGER / HAND LOCKED" : "SEARCHING FOR HAND...";
      this._drawHud(w, h, fingerPx, statusTxt);

      return {
        detected: this.handDetected,
        normX: this.smoothedX,
        normY: this.smoothedY,
        fingerPx
      };
    }

    _drawHud(w, h, fingerPx, statusMsg) {
      if (!this.ctx) return;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, w, h);

      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);
      const deadRadius = Math.floor(h * 0.18);

      // Deadzone neutral circle
      ctx.beginPath();
      ctx.arc(cx, cy, deadRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center crosshair
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy);
      ctx.lineTo(cx + 14, cy);
      ctx.moveTo(cx, cy - 14);
      ctx.lineTo(cx, cy + 14);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (fingerPx && this.handDetected) {
        const { x: fx, y: fy } = fingerPx;
        const pulseR = 18 + 4 * Math.sin(this.hudPulse);

        // Reticle ring
        ctx.beginPath();
        ctx.arc(fx, fy, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = "#00f5d4";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner glowing dot
        ctx.beginPath();
        ctx.arc(fx, fy, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#facc15";
        ctx.fill();

        // Vector line to center
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(fx, fy);
        ctx.strokeStyle = "rgba(0, 245, 212, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Corner brackets on target
        const bLen = 8;
        ctx.strokeStyle = "#00f5d4";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(fx - pulseR - 4, fy);
        ctx.lineTo(fx - pulseR - 4 + bLen, fy);
        ctx.moveTo(fx + pulseR + 4, fy);
        ctx.lineTo(fx + pulseR + 4 - bLen, fy);
        ctx.moveTo(fx, fy - pulseR - 4);
        ctx.lineTo(fx, fy - pulseR - 4 + bLen);
        ctx.moveTo(fx, fy + pulseR + 4);
        ctx.lineTo(fx, fy + pulseR + 4 - bLen);
        ctx.stroke();

        // Label
        ctx.font = "bold 11px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#00f5d4";
        ctx.fillText("TARGET LOCKED", fx + 24, fy - 6);
      }

      // Status text
      ctx.font = "12px 'Segoe UI', sans-serif";
      ctx.fillStyle = this.handDetected ? "#00f5d4" : "#ef4444";
      ctx.fillText(statusMsg, 16, 24);
    }
  }

  return HandTracker;
});
