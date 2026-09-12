/**
 * Zone Mapper Module for Act 2 (Indian Education Machine)
 * 4-Directional System:
 * ⬆️ UP    -> Academics    (Arts & Sports -20%)
 * ➡️ RIGHT -> Hackathons   (Academics -20%)
 * ⬇️ DOWN  -> Skill Dev    (Hackathons -20%)
 * ⬅️ LEFT  -> Arts & Sports (Skill Dev -20%)
 *
 * Supports both Browser (window.ZoneMapper) and Node.js (CommonJS).
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    const exportsObj = factory();
    root.ZONES = exportsObj.ZONES;
    root.ZONE_BY_ID = exportsObj.ZONE_BY_ID;
    root.ZoneMapper = exportsObj.ZoneMapper;
  }
})(typeof self !== "undefined" ? self : this, function () {
  const ZONES = [
    {
      id: "academics",
      name: "Academics",
      direction: "UP",
      arrow: "⬆️",
      angle_center: 270, // Up (Negative Y)
      color: [56, 189, 248],
      hex: "#38bdf8",
      decreases: "arts_sports",
      decreases_name: "Arts & Sports",
      penalty_text: "Arts & Sports (-20%)",
      slang: "Grinding KTU modules & exams"
    },
    {
      id: "hackathons",
      name: "Hackathons",
      direction: "RIGHT",
      arrow: "➡️",
      angle_center: 0, // Right (Positive X)
      color: [250, 204, 21],
      hex: "#facc15",
      decreases: "academics",
      decreases_name: "Academics",
      penalty_text: "Academics (-20%)",
      slang: "36-hr Red Bull code sprint"
    },
    {
      id: "skill_dev",
      name: "Skill Dev",
      direction: "DOWN",
      arrow: "⬇️",
      angle_center: 90, // Down (Positive Y)
      color: [16, 185, 129],
      hex: "#10b981",
      decreases: "hackathons",
      decreases_name: "Hackathons",
      penalty_text: "Hackathons (-20%)",
      slang: "Building portfolio & projects"
    },
    {
      id: "arts_sports",
      name: "Arts & Sports",
      direction: "LEFT",
      arrow: "⬅️",
      angle_center: 180, // Left (Negative X)
      color: [244, 114, 182],
      hex: "#f472b6",
      decreases: "skill_dev",
      decreases_name: "Skill Dev",
      penalty_text: "Skill Dev (-20%)",
      slang: "College fest, music & sports"
    }
  ];

  const ZONE_BY_ID = {};
  ZONES.forEach(z => {
    ZONE_BY_ID[z.id] = z;
  });

  class ZoneMapper {
    constructor(deadZoneRadius = 0.18) {
      this.dead_zone_radius = deadZoneRadius;
    }

    /**
     * Maps normalized coordinates (normX in [-1, 1], normY in [-1, 1] from center)
     * to one of the 4 directional zones.
     */
    mapPosition(normX, normY) {
      const distance = Math.sqrt(normX * normX + normY * normY);

      // Center dead zone: No zone active
      if (distance < this.dead_zone_radius) {
        return {
          zone: null,
          is_dead_zone: true,
          angle_deg: 0.0,
          distance: distance,
          direction: "CENTER"
        };
      }

      // Calculate angle in degrees [0, 360)
      // Note: In screen coordinates, positive Y is DOWN, negative Y is UP.
      const angleRad = Math.atan2(normY, normX);
      let angleDeg = (angleRad * 180) / Math.PI;
      if (angleDeg < 0) {
        angleDeg += 360.0;
      }

      // 4 Quadrants (45 degree boundaries):
      // 315° - 45°  (or >315 or <=45) -> RIGHT (Hackathons)
      // 45°  - 135°                   -> DOWN  (Skill Dev)
      // 135° - 225°                   -> LEFT  (Arts & Sports)
      // 225° - 315°                   -> UP    (Academics)
      let activeZone;
      if (angleDeg > 315.0 || angleDeg <= 45.0) {
        activeZone = ZONE_BY_ID["hackathons"];
      } else if (angleDeg > 45.0 && angleDeg <= 135.0) {
        activeZone = ZONE_BY_ID["skill_dev"];
      } else if (angleDeg > 135.0 && angleDeg <= 225.0) {
        activeZone = ZONE_BY_ID["arts_sports"];
      } else {
        activeZone = ZONE_BY_ID["academics"];
      }

      return {
        zone: activeZone,
        is_dead_zone: false,
        angle_deg: angleDeg,
        distance: Math.min(1.0, distance),
        direction: activeZone.direction
      };
    }

    // Alias for Python snake_case method compatibility
    map_position(normX, normY) {
      return this.mapPosition(normX, normY);
    }
  }

  return {
    ZONES,
    ZONE_BY_ID,
    ZoneMapper
  };
});
