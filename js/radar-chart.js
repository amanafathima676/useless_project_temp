/**
 * Radar Chart Module for Act 2 (Indian Education Machine)
 * Renders a high-performance, glowing 8-axis spider/radar chart in HTML5 Canvas.
 *
 * Supports both Browser (window.RadarChart) and Node.js (CommonJS).
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.RadarChart = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const RADAR_AXES = [
    { key: "assignments", label: "ASSIGNMENTS", angle_deg: 270, color: "#38bdf8", rgb: [56, 189, 248] },
    { key: "hackathon", label: "HACKATHON", angle_deg: 315, color: "#facc15", rgb: [250, 204, 21] },
    { key: "placement", label: "PLACEMENT PREP", angle_deg: 0, color: "#10b981", rgb: [16, 185, 129] },
    { key: "club", label: "CLUB ACTS", angle_deg: 45, color: "#ec4899", rgb: [236, 72, 153] },
    { key: "sleep", label: "SLEEP", angle_deg: 90, color: "#818cf8", rgb: [129, 140, 248] },
    { key: "friends", label: "FRIENDS / CHAI", angle_deg: 135, color: "#fb923c", rgb: [251, 146, 60] },
    { key: "mental_health", label: "SANITY / MENTAL", angle_deg: 180, color: "#f87171", rgb: [248, 113, 113] },
    { key: "record", label: "LAB RECORD", angle_deg: 225, color: "#06b6d4", rgb: [6, 182, 212] }
  ];

  class RadarChart {
    constructor(cx = 180, cy = 180, radius = 120) {
      this.cx = cx;
      this.cy = cy;
      this.radius = radius;
      this.axes = RADAR_AXES;
      this.num_axes = RADAR_AXES.length;
      this.pulse_timer = 0.0;

      // Precalculate unit vectors for all 8 axes
      this.unit_vectors = [];
      for (const axis of this.axes) {
        const rad = (axis.angle_deg * Math.PI) / 180.0;
        const ux = Math.cos(rad);
        const uy = Math.sin(rad);
        this.unit_vectors.push({ ux, uy });
      }
    }

    update(dt) {
      this.pulse_timer += dt * 5.0;
    }

    /**
     * Draws the radar grid, axes, data polygon, glow, and labels to a 2D canvas context.
     */
    draw(ctx, statsDict) {
      if (!ctx) return;
      const { cx, cy, radius: r } = this;

      // 1. Draw Concentric Grid Rings (20%, 40%, 60%, 80%, 100%)
      const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
      levels.forEach(lvl => {
        ctx.beginPath();
        this.unit_vectors.forEach((v, idx) => {
          const px = cx + v.ux * (r * lvl);
          const py = cy + v.uy * (r * lvl);
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.strokeStyle = lvl < 1.0 ? "rgba(70, 85, 120, 0.4)" : "rgba(100, 120, 165, 0.7)";
        ctx.lineWidth = lvl < 1.0 ? 1 : 1.5;
        ctx.stroke();
      });

      // 2. Draw 8 Axis Spokes
      this.unit_vectors.forEach(v => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + v.ux * r, cy + v.uy * r);
        ctx.strokeStyle = "rgba(70, 85, 120, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 3. Calculate Data Polygon Vertices
      const dataPoints = [];
      const mentalVal = statsDict ? (statsDict.mental_health !== undefined ? statsDict.mental_health : 50.0) : 50.0;

      this.axes.forEach((axis, i) => {
        let val = 50.0;
        if (statsDict) {
          if (statsDict[axis.key] !== undefined) val = statsDict[axis.key];
          else if (axis.key === "assignments" && statsDict.academics !== undefined) val = statsDict.academics;
          else if (axis.key === "hackathon" && statsDict.hackathons !== undefined) val = statsDict.hackathons;
          else if (axis.key === "placement" && statsDict.skill_dev !== undefined) val = statsDict.skill_dev;
          else if (axis.key === "club" && statsDict.arts_sports !== undefined) val = statsDict.arts_sports;
        }

        const normVal = Math.max(0.05, Math.min(1.0, val / 100.0));
        const { ux, uy } = this.unit_vectors[i];
        const px = cx + ux * (r * normVal);
        const py = cy + uy * (r * normVal);
        dataPoints.push({ px, py, val, axis });
      });

      // 4. Render Translucent Filled Polygon & Neon Outline
      if (dataPoints.length >= 3) {
        ctx.beginPath();
        dataPoints.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        });
        ctx.closePath();

        let fillColor = "rgba(0, 245, 212, 0.25)";
        let strokeColor = "#00f5d4";

        if (mentalVal <= 25) {
          fillColor = "rgba(247, 37, 133, 0.35)";
          strokeColor = "#f72585";
        } else if (mentalVal <= 50) {
          fillColor = "rgba(255, 183, 3, 0.30)";
          strokeColor = "#ffb703";
        }

        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // 5. Draw Vertices & Pulsating Mental Health node
      dataPoints.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, 4, 0, Math.PI * 2);
        ctx.fillStyle = pt.axis.color;
        ctx.fill();

        // Pulsating aura if mental health critical
        if (pt.axis.key === "mental_health" && mentalVal < 35.0) {
          const pulseRad = 8 + 5 * Math.sin(this.pulse_timer);
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, pulseRad, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
          ctx.fill();
        }
      });

      // 6. Draw Axis Labels
      ctx.font = "bold 9px 'Segoe UI', sans-serif";
      ctx.textBaseline = "middle";

      this.axes.forEach((axis, i) => {
        const { ux, uy } = this.unit_vectors[i];
        const labelDist = r + 16;
        const lx = cx + ux * labelDist;
        const ly = cy + uy * labelDist;

        if (ux > 0.3) ctx.textAlign = "left";
        else if (ux < -0.3) ctx.textAlign = "right";
        else ctx.textAlign = "center";

        ctx.fillStyle = (axis.key === "mental_health" && mentalVal < 30) ? "#ef4444" : axis.color;
        ctx.fillText(axis.label, lx, ly);
      });
    }
  }

  return RadarChart;
});
