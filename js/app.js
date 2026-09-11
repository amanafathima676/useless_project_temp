/**
 * Oru Average Malayali — Act 1 Main Application Coordinator
 * Updated with the official 7-dimension psychometric career framework + free-text field.
 */

const QUESTIONNAIRE_STEPS = [
  {
    id: "flow_state",
    tag: "METRIC 01",
    title: "The \"Flow State\" Tracker",
    subtitle: "When you completely lose track of time, what are you doing?",
    type: "choice_with_custom",
    options: [
      { text: "Analyzing patterns & strategy games", icon: "📊", letter: "A" },
      { text: "Sketching, music & creative styling", icon: "🎨", letter: "B" },
      { text: "Helping friends & deep conversations", icon: "💬", letter: "C" },
      { text: "Hands-on building & experimenting", icon: "🛠️", letter: "D" }
    ],
    placeholder: "Or custom flow state..."
  },
  {
    id: "frustration_filter",
    tag: "METRIC 02",
    title: "The Frustration Filter",
    subtitle: "When a project turns chaotic, what is your first instinct?",
    type: "choice_with_custom",
    options: [
      { text: "Take charge & roadmap the project", icon: "📋", letter: "A" },
      { text: "Fix data & find the logical bottleneck", icon: "🔍", letter: "B" },
      { text: "Resolve conflicts & boost team morale", icon: "🤝", letter: "C" },
      { text: "Polish the output & protect quality", icon: "✨", letter: "D" }
    ],
    placeholder: "Or custom instinct..."
  },
  {
    id: "communication_medium",
    tag: "METRIC 03",
    title: "The Communication Medium",
    subtitle: "How do you naturally prefer explaining complex concepts?",
    type: "choice_with_custom",
    options: [
      { text: "Step-by-step written document", icon: "📝", letter: "A" },
      { text: "Visual diagram or flowchart", icon: "📊", letter: "B" },
      { text: "Face-to-face interactive talk", icon: "🗣️", letter: "C" },
      { text: "Working prototype or live demo", icon: "⚙️", letter: "D" }
    ],
    placeholder: "Or custom medium..."
  },
  {
    id: "core_driver",
    tag: "METRIC 04",
    title: "The Core Driver",
    subtitle: "At the end of the day, which achievement makes you proudest?",
    type: "choice_with_custom",
    options: [
      { text: "Cracking a complex technical puzzle", icon: "🧩", letter: "A" },
      { text: "Changing someone's life for the better", icon: "❤️", letter: "B" },
      { text: "Launching a product built from scratch", icon: "🚀", letter: "C" },
      { text: "Pitching a big idea or closing a deal", icon: "💼", letter: "D" }
    ],
    placeholder: "Or custom driver..."
  },
  {
    id: "curiosity_compass",
    tag: "METRIC 05",
    title: "The Curiosity Compass",
    subtitle: "When scrolling for pure entertainment, what naturally hooks you?",
    type: "choice_with_custom",
    options: [
      { text: "True crime & human psychology", icon: "🕵️", letter: "A" },
      { text: "Tech deep-dives & science trends", icon: "🔬", letter: "B" },
      { text: "Business strategy & economics", icon: "📈", letter: "C" },
      { text: "Art showcases, film & writing", icon: "🎬", letter: "D" }
    ],
    placeholder: "Or custom topic..."
  },
  {
    id: "energy_battery",
    tag: "METRIC 06",
    title: "The Energy Battery",
    subtitle: "Which environment leaves you feeling energized by Friday?",
    type: "choice_with_custom",
    options: [
      { text: "Quiet space for deep solo focus", icon: "🎧", letter: "A" },
      { text: "Lively, fast-paced team collaboration", icon: "⚡", letter: "B" },
      { text: "Structured corporate setting", icon: "🏢", letter: "C" },
      { text: "Dynamic travel or outdoor environment", icon: "🌍", letter: "D" }
    ],
    placeholder: "Or custom environment..."
  },
  {
    id: "legacy_metric",
    tag: "METRIC 07",
    title: "The Legacy Metric",
    subtitle: "Decades from now, what career legacy matters to you most?",
    type: "choice_with_custom",
    options: [
      { text: "Optimized data & efficient systems", icon: "⚙️", letter: "A" },
      { text: "Mentored people & elevated communities", icon: "🌱", letter: "B" },
      { text: "Tangible creations that outlast me", icon: "🏛️", letter: "C" },
      { text: "Led massive teams & grew organizations", icon: "👑", letter: "D" }
    ],
    placeholder: "Or custom legacy..."
  },
  {
    id: "wild_dream",
    tag: "OPTIONAL FREE-TEXT",
    title: "The Unfiltered Life Dream",
    subtitle: "What is your wild, unhinged ambition if society and relatives didn't exist?",
    type: "free_text",
    placeholder: "Be completely honest! Write a novel, build a beach cafe in Varkala, play acoustic guitar in Wayanad, make video games... Ammavan is listening."
  }
];

