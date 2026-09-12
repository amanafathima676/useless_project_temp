/**
 * Main Application for Act 2: Indian Education Machine
 * Project: Oru Average Malayali (Useless Projects Hackathon 3.0)
 *
 * Full Browser JavaScript implementation replacing Pygame/OpenCV:
 * - Real-time camera mirror feed via HTML5 MediaDevices
 * - 4-Directional hand/mouse survival simulator with exact tradeoffs
 * - Web Audio procedural sound generation & dynamic tension heartbeat
 * - HTML5 Canvas 8-Axis Radar Chart & Cyber HUD overlay
 * - Complete 4-metric Result Card with certified burnout punchline
 */

class IndianEducationMachineApp {
  constructor() {
    this.STATE_INTRO = "INTRO";
    this.STATE_COUNTDOWN = "COUNTDOWN";
    this.STATE_PLAYING = "PLAYING";
    this.STATE_RESULT = "RESULT";

    this.state = this.STATE_INTRO;
    this.roundDuration = 30.0;
    this.roundTimeLeft = this.roundDuration;
    this.countdownTimer = 3.0;
    this.lastTickSec = Math.floor(this.roundDuration);
    this.lastZoneId = null;

    // Load session info from localStorage or URL params
    this.session = this._loadSession();

    // DOM Elements
    this.videoEl = document.getElementById("act2Video");
    this.hudCanvas = document.getElementById("act2HudCanvas");
    this.radarCanvas = document.getElementById("act2RadarCanvas");
    this.timerEl = document.getElementById("act2Timer");
    this.activeZoneEl = document.getElementById("act2ActiveZoneBox");
    this.introOverlay = document.getElementById("act2IntroOverlay");
    this.countdownOverlay = document.getElementById("act2CountdownOverlay");
    this.countdownNumber = document.getElementById("act2CountdownNumber");
    this.resultContainer = document.getElementById("act2ResultContainer");
    this.bannerEl = document.getElementById("act2Banner");
    this.modeBadge = document.getElementById("act2ModeBadge");

    // Direction Pills
    this.pills = {
      academics: document.getElementById("pillAcademics"),
      hackathons: document.getElementById("pillHackathons"),
      skill_dev: document.getElementById("pillSkillDev"),
      arts_sports: document.getElementById("pillArtsSports")
    };

    // Stat bars & labels
    this.statElements = {
      academics: { bar: document.getElementById("barAcademics"), val: document.getElementById("valAcademics") },
      hackathons: { bar: document.getElementById("barHackathons"), val: document.getElementById("valHackathons") },
      skill_dev: { bar: document.getElementById("barSkillDev"), val: document.getElementById("valSkillDev") },
      arts_sports: { bar: document.getElementById("barArtsSports"), val: document.getElementById("valArtsSports") }
    };

    // Vitals elements
    this.vitalElements = {
      sleep: document.getElementById("vitalSleep"),
      happiness: document.getElementById("vitalHappiness"),
      passion: document.getElementById("vitalPassion"),
      mental: document.getElementById("vitalMental")
    };

    // Sub-modules
    this.zoneMapper = new (window.ZoneMapper || require("./zone-mapper").ZoneMapper)(0.18);
    this.statEngine = new (window.StatEngine || require("./stat-engine"))();
    this.audio = new (window.AudioSynthesizer || require("./audio-synthesizer"))();
    this.resultCard = new (window.ResultCard || require("./result-card"))();
    this.radarChart = new (window.RadarChart || require("./radar-chart"))(100, 100, 68);
    this.handTracker = new (window.HandTracker || require("./hand-tracker"))(this.videoEl, this.hudCanvas);

    this.lastFrameTime = performance.now();
    this.animationFrameId = null;

    this._initEvents();
    this._updateBanner();
  }

  _loadSession() {
    const params = new URLSearchParams(window.location.search);
    const candidate = params.get("candidate");
    const verdict = params.get("verdict");

    let stored = null;
    try {
      const raw = localStorage.getItem("oru_average_malayali_session");
      if (raw) stored = JSON.parse(raw);
    } catch (e) {}

    return {
      candidateName: candidate || stored?.candidate_name || stored?.candidateName || "Aspirant",
      careerVerdict: verdict || stored?.career_verdict || stored?.careerVerdict || "B.Tech Engineering Edition",
      streamBadge: stored?.stream_badge || stored?.streamBadge || "ENGINEER PATHWAY"
    };
  }

  _updateBanner() {
    if (this.bannerEl) {
      this.bannerEl.textContent = `SIMULATING: ${this.session.careerVerdict.toUpperCase()} (${this.session.candidateName})`;
    }
  }

