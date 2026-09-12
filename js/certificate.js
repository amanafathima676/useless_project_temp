/**
 * Oru Average Malayali — Career Certificate Renderer & Act 2 Bridge
 * Renders the official "Certificate of Inevitable Destiny"
 * Features:
 * - "Time to start ur career" button (launches Act 2)
 * - "I don't want this career" button (displays forceful Indian society reality check & defaults to game)
 */

function renderCareerCertificate(container, verdictData, candidateName, answers) {
  const serialNo = "KL-" + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const displayName = candidateName.trim() || "Aspirant";
  const {
    career_verdict,
    stream_badge,
    malayali_subheading,
    ammavan_quote
  } = verdictData;

  // Determine stream accent class
  let streamClass = "stream-eng";
  if (stream_badge && stream_badge.includes("DOCTOR")) {
    streamClass = "stream-med";
  } else if (stream_badge && stream_badge.includes("NURSING")) {
    streamClass = "stream-nurse";
  }

  const html = `
    <div class="certificate-wrapper animate-fadeIn">
      <div class="certificate-frame">
        <!-- Kasavu Gold Corner Ornaments -->
        <div class="corner-ornament top-left"></div>
        <div class="corner-ornament top-right"></div>
        <div class="corner-ornament bottom-left"></div>
        <div class="corner-ornament bottom-right"></div>

        <!-- Official Header -->
        <div class="cert-header">
          <div class="cert-emblem">
            <div class="emblem-inner">
              <span class="emblem-star">★</span>
              <span class="emblem-label">GOVT OF MALAYALI EXPECTATIONS</span>
              <span class="emblem-year">ESTD. 1956</span>
            </div>
          </div>
          <p class="cert-dept">DEPARTMENT OF AMMAVAN CAREER ALLOCATION & OVERSEAS EXODUS</p>
          <h1 class="cert-title">CERTIFICATE OF INEVITABLE DESTINY</h1>
          <p class="cert-rule">ISSUED UNDER SECTION 42(A) OF UNQUESTIONABLE PARENTAL COERCION ACT</p>
          <div class="cert-meta-row">
            <span><strong>SERIAL NO:</strong> ${serialNo}</span>
            <span><strong>DATE:</strong> ${dateStr}</span>
            <span><strong>LOCATION:</strong> Central Travancore</span>
          </div>
        </div>

        <!-- Hero Meme Image (plain, no box) -->
        <div class="cert-hero-meme">
          <img 
            src="assets/virus_meme.png" 
            alt="Son you can be anything you want: Doctor or Engineer meme" 
            class="cert-meme-img"
          >
        </div>

        <div class="cert-divider"></div>

        <!-- Candidate Introduction -->
        <div class="cert-body">
          <p class="cert-text">
            This is to solemnly certify that <strong class="cert-candidate-name">${displayName}</strong>, 
            having submitted their psychometric profile, personal calling, and creative aspirations for evaluation, 
            has been rigorously analyzed by the Council of Maternal Uncles.
          </p>
          <p class="cert-text">
            All submitted personal preferences have been declared culturally non-viable and summarily overruled. 
            The candidate is hereby unconditionally allocated to:
          </p>

          <!-- The Big Verdict Box -->
          <div class="verdict-banner ${streamClass}">
            <span class="stream-pill">${stream_badge || "INDEPENDENT DESTINY"}</span>
            <h2 class="verdict-title">${career_verdict}</h2>
            <p class="verdict-sub">${malayali_subheading || "Universal Malayali Safety Net"}</p>
          </div>

          <!-- Signatures & Official Stamp -->
          <div class="cert-footer">
            <div class="signature-block">
              <div class="sig-line cursive-sig">K. R. Sankaranarayanan</div>
              <span class="sig-title">Retd. PWD Assistant Overseer</span>
              <span class="sig-sub">Chief Patriarchal Arbitrator</span>
            </div>

            <!-- The Red Rubber Stamp (Animated Landing + Interactive Re-Stamp) -->
            <div class="stamp-container" title="Click stamp to re-ratify!">
              <div class="rubber-stamp" id="rubberStamp">
                <div class="stamp-border">
                  <div class="stamp-inner-text">
                    <span>MALAYALI VERIFIED</span>
                    <strong class="stamp-approved">APPROVED</strong>
                    <span>100% AMMAVAN CERTIFIED</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="signature-block">
              <div class="sig-line cursive-sig">P. K. Shaji (Gulf)</div>
              <span class="sig-title">Senior Air Conditioning Tech, Sharjah</span>
              <span class="sig-sub">Diaspora Matrimonial Officer</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Panel for Judge & Operator -->
      <div class="cert-actions no-print">
        <button class="btn btn-primary btn-proceed" id="btnStartTimeCareer">
          <span class="btn-icon">⚡</span>
          <span>Time to start ur career</span>
        </button>

        <button class="btn btn-reject" id="btnRejectCareer">
          <span class="btn-icon">🚨</span>
          <span>I don't want this career</span>
        </button>

        <button class="btn btn-secondary" id="btnPrintCert">
          <span class="btn-icon">🖨️</span>
          <span>Print / Save Certificate</span>
        </button>

        <button class="btn btn-outline" id="btnRestartAct1">
          <span class="btn-icon">🔄</span>
          <span>Evaluate Another Aspirant</span>
        </button>
      </div>

      <!-- Real-Time OpenCV Person 2 Manager Status Banner -->
      <div id="act2StatusContainer" class="act2-status-container hidden no-print"></div>
    </div>

    <!-- Forceful Society Rejection Modal -->
    <div id="rejectionModal" class="modal-overlay hidden" role="dialog" aria-modal="true">
      <div class="modal-content reject-modal animate-fadeIn">
        <div class="modal-alert-icon">🚨</div>
        <h2 class="reject-title">APPEAL SUMMARILY REJECTED</h2>
        
        <div class="reject-quote-card">
          <p class="reject-quote-text">"It's Indian society, you don't have another option."</p>
        </div>

        <p class="reject-subtext">
          All maternal uncles, temple committee elders, and matrimonial brokers have already ratified this decision.<br>
          <strong>Free will was deprecated in Kerala in 1982.</strong>
        </p>

        <div class="reject-countdown-bar">
          <span>Forcefully redirecting you to your mandated career in <strong id="rejectTimer">3</strong>s...</span>
        </div>

        <div class="modal-footer" style="justify-content: center; margin-top: 1.25rem;">
          <button id="btnForceAccept" class="btn btn-primary btn-proceed">
            <span>Accept Inevitable Fate Now</span>
            <span class="btn-icon">⚡</span>
          </button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Trigger dramatic rubber stamp landing and sound after a tiny 400ms delay
  setTimeout(() => {
    const stamp = document.getElementById("rubberStamp");
    if (stamp) {
      stamp.classList.add("stamp-dropped");
      if (typeof audioManager !== "undefined") {
        audioManager.playStampThud();
      }
    }
  }, 450);

  // Interactive Re-stamp on the rubber stamp
  const stampEl = document.getElementById("rubberStamp");
  if (stampEl) {
    stampEl.addEventListener("click", () => {
      if (typeof audioManager !== "undefined") {
        audioManager.playStampThud();
      }
      stampEl.classList.remove("stamp-dropped");
      void stampEl.offsetWidth; // trigger reflow
      stampEl.classList.add("stamp-dropped");

      const tip = document.createElement("div");
      tip.className = "stamp-reclick-tip animate-fadeIn";
      tip.textContent = "✓ Re-Ratified by 42 Maternal Aunts!";
      stampEl.parentElement.appendChild(tip);
      setTimeout(() => tip.remove(), 1800);
    });
  }


  // Session Data bundle for Act 2
  const sessionData = {
    candidateName: displayName,
    careerVerdict: career_verdict,
    streamBadge: stream_badge,
    ammavanQuote: ammavan_quote,
    timestamp: new Date().toISOString(),
    completedAct1: true
  };

  const btnStart = document.getElementById("btnStartTimeCareer");
  const statusContainer = document.getElementById("act2StatusContainer");

  function renderStatusBanner(state = "running", errorMsg = "") {
    if (!statusContainer) return;
    statusContainer.classList.remove("hidden");

    if (state === "launching") {
      statusContainer.innerHTML = `
        <div class="act2-banner-card banner-state-launching animate-fadeIn">
          <div class="banner-top-row">
            <div class="banner-badge-live">
              <span class="live-dot"></span>
              <span>LAUNCHING SURVIVAL SIMULATOR…</span>
            </div>
            <span class="banner-sub">Act 2: Interactive Web Experience</span>
          </div>
          <h3 class="banner-title">🚀 Starting the Indian Education Machine…</h3>
          <p class="banner-note">
            Initializing camera and survival arena. Entering in 1 second...
          </p>
          <div style="margin-top: 0.75rem;">
            <a href="act2.html" class="btn btn-primary btn-sm">
              <span>🎮 Enter Survival Arena Now →</span>
            </a>
          </div>
        </div>
      `;
    } else if (state === "error") {
      statusContainer.innerHTML = `
        <div class="act2-banner-card banner-state-error animate-fadeIn">
          <div class="banner-top-row">
            <div class="banner-badge-error">
              <span class="error-dot"></span>
              <span>LOCAL SERVER NOTICE</span>
            </div>
            <span class="banner-sub">Standalone Web Mode Active</span>
          </div>
          <h3 class="banner-title">🎮 Entering Act 2 in Browser Mode</h3>
          <p class="banner-note">
            ${errorMsg ? `<strong>Note:</strong> ${errorMsg}<br>` : ""}
            Act 2 runs directly in your browser with full webcam hand-tracking and mouse mode!
          </p>
          <div class="banner-footer-row" style="margin-top: 0.75rem;">
            <a href="act2.html" class="btn btn-primary btn-sm">
              <span>🚀 Launch Act 2 in Browser →</span>
            </a>
            <span class="banner-terminal-hint">Start server: <code>node server.js</code></span>
          </div>
        </div>
      `;
    } else {
      statusContainer.innerHTML = `
        <div class="act2-banner-card animate-fadeIn">
          <div class="banner-top-row">
            <div class="banner-badge-live">
              <span class="live-dot"></span>
              <span>ACT 2 SIMULATOR ACTIVE</span>
            </div>
            <span class="banner-sub">Interactive 30-Second Challenge</span>
          </div>
          <h3 class="banner-title">🎮 Indian Education Machine Ready!</h3>
          <p class="banner-note">
            Your career profile has been locked in. Survive the 4-direction tradeoff challenge!
          </p>
          <div class="banner-rules-row">
            <div class="rule-chip up">⬆️ UP: Academics <small>(Arts -20%)</small></div>
            <div class="rule-chip right">➡️ RIGHT: Hackathons <small>(Acads -20%)</small></div>
            <div class="rule-chip down">⬇️ DOWN: Skill Dev <small>(Hacks -20%)</small></div>
            <div class="rule-chip left">⬅️ LEFT: Arts & Sports <small>(Skills -20%)</small></div>
          </div>
          <div class="banner-footer-row" style="margin-top: 1rem;">
            <a href="act2.html" class="btn btn-primary" id="btnGoAct2">
              <span>🎮 Enter Survival Arena →</span>
            </a>
          </div>
        </div>
      `;
    }

    const btnRelaunch = document.getElementById("btnRelaunchAct2");
    if (btnRelaunch) {
      btnRelaunch.addEventListener("click", () => {
        triggerAct2Handoff();
      });
    }

    // Smooth scroll so the judge can see the confirmation banner
    statusContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function triggerAct2Handoff() {
    if (typeof audioManager !== "undefined") audioManager.playClick();
    localStorage.setItem("oru_average_malayali_session", JSON.stringify(sessionData));

    if (btnStart) {
      btnStart.classList.remove("btn-error");
      btnStart.classList.add("btn-launched");
      btnStart.innerHTML = `
        <span class="btn-icon">🚀</span>
        <span>Entering Act 2 Arena…</span>
        <span class="live-pulse-dot"></span>
      `;
    }
    renderStatusBanner("launching");

    // Call local server bridge to record session and transition to Act 2
    fetch("/api/start-act2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionData)
    })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then(res => {
        console.log("[Bridge] Server response:", res);
        renderStatusBanner("running");
        setTimeout(() => {
          window.location.href = res.url || "act2.html";
        }, 800);
      })
      .catch(err => {
        console.log("[Bridge] Server offline, direct browser transition:", err.message);
        renderStatusBanner("error", err.message);
        setTimeout(() => {
          window.location.href = "act2.html";
        }, 1200);
      });
  }

  // Optional health pre-check so the user knows server is ready
  fetch("/api/health")
    .then(r => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
    .then(health => {
      console.log("[Health] Bridge server online:", health);
    })
    .catch(() => {
      const tip = document.createElement("div");
      tip.className = "bridge-health-warning";
      tip.innerHTML = `
        💡 <strong>Tip:</strong> Run <code>node server.js</code> for full integrated session persistence!
      `;
      btnStart.parentNode.insertBefore(tip, btnStart.nextSibling);
    });

  // 1. "Time to start ur career" Button -> Directly triggers Person 2 OpenCV Manager
  btnStart.addEventListener("click", () => {
    triggerAct2Handoff();
  });

  // 2. "I don't want this career" Button (Forceful Society Protocol)
  const rejectModal = document.getElementById("rejectionModal");
  const rejectTimer = document.getElementById("rejectTimer");
  let countdownInterval = null;

  document.getElementById("btnRejectCareer").addEventListener("click", () => {
    if (typeof audioManager !== "undefined") audioManager.playStampThud();
    rejectModal.classList.remove("hidden");

    let secondsLeft = 3;
    if (rejectTimer) rejectTimer.textContent = secondsLeft;

    countdownInterval = setInterval(() => {
      secondsLeft--;
      if (rejectTimer) rejectTimer.textContent = secondsLeft;

      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
        rejectModal.classList.add("hidden");
        triggerAct2Handoff();
      }
    }, 1000);
  });

  document.getElementById("btnForceAccept").addEventListener("click", () => {
    if (countdownInterval) clearInterval(countdownInterval);
    rejectModal.classList.add("hidden");
    triggerAct2Handoff();
  });

  // Print & Restart
  document.getElementById("btnPrintCert").addEventListener("click", () => {
    if (typeof audioManager !== "undefined") audioManager.playClick();
    window.print();
  });

  document.getElementById("btnRestartAct1").addEventListener("click", () => {
    if (typeof audioManager !== "undefined") audioManager.playClick();
    if (window.appCoordinator) {
      window.appCoordinator.restart();
    }
  });
}