class AppCoordinator {
  constructor() {
    this.currentScreen = "title"; // 'title' | 'questions' | 'evaluating' | 'certificate' | 'transition'
    this.currentStepIndex = 0;
    this.candidateName = "";
    this.answers = {};
    this.initElements();
    this.bindEvents();
    this.updateAudioButtonState();
  }

  initElements() {
    this.screens = {
      title: document.getElementById("screenTitle"),
      questions: document.getElementById("screenQuestions"),
      evaluating: document.getElementById("screenEvaluating"),
      certificate: document.getElementById("screenCertificate"),
      transition: document.getElementById("screenTransition")
    };

    this.btnStart = document.getElementById("btnStart");
    this.btnPrev = document.getElementById("btnPrev");
    this.btnNext = document.getElementById("btnNext");
    this.progressBar = document.getElementById("progressBar");
    this.stepIndicator = document.getElementById("stepIndicator");
    this.questionContainer = document.getElementById("questionContainer");
    this.candidateNameInput = document.getElementById("candidateName");

    // Audio & Settings
    this.btnToggleAudio = document.getElementById("btnToggleAudio");
    this.btnSettings = document.getElementById("btnSettings");
    this.settingsModal = document.getElementById("settingsModal");
    this.btnCloseSettings = document.getElementById("btnCloseSettings");
    this.btnSaveSettings = document.getElementById("btnSaveSettings");
    this.inputGeminiKey = document.getElementById("inputGeminiKey");
    this.selectModel = document.getElementById("selectModel");
    this.apiStatusBadge = document.getElementById("apiStatusBadge");
  }

