/**
 * Stat Engine Module for Act 2 (Indian Education Machine)
 * Manages the 4 primary focus areas with exact tradeoff cycles:
 * ⬆️ UP    -> Academics (+), Arts & Sports (-20%)
 * ➡️ RIGHT -> Hackathons (+), Academics (-20%)
 * ⬇️ DOWN  -> Skill Dev (+), Hackathons (-20%)
 * ⬅️ LEFT  -> Arts & Sports (+), Skill Dev (-20%)
 *
 * Tracks the 4 end-game result card metrics:
 * • Sleep Level:        1.5 hrs    [ CRITICAL ]
 * • Happiness:          8%         [ LOW BATTERY ]
 * • Passion:            89%        [ OVERHEATING ]
 * • Mental Stability:   2%         [ SYSTEM FAILURE ]
 *
 * Supports both Browser (window.StatEngine) and Node.js (CommonJS).
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.StatEngine = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const PRIMARY_KEYS = ["academics", "hackathons", "skill_dev", "arts_sports"];

  const PRIMARY_META = {
    academics: {
      name: "Academics",
      arrow: "⬆️",
      color: [56, 189, 248],
      hex: "#38bdf8",
      decreases: "Arts & Sports (-20%)"
    },
    hackathons: {
      name: "Hackathons",
      arrow: "➡️",
      color: [250, 204, 21],
      hex: "#facc15",
      decreases: "Academics (-20%)"
    },
    skill_dev: {
      name: "Skill Dev",
      arrow: "⬇️",
      color: [16, 185, 129],
      hex: "#10b981",
      decreases: "Hackathons (-20%)"
    },
    arts_sports: {
      name: "Arts & Sports",
      arrow: "⬅️",
      color: [244, 114, 182],
      hex: "#f472b6",
      decreases: "Skill Dev (-20%)"
    }
  };

  class StatEngine {
    constructor() {
      this.PRIMARY_KEYS = PRIMARY_KEYS;
      this.PRIMARY_META = PRIMARY_META;
      this.stats = {};
      this.reset();
    }

    /**
     * Initializes stats to balanced starting points.
     */
    reset() {
      this.stats = {
        academics: 50.0,
        hackathons: 50.0,
        skill_dev: 50.0,
        arts_sports: 50.0
      };
      // The 4 Vital End-Card Metrics (evolve over 30s)
      this.sleep_hours = 7.5;
      this.happiness = 65.0;
      this.passion = 45.0;
      this.mental_stability = 92.0;
      this.elapsed_time = 0.0;
    }

    getStat(key) {
      return this.stats[key] || 0.0;
    }

    get_stat(key) {
      return this.getStat(key);
    }

    getAllStats() {
      const result = {};
      for (const k of PRIMARY_KEYS) {
        result[k] = Math.round(this.stats[k] * 10) / 10;
      }
      return result;
    }

    get_all_stats() {
      return this.getAllStats();
    }

    /**
     * Returns the 4 real-time vital signs.
     */
    getVitals() {
      return {
        sleep_hours: Math.round(this.sleep_hours * 10) / 10,
        happiness: Math.round(this.happiness),
        passion: Math.round(this.passion),
        mental_stability: Math.round(this.mental_stability)
      };
    }

    get_vitals() {
      return this.getVitals();
    }

    /**
     * Updates the 4 primary focus areas and the 4 vitals per frame.
     * - Primary increase rate: +18%/sec
     * - Targeted secondary decrease rate: -20%/sec
     */
    tick(activeZoneId, dt) {
      this.elapsed_time += dt;
      const deltas = {
        academics: 0.0,
        hackathons: 0.0,
        skill_dev: 0.0,
        arts_sports: 0.0
      };

      const INC_RATE = 18.0;
      const DEC_RATE = 20.0;

      if (activeZoneId === "academics") {
        // UP: Academics (+), Arts & Sports (-20%)
        deltas.academics += INC_RATE * dt;
        deltas.arts_sports -= DEC_RATE * dt;
      } else if (activeZoneId === "hackathons") {
        // RIGHT: Hackathons (+), Academics (-20%)
        deltas.hackathons += INC_RATE * dt;
        deltas.academics -= DEC_RATE * dt;
      } else if (activeZoneId === "skill_dev") {
        // DOWN: Skill Dev (+), Hackathons (-20%)
        deltas.skill_dev += INC_RATE * dt;
        deltas.hackathons -= DEC_RATE * dt;
      } else if (activeZoneId === "arts_sports") {
        // LEFT: Arts & Sports (+), Skill Dev (-20%)
        deltas.arts_sports += INC_RATE * dt;
        deltas.skill_dev -= DEC_RATE * dt;
      }

      // Apply deltas and clamp to [0, 100]
      for (const k of PRIMARY_KEYS) {
        this.stats[k] = Math.max(0.0, Math.min(100.0, this.stats[k] + deltas[k]));
      }

      // Vitals Evolution towards the target end state over 30 seconds:
      // Sleep: 7.5 hrs -> 1.5 hrs
      // Happiness: 65% -> 8%
      // Passion: 45% -> 89% (overheating with hackathons & skills)
      // Mental Stability: 92% -> 2% (system failure)
      const progress = Math.min(1.0, this.elapsed_time / 30.0);

      // Non-linear curves for maximum dramatic effect
      this.sleep_hours = Math.max(1.5, 7.5 - 6.0 * Math.pow(progress, 0.9));
      this.happiness = Math.max(8.0, 65.0 - 57.0 * Math.pow(progress, 0.85));
      this.passion = Math.min(89.0, 45.0 + 44.0 * Math.pow(progress, 0.8));
      this.mental_stability = Math.max(2.0, 92.0 - 90.0 * Math.pow(progress, 0.95));

      return deltas;
    }

    /**
     * Generates the exact 4-metric status scorecard.
     */
    calculateResults() {
      return {
        sleep_str: `${(Math.round(this.sleep_hours * 10) / 10).toFixed(1)} hrs`,
        sleep_status: "[ CRITICAL ]",
        sleep_color: [239, 68, 68],
        sleep_hex: "#ef4444",

        happiness_str: `${Math.round(this.happiness)}%`,
        happiness_status: "[ LOW BATTERY ]",
        happiness_color: [250, 204, 21],
        happiness_hex: "#facc15",

        passion_str: `${Math.round(this.passion)}%`,
        passion_status: "[ OVERHEATING ]",
        passion_color: [249, 115, 22],
        passion_hex: "#f97316",

        mental_stability_str: `${Math.round(this.mental_stability)}%`,
        mental_stability_status: "[ SYSTEM FAILURE ]",
        mental_stability_color: [239, 68, 68],
        mental_stability_hex: "#ef4444",

        punchline: "Congratulations. You are now employable.",
        sub_punchline: "Ammavan Council has officially certified your complete burnout."
      };
    }

    calculate_results() {
      return this.calculateResults();
    }
  }

  return StatEngine;
});
