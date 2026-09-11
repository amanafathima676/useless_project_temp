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
    malayali_subheading
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

  // Playful Celebratory Confetti Burst across Certificate
  function triggerConfettiBurst(targetWrapper) {
    if (!targetWrapper) return;
    const colors = ["#126a5d", "#b8860b", "#ba1a1a", "#b2efdf", "#f59e0b", "#00362d"];
    for (let i = 0; i < 35; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-particle";
      piece.style.left = (Math.random() * 92 + 4) + "%";
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = (Math.random() * 1.2) + "s";
      piece.style.animationDuration = (2.2 + Math.random() * 2) + "s";
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      targetWrapper.appendChild(piece);
      setTimeout(() => piece.remove(), 4500);
    }
  }

  const certWrapper = container.querySelector(".certificate-wrapper");
  if (certWrapper) {
    triggerConfettiBurst(certWrapper);
  }

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
              <span>PERSON 2 OPENCV MANAGER LAUNCHING…</span>
            </div>
            <span class="banner-sub">Desktop OpenCV + Pygame Window</span>
          </div>
          <h3 class="banner-title">🚀 Starting the Indian Education Machine…</h3>
          <p class="banner-note">
            Opening the webcam hand-tracking window on your desktop.<br>
            Wait a few seconds, then check your taskbar for:<br>
            <code>Act 2: Indian Education Machine - Oru Average Malayali</code>
          </p>
        </div>
      `;
    } else if (state === "error") {
      statusContainer.innerHTML = `
        <div class="act2-banner-card banner-state-error animate-fadeIn">
          <div class="banner-top-row">
            <div class="banner-badge-error">
              <span class="error-dot"></span>
              <span>OPENCV MANAGER FAILED TO LAUNCH</span>
            </div>
            <span class="banner-sub">Desktop OpenCV + Pygame Window</span>
          </div>
          <h3 class="banner-title">⚠️ The Python window did not open.</h3>
          <p class="banner-note">
            <strong>Cause:</strong> ${errorMsg || "No response from the local bridge server."}<br>
            Most likely the page was opened without the bridge server. Fix:
          </p>
          <ol class="banner-fix-steps">
            <li>Start the server first — in this folder run <code>python server.py</code> (port 8080).</li>
            <li>Open the site via <code>http://localhost:8080</code> (NOT by double-clicking the .html file).</li>
            <li>Click one of the buttons again below.</li>
          </ol>
        </div>
        <div class="banner-footer-row">
          <button class="btn btn-sm btn-primary" id="btnRelaunchAct2">
            <span>🔄 Retry Opening OpenCV Window</span>
          </button>
          <span class="banner-terminal-hint">Direct CLI: <code>python useless_project_temp/act2_app.py</code></span>
        </div>
      `;
    } else if (state === "running-cli") {
      // Bridge reached but the process died early: same window, show the real log reason.
      statusContainer.innerHTML = `
        <div class="act2-banner-card banner-state-error animate-fadeIn">
          <div class="banner-top-row">
            <div class="banner-badge-error">
              <span class="error-dot"></span>
              <span>OPENCV MANAGER CRASHED AFTER LAUNCH</span>
            </div>
            <span class="banner-sub">Desktop OpenCV + Pygame Window</span>
          </div>
          <h3 class="banner-title">The Python app started but quit immediately.</h3>
          <p class="banner-note">${errorMsg}</p>
          <div class="banner-footer-row">
            <button class="btn btn-sm btn-primary" id="btnRelaunchAct2">
              <span>🔄 Retry Opening OpenCV Window</span>
            </button>
            <span class="banner-terminal-hint">Direct CLI: <code>cd useless_project_temp &amp;&amp; python act2_app.py</code></span>
          </div>
        </div>
      `;
    } else {
      statusContainer.innerHTML = `
        <div class="act2-banner-card animate-fadeIn">
          <div class="banner-top-row">
            <div class="banner-badge-live">
              <span class="live-dot"></span>
              <span>PERSON 2 OPENCV MANAGER RUNNING</span>
            </div>
            <span class="banner-sub">Desktop OpenCV + Pygame Window</span>
          </div>
          <h3 class="banner-title">🎮 Indian Education Machine is Live on Your Screen!</h3>
          <p class="banner-note">
            The webcam hand-tracking window has launched in the foreground on your desktop.<br>
            <strong>Check your taskbar or switch to the camera window titled:</strong><br>
            <code>Act 2: Indian Education Machine - Oru Average Malayali</code>
          </p>
          <div class="banner-rules-row">
            <div class="rule-chip up">⬆️ UP: Academics <small>(Arts -20%)</small></div>
            <div class="rule-chip right">➡️ RIGHT: Hackathons <small>(Acads -20%)</small></div>
            <div class="rule-chip down">⬇️ DOWN: Skill Dev <small>(Hacks -20%)</small></div>
            <div class="rule-chip left">⬅️ LEFT: Arts & Sports <small>(Skills -20%)</small></div>
          </div>
        </div>
        <div class="banner-footer-row">
          <button class="btn btn-sm btn-secondary" id="btnRelaunchAct2">
            <span>🔄 Re-launch OpenCV Window</span>
          </button>
          <span class="banner-terminal-hint">Direct CLI: <code>python useless_project_temp/act2_app.py</code></span>
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

    // Immediate "launching" feedback — but never claim success yet.
    if (btnStart) {
      btnStart.classList.remove("btn-error");
      btnStart.classList.add("btn-launched");
      btnStart.innerHTML = `
        <span class="btn-icon">🚀</span>
        <span>OpenCV Manager Launching…</span>
        <span class="live-pulse-dot"></span>
      `;
    }
    renderStatusBanner("launching");

    // Call local server bridge to launch Person 2 OpenCV desktop application directly
    fetch("/api/start-act2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionData)
    })
      .then(r => {
        if (!r.ok) {
          throw new Error("Bridge server returned HTTP " + r.status + ". Start it with: python server.py");
        }
        return r.json();
      })
      .then(res => {
        console.log("[Bridge] Server OpenCV launch response:", res);
        if (res.launched === true) {
          if (btnStart) {
            btnStart.innerHTML = `
              <span class="btn-icon">🚀</span>
              <span>OpenCV Manager Active on Screen</span>
              <span class="live-pulse-dot"></span>
            `;
          }
          renderStatusBanner("running");
        } else {
          if (btnStart) {
            btnStart.classList.remove("btn-launched");
            btnStart.classList.add("btn-error");
            btnStart.innerHTML = `<span class="btn-icon">⚠️</span><span>Launch Failed — Retry</span>`;
          }
          renderStatusBanner("running-cli", res.error || "Process exited immediately. See act2_launch.log in useless_project_temp.");
        }
      })
      .catch(err => {
        console.log("[Bridge] Launch failed:", err.message);
        if (btnStart) {
          btnStart.classList.remove("btn-launched");
          btnStart.classList.add("btn-error");
          btnStart.innerHTML = `<span class="btn-icon">⚠️</span><span>Bridge Not Reached — Click To Fix</span>`;
        }
        renderStatusBanner("error", err.message);
      });
  }

  // Optional health pre-check so the judge immediately sees if the bridge is reachable
  fetch("/api/health")
    .then(r => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
    .then(health => {
      if (health.status === "ok" && !health.act2_script_exists) {
        const tip = document.createElement("div");
        tip.className = "bridge-health-warning";
        tip.innerHTML = "⚠️ Bridge is up, but <code>act2_app.py</code> was not found where expected.";
        btnStart.parentNode.insertBefore(tip, btnStart.nextSibling);
      }
    })
    .catch(() => {
      const tip = document.createElement("div");
      tip.className = "bridge-health-warning";
      tip.innerHTML = `
        ⚠️ <strong>Local bridge server not detected.</strong> Open this site through
        <code>http://localhost:8080</code> (run <code>python server.py</code> first) — otherwise the
        OpenCV window cannot launch from the button.
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