  _initEvents() {
    // Keyboard controls
    window.addEventListener("keydown", e => {
      if (e.code === "Space" || e.code === "Enter") {
        if (this.state === this.STATE_INTRO) {
          this.startCountdown();
        } else if (this.state === this.STATE_RESULT) {
          this.resetRound();
        }
      } else if (e.key === "r" || e.key === "R") {
        this.resetRound();
      } else if (e.key === "m" || e.key === "M") {
        this.toggleMouseMode();
      } else if (e.key === "Escape") {
        window.location.href = "index.html";
      }
    });

    // Mouse tracking fallback
    const feedContainer = document.getElementById("act2FeedContainer");
    if (feedContainer) {
      feedContainer.addEventListener("mousemove", e => {
        if (this.handTracker.useMouseFallback) {
          const rect = feedContainer.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;
          this.handTracker.setMousePosition(rect.width, rect.height, mx, my);
        }
      });

      feedContainer.addEventListener("click", () => {
        if (this.state === this.STATE_INTRO) {
          this.startCountdown();
        }
      });
    }

    // Buttons
    const btnStartIntro = document.getElementById("btnStartAct2Intro");
    if (btnStartIntro) {
      btnStartIntro.addEventListener("click", () => this.startCountdown());
    }

    const btnToggleMouse = document.getElementById("btnToggleMouse");
    if (btnToggleMouse) {
      btnToggleMouse.addEventListener("click", () => this.toggleMouseMode());
    }

    // Auto-resize canvas elements
    window.addEventListener("resize", () => this._syncCanvasSizes());
    this._syncCanvasSizes();
  }

  _syncCanvasSizes() {
    if (this.hudCanvas && this.videoEl) {
      const rect = this.videoEl.getBoundingClientRect();
      this.hudCanvas.width = rect.width || 640;
      this.hudCanvas.height = rect.height || 480;
    }
  }

  toggleMouseMode() {
    const isMouse = this.handTracker.toggleMouseFallback();
    if (this.modeBadge) {
      this.modeBadge.textContent = isMouse ? "MOUSE MODE (PRESS M)" : "WEBCAM HAND TRACKING";
      this.modeBadge.className = isMouse ? "mode-badge mouse-active" : "mode-badge cam-active";
    }
  }

  async start() {
    // Attempt camera initialization
    await this.handTracker.initCamera();
    this._syncCanvasSizes();

    // Start render loop
    this.lastFrameTime = performance.now();
    this.loop();
  }

  startCountdown() {
    this.state = this.STATE_COUNTDOWN;
    this.countdownTimer = 3.0;
    if (this.introOverlay) this.introOverlay.classList.add("hidden");
    if (this.countdownOverlay) this.countdownOverlay.classList.remove("hidden");
    if (this.resultContainer) this.resultContainer.classList.add("hidden");
  }

  resetRound() {
    this.statEngine.reset();
    this.roundTimeLeft = this.roundDuration;
    this.countdownTimer = 3.0;
    this.lastZoneId = null;
    this.lastTickSec = Math.floor(this.roundDuration);

    if (this.resultContainer) {
      this.resultContainer.classList.add("hidden");
      this.resultContainer.innerHTML = "";
    }
    if (this.introOverlay) this.introOverlay.classList.add("hidden");

    this.state = this.STATE_PLAYING;
    this.audio.playZoneSwitch();
  }