  bindEvents() {
    // Title Start Button
    this.btnStart.addEventListener("click", () => {
      audioManager.playClick();
      this.candidateName = this.candidateNameInput.value.trim() || "Aspirant";
      this.showScreen("questions");
      this.renderCurrentQuestion();
    });

    // Stepper Navigation
    this.btnPrev.addEventListener("click", () => {
      audioManager.playClick();
      if (this.currentStepIndex > 0) {
        this.saveCurrentStepAnswer();
        this.currentStepIndex--;
        this.renderCurrentQuestion();
      }
    });

    this.btnNext.addEventListener("click", () => {
      audioManager.playClick();
      this.handleNextStep();
    });

    // Enter Key shortcut for easy judge input
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        if (this.currentScreen === "title") {
          this.btnStart.click();
        } else if (this.currentScreen === "questions") {
          const activeEl = document.activeElement;
          if (activeEl && activeEl.tagName === "TEXTAREA" && e.ctrlKey) {
            this.handleNextStep();
          } else if (activeEl && activeEl.tagName !== "TEXTAREA") {
            this.handleNextStep();
          }
        }
      }
    });

    // Audio Toggle
    if (this.btnToggleAudio) {
      this.btnToggleAudio.addEventListener("click", () => {
        const isMuted = audioManager.toggleMute();
        this.updateAudioButtonState();
        if (!isMuted) audioManager.playClick();
      });
    }

    // Settings Modal
    if (this.btnSettings) {
      this.btnSettings.addEventListener("click", () => {
        audioManager.playClick();
        this.openSettingsModal();
      });
    }

    this.btnCloseSettings.addEventListener("click", () => {
      audioManager.playClick();
      this.settingsModal.classList.add("hidden");
    });

    this.btnSaveSettings.addEventListener("click", () => {
      audioManager.playClick();
      setStoredApiKey(this.inputGeminiKey.value);
      setStoredModel(this.selectModel.value);
      this.updateApiStatusBadge();
      this.settingsModal.classList.add("hidden");
    });

    this.updateApiStatusBadge();

    // Reset Station Kiosk Button
    const resetBtn = document.getElementById("reset-station-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        audioManager.playClick();
        sessionStorage.clear();
        localStorage.removeItem("oru_average_malayali_session");
        this.restart();
      });
    }

    // Floating Badges on Clay Diorama
    const badgePressure = document.getElementById("badgePressure");
    const badgeUncle = document.getElementById("badgeUncle");
    const tooltip = document.getElementById("badgeTooltip");

    if (badgePressure && tooltip) {
      badgePressure.addEventListener("click", (e) => {
        e.stopPropagation();
        audioManager.playClick();
        if (!tooltip.classList.contains("hidden") && tooltip.dataset.type === "pressure") {
          tooltip.classList.add("hidden");
        } else {
          tooltip.dataset.type = "pressure";
          tooltip.textContent = "Societal metric: 42 maternal aunts and 14 WhatsApp family groups awaiting engineering entrance results.";
          tooltip.classList.remove("hidden");
        }
      });
    }

    if (badgeUncle && tooltip) {
      badgeUncle.addEventListener("click", (e) => {
        e.stopPropagation();
        audioManager.playClick();
        if (!tooltip.classList.contains("hidden") && tooltip.dataset.type === "uncle") {
          tooltip.classList.add("hidden");
        } else {
          tooltip.dataset.type = "uncle";
          tooltip.textContent = "Tribunal verdict: UAE and Dallas relatives evaluating matrimonial prospects vs B.Tech.";
          tooltip.classList.remove("hidden");
        }
      });
    }

    document.addEventListener("click", (e) => {
      if (tooltip && !tooltip.contains(e.target) && e.target !== badgePressure && e.target !== badgeUncle) {
        tooltip.classList.add("hidden");
      }
    });
  }

  updateAudioButtonState() {
    const isMuted = audioManager.getMuted();
    if (!this.btnToggleAudio) return;
    this.btnToggleAudio.innerHTML = isMuted ? "🔇 Sound: OFF" : "🔊 Sound: ON";
    this.btnToggleAudio.classList.toggle("btn-muted", isMuted);
  }

  openSettingsModal() {
    this.inputGeminiKey.value = getStoredApiKey();
    this.selectModel.value = getStoredModel();
    this.settingsModal.classList.remove("hidden");
  }

  updateApiStatusBadge() {
    const hasKey = !!getStoredApiKey();
    if (this.apiStatusBadge) {
      if (hasKey) {
        this.apiStatusBadge.className = "status-badge badge-online";
        this.apiStatusBadge.innerHTML = `<span class="badge-dot"></span> Live Gemini Mode (${getStoredModel()})`;
      } else {
        this.apiStatusBadge.className = "status-badge badge-fallback";
        this.apiStatusBadge.innerHTML = `<span class="badge-dot"></span> Offline Fallback Mode (100% Reliable)`;
      }
    }
  }

  showScreen(screenName) {
    this.currentScreen = screenName;
    Object.keys(this.screens).forEach((name) => {
      if (this.screens[name]) {
        this.screens[name].classList.toggle("hidden", name !== screenName);
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderCurrentQuestion() {
    const step = QUESTIONNAIRE_STEPS[this.currentStepIndex];
    const totalSteps = QUESTIONNAIRE_STEPS.length;

    // Update Progress
    const progressPercent = Math.round(((this.currentStepIndex + 1) / totalSteps) * 100);
    this.progressBar.style.width = `${progressPercent}%`;
    this.stepIndicator.textContent = `STEP ${this.currentStepIndex + 1} OF ${totalSteps}`;

    // Manage Prev button
    this.btnPrev.disabled = this.currentStepIndex === 0;

    // Next button label
    const isLast = this.currentStepIndex === totalSteps - 1;
    this.btnNext.innerHTML = isLast 
      ? `<span>Consult Ammavan Council</span> <span class="btn-icon">⚡</span>`
      : `<span>Next Step</span> <span class="btn-icon">→</span>`;

    const savedAnswer = this.answers[step.id] || "";

    if (step.type === "free_text") {
      this.questionContainer.innerHTML = `
        <div class="step-card animate-fadeIn">
          <span class="step-badge">${step.tag}</span>
          <h2 class="step-title">${step.title}</h2>
          <p class="step-subtitle">${step.subtitle}</p>
          <div class="free-text-wrap">
            <textarea id="freeTextInput" class="form-textarea" rows="4" placeholder="${step.placeholder}">${savedAnswer}</textarea>
            <div class="textarea-hint">Press Enter or click the button below to generate your destiny</div>
          </div>
        </div>
      `;
      setTimeout(() => {
        const input = document.getElementById("freeTextInput");
        if (input) input.focus();
      }, 50);
    } else {
      const optionsHtml = step.options.map((opt, idx) => {
        const isSelected = savedAnswer === opt.text;
        return `
          <button type="button" class="option-card ${isSelected ? 'selected' : ''}" data-index="${idx}" data-value="${opt.text}">
            <span class="option-letter">${opt.letter}</span>
            <span class="option-icon">${opt.icon}</span>
            <span class="option-text">${opt.text}</span>
            <span class="option-check">${isSelected ? '✓' : ''}</span>
          </button>
        `;
      }).join("");

      this.questionContainer.innerHTML = `
        <div class="step-card animate-fadeIn">
          <span class="step-badge">${step.tag}</span>
          <h2 class="step-title">${step.title}</h2>
          <p class="step-subtitle">${step.subtitle}</p>
          <div class="options-grid">
            ${optionsHtml}
          </div>
          <div class="custom-answer-row">
            <span class="custom-label">Custom Input:</span>
            <input type="text" id="customInput" class="form-input" placeholder="${step.placeholder}" value="${step.options.some(o => o.text === savedAnswer) ? '' : savedAnswer}">
          </div>
        </div>
      `;

      // Attach option click listeners
      const optionCards = this.questionContainer.querySelectorAll(".option-card");
      optionCards.forEach(card => {
        card.addEventListener("click", () => {
          audioManager.playClick();
          optionCards.forEach(c => {
            c.classList.remove("selected");
            const check = c.querySelector(".option-check");
            if (check) check.textContent = "";
          });
          card.classList.add("selected");
          const check = card.querySelector(".option-check");
          if (check) check.textContent = "✓";

          // Clear custom input if an option was clicked
          const customInput = document.getElementById("customInput");
          if (customInput) customInput.value = "";

          // Automatically advance to next step for fast demo flow!
          setTimeout(() => {
            this.handleNextStep();
          }, 240);
        });
      });

      // If user types in custom input, deselect cards
      const customInput = document.getElementById("customInput");
      if (customInput) {
        customInput.addEventListener("input", () => {
          optionCards.forEach(c => {
            c.classList.remove("selected");
            const check = c.querySelector(".option-check");
            if (check) check.textContent = "";
          });
        });
      }
    }
  }

  saveCurrentStepAnswer() {
    const step = QUESTIONNAIRE_STEPS[this.currentStepIndex];
    if (step.type === "free_text") {
      const input = document.getElementById("freeTextInput");
      this.answers[step.id] = input ? input.value.trim() : "";
    } else {
      const customInput = document.getElementById("customInput");
      const customVal = customInput ? customInput.value.trim() : "";
      if (customVal) {
        this.answers[step.id] = customVal;
      } else {
        const selectedCard = this.questionContainer.querySelector(".option-card.selected");
        this.answers[step.id] = selectedCard ? selectedCard.getAttribute("data-value") : "";
      }
    }
  }

  handleNextStep() {
    this.saveCurrentStepAnswer();

    const isLast = this.currentStepIndex === QUESTIONNAIRE_STEPS.length - 1;
    if (isLast) {
      audioManager.playStep();
      this.startEvaluation();
    } else {
      audioManager.playStep();
      this.currentStepIndex++;
      this.renderCurrentQuestion();
    }
  }

  async startEvaluation() {
    this.showScreen("evaluating");

    // Dynamic humorous loading text cycles
    const loadingMessages = [
      "Transmitting psychometric profile to Ammavan Council...",
      "Converting Flow State data into KTU B.Tech Engineering syllabus...",
      "Consulting Brilliant Pala entrance coaching prospectus...",
      "Factoring in Shaji Uncle's matrimonial dowry benchmarks...",
      "Synthesizing NHS Manchester night-shift nursing quota...",
      "Finalizing infallible Malayali relative justification..."
    ];

    const loadSubEl = document.getElementById("evaluatingSubtitle");
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      if (loadSubEl) loadSubEl.textContent = loadingMessages[msgIdx];
    }, 700);

    // Call evaluateCareerVerdict (which guarantees sub-5-second resolution via 4.5s race timeout)
    try {
      const result = await evaluateCareerVerdict(this.answers, this.candidateName);
      clearInterval(interval);
      this.displayCertificate(result.verdict);
    } catch (err) {
      clearInterval(interval);
      console.error("Evaluation error:", err);
      // Failsafe fallback
      const fallback = getFallbackVerdict(this.answers);
      this.displayCertificate(fallback);
    }
  }

  displayCertificate(verdictData) {
    this.showScreen("certificate");
    audioManager.playRevealFanfare();
    renderCareerCertificate(
      this.screens.certificate,
      verdictData,
      this.candidateName,
      this.answers
    );
  }

  showTransitionScreen(sessionData) {
    this.showScreen("transition");
    const container = this.screens.transition;

    container.innerHTML = `
      <div class="transition-card animate-fadeIn">
        <span class="transition-badge">ACT 1 COMPLETE → ENTERING ACT 2</span>
        <h1 class="transition-title">The Career Has Been Mandated.</h1>
        <p class="transition-sub">Now comes reality. Welcome to the Indian Education Machine.</p>

        <div class="transition-verdict-box">
          <span class="flavor-label">Act 2 Simulation Mode:</span>
          <h2 class="flavor-verdict">${sessionData.careerVerdict} Edition</h2>
          <p class="flavor-desc">
            Candidate: <strong>${sessionData.candidateName}</strong><br>
            Allotted Stream: <strong>${sessionData.streamBadge}</strong>
          </p>
        </div>

        <div class="transition-act2-preview">
          <h3>🎮 ACT 2: INDIAN EDUCATION MACHINE</h3>
          <p>
            In Act 2 (developed by Person B), you will sit in front of the webcam and physically juggle 
            8 dimensions of student life (Assignments, Hackathons, Placement Prep, Sleep, Friends, etc.) 
            for 60 grueling seconds.
          </p>
          <div class="act2-launch-box">
            <p><strong>To launch Act 2:</strong></p>
            <div class="launch-options">
              <a href="act2.html?candidate=${encodeURIComponent(sessionData.candidateName)}&verdict=${encodeURIComponent(sessionData.careerVerdict)}" class="btn btn-primary" id="btnLaunchAct2Web">
                ⚡ Open Act 2 Web Interface (act2.html)
              </a>
              <button class="btn btn-outline" id="btnCopySessionJson">
                📋 Copy Session JSON (for Python / CV bridge)
              </button>
            </div>
            <p class="bridge-hint">Session state is also saved in <code>localStorage['oru_average_malayali_session']</code></p>
          </div>
        </div>

        <div class="transition-footer">
          <button class="btn btn-secondary" id="btnBackToCert">← Back to Certificate</button>
          <button class="btn btn-outline" id="btnFullReset">🔄 Full Reset (New Candidate)</button>
        </div>
      </div>
    `;

    document.getElementById("btnBackToCert").addEventListener("click", () => {
      audioManager.playClick();
      this.showScreen("certificate");
    });

    document.getElementById("btnFullReset").addEventListener("click", () => {
      audioManager.playClick();
      this.restart();
    });

    const btnCopy = document.getElementById("btnCopySessionJson");
    if (btnCopy) {
      btnCopy.addEventListener("click", () => {
        audioManager.playClick();
        navigator.clipboard.writeText(JSON.stringify(sessionData, null, 2)).then(() => {
          btnCopy.innerHTML = "✓ Copied to Clipboard!";
          setTimeout(() => {
            btnCopy.innerHTML = "📋 Copy Session JSON (for Python / CV bridge)";
          }, 2000);
        });
      });
    }
  }

  restart() {
    this.currentStepIndex = 0;
    this.answers = {};
    this.candidateNameInput.value = "";
    this.candidateName = "";
    this.showScreen("title");
  }
}

// Instantiate on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.appCoordinator = new AppCoordinator();
});
