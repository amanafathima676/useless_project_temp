"""
Stat Engine Module for Act 2 (Indian Education Machine)
Simulates 8 aspects of engineering student life with realistic tradeoffs
and accelerating passive Mental Health decay.
"""

class StatEngine:
    STAT_KEYS = [
        "assignments",
        "hackathon",
        "placement",
        "club",
        "sleep",
        "friends",
        "record",
        "mental_health"
    ]

    STAT_META = {
        "assignments": {"name": "Assignments", "unit": "% Done", "color": (56, 189, 248)},
        "hackathon": {"name": "Hackathons", "unit": "PRs Merged", "color": (250, 204, 21)},
        "placement": {"name": "Placement Prep", "unit": "LeetCode Solved", "color": (16, 185, 129)},
        "club": {"name": "Club Activities", "unit": "Events Hyped", "color": (236, 72, 153)},
        "sleep": {"name": "Sleep Reserve", "unit": "Hours/Wk", "color": (129, 140, 248)},
        "friends": {"name": "Social Life", "unit": "Chai Sessions", "color": (251, 146, 60)},
        "record": {"name": "Lab Record", "unit": "Pages Inked", "color": (6, 182, 212)},
        "mental_health": {"name": "Mental Stability", "unit": "Sanity %", "color": (248, 113, 113)}
    }

    def __init__(self):
        self.stats = {}
        self.reset()

    def reset(self):
        """Initializes stats to standard Semester 4 baseline levels."""
        self.stats = {
            "assignments": 45.0,
            "hackathon": 25.0,
            "placement": 30.0,
            "club": 40.0,
            "sleep": 75.0,
            "friends": 70.0,
            "record": 35.0,
            "mental_health": 90.0
        }
        self.history = []  # Snapshots for end-game graph/analytics

    def get_stat(self, key):
        return self.stats.get(key, 0.0)

    def get_all_stats(self):
        return {k: round(v, 1) for k, v in self.stats.items()}

    def tick(self, active_zone_id, dt):
        """
        Updates stat values based on active zone and time delta (dt in seconds).
        Applies primary boost, trade-offs, and passive mental decay.
        """
        # Rate multipliers per second
        BOOST_RATE = 18.0
        TRADE_OFF_RATE = 12.0

        deltas = {k: 0.0 for k in self.STAT_KEYS}

        # 1. Apply Active Zone Tradeoff Rules
        if active_zone_id == "assignments":
            deltas["assignments"] += BOOST_RATE * dt
            deltas["sleep"] -= TRADE_OFF_RATE * dt

        elif active_zone_id == "hackathon":
            deltas["hackathon"] += (BOOST_RATE * 1.2) * dt
            deltas["friends"] -= TRADE_OFF_RATE * dt
            deltas["sleep"] -= (TRADE_OFF_RATE * 1.5) * dt

        elif active_zone_id == "placement":
            deltas["placement"] += BOOST_RATE * dt
            deltas["club"] -= TRADE_OFF_RATE * dt

        elif active_zone_id == "club":
            deltas["club"] += BOOST_RATE * dt
            deltas["assignments"] -= TRADE_OFF_RATE * dt

        elif active_zone_id == "sleep":
            deltas["sleep"] += (BOOST_RATE * 1.3) * dt
            deltas["placement"] -= (TRADE_OFF_RATE * 0.8) * dt
            deltas["assignments"] -= (TRADE_OFF_RATE * 0.5) * dt

        elif active_zone_id == "friends":
            deltas["friends"] += BOOST_RATE * dt
            deltas["record"] -= TRADE_OFF_RATE * dt

        elif active_zone_id == "record":
            deltas["record"] += BOOST_RATE * dt
            deltas["sleep"] -= (TRADE_OFF_RATE * 0.7) * dt
            deltas["friends"] -= (TRADE_OFF_RATE * 0.7) * dt

        elif active_zone_id == "mental_health":
            # Active coping zone: slow recovery at cost of everything academic
            deltas["mental_health"] += (BOOST_RATE * 0.8) * dt
            deltas["placement"] -= (TRADE_OFF_RATE * 0.5) * dt
            deltas["assignments"] -= (TRADE_OFF_RATE * 0.5) * dt

        # 2. Passive Mental Health Decay
        # Base decay: 1.4% per second (ensures natural collapse in 60s)
        base_decay = 1.35 * dt
        
        # Acceleration factors:
        # Sleep deprivation penalty
        sleep_penalty = max(0.0, (45.0 - self.stats["sleep"]) / 45.0) * 1.5
        # Social isolation penalty
        friends_penalty = max(0.0, (40.0 - self.stats["friends"]) / 40.0) * 1.0
        # Extreme pressure penalty (High assignments + placement)
        pressure_penalty = ((self.stats["assignments"] + self.stats["placement"]) / 200.0) * 0.8

        total_decay = base_decay * (1.0 + sleep_penalty + friends_penalty + pressure_penalty)
        
        # Apply decay to mental health
        deltas["mental_health"] -= total_decay

        # 3. Commit deltas and clamp to [0.0, 100.0]
        for key in self.STAT_KEYS:
            self.stats[key] = max(0.0, min(100.0, self.stats[key] + deltas[key]))

        return deltas

    def calculate_results(self):
        """Generates satirical scorecard metrics and punchlines."""
        s = self.stats
        
        # Satirical CGPA formula
        academic_score = (s["assignments"] * 0.35 + s["placement"] * 0.40 + s["record"] * 0.25)
        cgpa = round(5.5 + (academic_score / 100.0) * 4.3, 2)
        cgpa = min(9.88, cgpa)
        
        # Employability Rating
        employability = int(min(99, max(45, (s["placement"] * 0.5 + s["hackathon"] * 0.3 + (100 - s["mental_health"]) * 0.2))))
        
        # Burnout Index
        burnout = int(100.0 - s["mental_health"])
        
        # Placement Package / Verdict
        if s["placement"] > 70 and s["hackathon"] > 50:
            placement_role = "TCS Ninja / Infosys Specialist (3.6 LPA)"
        elif s["placement"] > 50:
            placement_role = "Wipro Elite Associate (3.36 LPA)"
        else:
            placement_role = "Bangalore Startup Intern (Unpaid + Exposure)"

        return {
            "cgpa": cgpa,
            "employability": employability,
            "burnout": burnout,
            "mental_health": round(s["mental_health"], 1),
            "placement_role": placement_role,
            "relative_approval": "99.8% (Ammavan Approved)",
            "punchline": "Congratulations. You are now employable."
        }