  loop() {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.lastFrameTime) / 1000.0);
    this.lastFrameTime = now;

    this.update(dt);
    this.render();

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  update(dt) {
    // Hand tracking & Cyber HUD
    const { detected, normX, normY } = this.handTracker.processFrame();
    const zoneInfo = this.zoneMapper.mapPosition(normX, normY);

    if (this.state === this.STATE_COUNTDOWN) {
      this.countdownTimer -= dt;
      if (this.countdownNumber) {
        this.countdownNumber.textContent = Math.ceil(this.countdownTimer);
      }
      if (this.countdownTimer <= 0) {
        this.state = this.STATE_PLAYING;
        if (this.countdownOverlay) this.countdownOverlay.classList.add("hidden");
        this.audio.playZoneSwitch();
      }
    } else if (this.state === this.STATE_PLAYING) {
      this.roundTimeLeft -= dt;

      // Audio Second Ticks
      const secLeft = Math.floor(this.roundTimeLeft);
      if (secLeft !== this.lastTickSec && secLeft >= 0) {
        this.lastTickSec = secLeft;
        if (secLeft <= 10) {
          this.audio.playPanic();
        } else {
          this.audio.playTick();
        }
      }

      // Zone Switch Audio & Highlighting
      let activeId = null;
      if (!zoneInfo.is_dead_zone && zoneInfo.zone) {
        activeId = zoneInfo.zone.id;
        if (activeId !== this.lastZoneId) {
          this.lastZoneId = activeId;
          this.audio.playZoneSwitch();
        }
      } else {
        this.lastZoneId = null;
      }

      // Update Engine Stats & Vitals
      this.statEngine.tick(activeId, dt);

      // Tension Heartbeat
      const vitals = this.statEngine.getVitals();
      this.audio.updateTension(vitals.mental_stability, this.roundTimeLeft, dt);

      // Update Direction Pills
      Object.keys(this.pills).forEach(id => {
        const pill = this.pills[id];
        if (pill) {
          if (id === activeId) pill.classList.add("active");
          else pill.classList.remove("active");
        }
      });

      // Timer Expiry
      if (this.roundTimeLeft <= 0) {
        this.roundTimeLeft = 0;
        this.state = this.STATE_RESULT;
        this.audio.playBuzzer();
        this.audio.playSuccess();
        this._showResultCard();
      }
    }

    this.radarChart.update(dt);
  }

  _showResultCard() {
    if (!this.resultContainer) return;
    const results = this.statEngine.calculateResults();
    this.resultContainer.innerHTML = this.resultCard.renderHTML(results);
    this.resultContainer.classList.remove("hidden");

    // Wire up restart button inside rendered card
    const btnRestart = document.getElementById("btnRestartAct2");
    if (btnRestart) {
      btnRestart.addEventListener("click", () => this.resetRound());
    }
  }

  render() {
    // 1. Timer Display
    if (this.timerEl) {
      const sec = Math.max(0, Math.ceil(this.roundTimeLeft));
      this.timerEl.textContent = `00:${sec < 10 ? "0" + sec : sec}`;
      if (sec <= 10) {
        this.timerEl.classList.add("timer-panic");
      } else {
        this.timerEl.classList.remove("timer-panic");
      }
    }

    // 2. Active Zone Box
    if (this.activeZoneEl) {
      const { normX, normY } = this.handTracker;
      const zoneInfo = this.zoneMapper.mapPosition(normX, normY);

      if (!zoneInfo.is_dead_zone && zoneInfo.zone) {
        const z = zoneInfo.zone;
        this.activeZoneEl.innerHTML = `
          <div class="active-zone-badge" style="color: ${z.hex}">
            <span>ACTIVE: ${z.arrow} ${z.name.toUpperCase()}</span>
          </div>
          <span class="active-penalty-note">Decreasing: ${z.penalty_text}</span>
        `;
        this.activeZoneEl.style.borderColor = z.hex;
      } else {
        this.activeZoneEl.innerHTML = `
          <div class="active-zone-badge text-muted">
            <span>HOLDING NEUTRAL (CENTER)</span>
          </div>
          <span class="active-penalty-note">Move ⬆️ ➡️ ⬇️ ⬅️ to focus</span>
        `;
        this.activeZoneEl.style.borderColor = "var(--border-glass)";
      }
    }

    // 3. Stat Bars
    const stats = this.statEngine.getAllStats();
    Object.keys(this.statElements).forEach(k => {
      const el = this.statElements[k];
      if (el.bar && el.val) {
        const val = stats[k] || 50;
        el.bar.style.width = `${val}%`;
        el.val.textContent = `${Math.round(val)}%`;
      }
    });

    // 4. Vitals Ticker
    const vitals = this.statEngine.getVitals();
    if (this.vitalElements.sleep) this.vitalElements.sleep.textContent = `${vitals.sleep_hours} hrs`;
    if (this.vitalElements.happiness) this.vitalElements.happiness.textContent = `${vitals.happiness}%`;
    if (this.vitalElements.passion) this.vitalElements.passion.textContent = `${vitals.passion}%`;
    if (this.vitalElements.mental) {
      this.vitalElements.mental.textContent = `${vitals.mental_stability}%`;
      if (vitals.mental_stability <= 25) {
        this.vitalElements.mental.className = "vital-val danger-stat blink";
      } else {
        this.vitalElements.mental.className = "vital-val danger-stat";
      }
    }

    // 5. Radar Chart Canvas
    if (this.radarCanvas) {
      const ctx = this.radarCanvas.getContext("2d");
      ctx.clearRect(0, 0, this.radarCanvas.width, this.radarCanvas.height);
      const combinedStats = {
        ...stats,
        mental_health: vitals.mental_stability
      };
      this.radarChart.draw(ctx, combinedStats);
    }
  }
}

// Auto-start when act2.html loads
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    window.act2App = new IndianEducationMachineApp();
    window.act2App.start();
  });
}
