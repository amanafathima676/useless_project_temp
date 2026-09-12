/**
 * Result Card Module for Act 2 (Indian Education Machine)
 * Renders the exact 4-metric end-game card:
 * • Sleep Level:        1.5 hrs    [ CRITICAL ]
 * • Happiness:          8%         [ LOW BATTERY ]
 * • Passion:            89%        [ OVERHEATING ]
 * • Mental Stability:   2%         [ SYSTEM FAILURE ]
 *
 * Supports both Browser and Node.js.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ResultCard = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  class ResultCard {
    constructor(screenW = 1280, screenH = 720) {
      this.screen_w = screenW;
      this.screen_h = screenH;
      this.card_w = 780;
      this.card_h = 520;
      this.anim_alpha = 0.0;
    }

    update(dt) {
      if (this.anim_alpha < 1.0) {
        this.anim_alpha = Math.min(1.0, this.anim_alpha + dt * 2.8);
      }
    }

    /**
     * Generates HTML markup for the result card overlay.
     */
    renderHTML(results) {
      const res = results || {
        sleep_str: "1.5 hrs",
        sleep_status: "[ CRITICAL ]",
        sleep_hex: "#ef4444",
        happiness_str: "8%",
        happiness_status: "[ LOW BATTERY ]",
        happiness_hex: "#facc15",
        passion_str: "89%",
        passion_status: "[ OVERHEATING ]",
        passion_hex: "#f97316",
        mental_stability_str: "2%",
        mental_stability_status: "[ SYSTEM FAILURE ]",
        mental_stability_hex: "#ef4444",
        punchline: "Congratulations. You are now employable.",
        sub_punchline: "Ammavan Council has officially certified your complete burnout."
      };

      return `
        <div class="result-card-modal animate-fadeIn">
          <div class="result-card-content">
            <div class="result-card-header">
              <span class="result-dept-tag">DEPARTMENT OF COLLEGIATE SURVIVAL &amp; PLACEMENT ARBITRATION</span>
              <h2 class="result-card-title">STUDENT FINAL STATUS REPORT</h2>
              <div class="result-rubber-stamp">
                <span class="stamp-main">EMPLOYABLE</span>
                <span class="stamp-sub">KTU CERTIFIED</span>
              </div>
            </div>

            <div class="result-metrics-grid">
              <div class="result-metric-row">
                <span class="metric-dot" style="background:#00f5d4"></span>
                <span class="metric-label">Sleep Level:</span>
                <span class="metric-val">${res.sleep_str}</span>
                <span class="metric-badge" style="color: ${res.sleep_hex || '#ef4444'}">${res.sleep_status}</span>
              </div>
              <div class="result-metric-row">
                <span class="metric-dot" style="background:#00f5d4"></span>
                <span class="metric-label">Happiness:</span>
                <span class="metric-val">${res.happiness_str}</span>
                <span class="metric-badge" style="color: ${res.happiness_hex || '#facc15'}">${res.happiness_status}</span>
              </div>
              <div class="result-metric-row">
                <span class="metric-dot" style="background:#00f5d4"></span>
                <span class="metric-label">Passion:</span>
                <span class="metric-val">${res.passion_str}</span>
                <span class="metric-badge" style="color: ${res.passion_hex || '#f97316'}">${res.passion_status}</span>
              </div>
              <div class="result-metric-row">
                <span class="metric-dot" style="background:#00f5d4"></span>
                <span class="metric-label">Mental Stability:</span>
                <span class="metric-val">${res.mental_stability_str}</span>
                <span class="metric-badge" style="color: ${res.mental_stability_hex || '#ef4444'}">${res.mental_stability_status}</span>
              </div>
            </div>

            <div class="result-punchline-box">
              <h3 class="punchline-text">${res.punchline}</h3>
              <p class="punchline-sub">${res.sub_punchline}</p>
            </div>

            <div class="result-footer-actions">
              <button id="btnRestartAct2" class="btn btn-primary">
                <span>🔄 Restart Simulation (Press R)</span>
              </button>
              <a href="index.html" class="btn btn-secondary">
                <span>← Back to Act 1</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }
  }

  return ResultCard;
});
