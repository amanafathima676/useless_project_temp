/**
 * Procedural Audio Synthesizer for Act 2 (Indian Education Machine)
 * Synthesizes game audio & tension soundscapes directly via Web Audio API.
 * Zero external audio files required.
 *
 * Supports Browser (Web Audio API) and safe mock in Node.js environments.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.AudioSynthesizer = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  class AudioSynthesizer {
    constructor() {
      this.enabled = false;
      this.lastHeartbeatTime = 0.0;
      this.audioCtx = null;

      if (typeof window !== "undefined") {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            this.audioCtx = new AudioContextClass();
            this.enabled = true;
          }
        } catch (e) {
          console.warn("[AudioSynthesizer] Web Audio init failed:", e);
        }
      }
    }

    _resumeContext() {
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume().catch(() => {});
      }
    }

    /**
     * Short 880Hz tick with fast exponential decay (0.03s)
     */
    playTick() {
      if (!this.enabled || !this.audioCtx) return;
      this._resumeContext();

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    }

    play_tick() {
      this.playTick();
    }

    /**
     * Pitch chirp 400Hz -> 850Hz on zone switch (0.08s)
     */
    playZoneSwitch() {
      if (!this.enabled || !this.audioCtx) return;
      this._resumeContext();

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.085);
    }

    play_zone_switch() {
      this.playZoneSwitch();
    }

    /**
     * High alert panic beep at 1200Hz (0.08s)
     */
    playPanic() {
      if (!this.enabled || !this.audioCtx) return;
      this._resumeContext();

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.085);
    }

    play_panic() {
      this.playPanic();
    }

    /**
     * Low heartbeat thud at 65Hz (0.12s)
     */
    playHeartbeat() {
      if (!this.enabled || !this.audioCtx) return;
      this._resumeContext();

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(70, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    }

    /**
     * End-of-time harsh buzzer (180Hz + 360Hz) (0.8s)
     */
    playBuzzer() {
      if (!this.enabled || !this.audioCtx) return;
      this._resumeContext();

      const now = this.audioCtx.currentTime;
      [180, 360].forEach(freq => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.85);
      });
    }

    play_buzzer() {
      this.playBuzzer();
    }

    /**
     * Harmonious major triad fanfare (C5, E5, G5) (0.6s)
     */
    playSuccess() {
      if (!this.enabled || !this.audioCtx) return;
      this._resumeContext();

      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + 0.75);
      });
    }

    play_success() {
      this.playSuccess();
    }

    /**
     * Dynamically pulses heartbeat sounds faster as Mental Health drops or time runs out.
     */
    updateTension(mentalHealth, timeRemaining, dt) {
      if (!this.enabled || !this.audioCtx) return;

      const sanityFactor = Math.max(0.0, Math.min(1.0, mentalHealth / 100.0));
      const heartbeatInterval = 0.35 + 0.85 * sanityFactor;

      const now = performance.now() / 1000.0;
      if (now - this.lastHeartbeatTime >= heartbeatInterval) {
        this.lastHeartbeatTime = now;
        this.playHeartbeat();
      }
    }

    update_tension(mentalHealth, timeRemaining, dt) {
      this.updateTension(mentalHealth, timeRemaining, dt);
    }
  }

  return AudioSynthesizer;
});
