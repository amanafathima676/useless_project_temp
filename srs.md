# Software Requirements Specification (SRS)
## Project: Oru Average Malayali
**Event:** Useless Projects 3.0 Hackathon | **Duration:** 11–12 Sept, 5 PM → 9 AM

---

## 1. Purpose

A two-act satirical interactive experience commenting on Indian (specifically Malayali) career
pressure and academic burnout culture. Act 1 is an AI career counsellor that always defaults to
Engineer / Doctor / Nursing Abroad regardless of input. Act 2 is a real-time hand-tracked game
where the player juggles 8 aspects of student life for 60 seconds, ending in a radar-chart
reveal that highlights collapsed Mental Stability.

## 2. Scope

- No login, no persistence beyond a single session.
- Single-device, single-user-at-a-time demo kiosk experience.
- Runs locally on a laptop with a webcam; no deployment/hosting required.
- Not a satire in the sense of hidden meaning — the humor must be immediately legible to a judge
  with zero explanation needed beyond the opening line.

## 3. Actors

| Actor | Description |
|---|---|
| Player (Judge) | Sits at the demo station, answers Act 1 questions, then plays Act 2 |
| Operator (either teammate) | Starts session, resets between judges, narrates pitch |

## 4. Functional Requirements

### 4.1 Act 1 — Career Agent
- FR1.1: System shall present 5–6 career-counselling-style questions (interests, hobbies,
  skills, work environment, work hours, one open free-text field).
- FR1.2: System shall accept free-text and multiple-choice input.
- FR1.3: System shall send collected answers to an LLM with a fixed persona prompt that always
  concludes with Engineer, Doctor, or "Study Nursing Abroad" — using the user's own answers to
  justify the conclusion in exaggerated Malayali-relative logic.
- FR1.4: System shall display a "Career Certificate" screen with the verdict and the AI's
  tenuous justification.
- FR1.5: Response time for the AI verdict shall be under 5 seconds (judge-facing demo constraint).

### 4.2 Act 2 — Indian Education Machine
- FR2.1: System shall track the player's hand position in real time via webcam.
- FR2.2: System shall map hand position to one of 8 directional zones: Assignments, Hackathon,
  Placement Prep, Club Activities, Sleep, Friends, Record, Mental Health (implicit/no-input zone).
- FR2.3: System shall run a 60-second countdown timer.
- FR2.4: While hand is in a zone, that stat shall increase; per defined tradeoff rules, one or
  more other stats shall decrease simultaneously.
- FR2.5: Mental Stability shall passively decay throughout the round regardless of player
  action, decaying faster if Sleep/Friends are neglected.
- FR2.6: System shall render a live-updating radar/spider chart of all 8 stats during play.
- FR2.7: On timer expiry, system shall freeze the chart and display a final "STUDENT STATUS"
  card with all stat values and a fixed punchline ("Congratulations. You are now employable.").
- FR2.8: System shall be resettable to a fresh round within 5 seconds (for back-to-back judges).

### 4.3 Integration
- FR3.1: A title/transition screen shall link Act 1 completion to Act 2 start.
- FR3.2: (Optional/stretch) The Act 1 verdict shall visually carry over as flavor text in Act 2
  (e.g., "Simulating: Engineer Edition").

## 5. Non-Functional Requirements

- NFR1 (Robustness): Hand tracking must tolerate typical indoor lighting at the venue; no
  calibration step longer than 3 seconds.
- NFR2 (Demo speed): Full two-act cycle must complete in under 3 minutes per judge.
- NFR3 (Offline resilience): If internet/LLM API is unavailable, Act 1 must fall back to a
  local canned-response bank so the demo never fully breaks.
- NFR4 (No install friction for judges): Judges only interact via webcam/gestures and a
  keyboard/touchscreen for typed input — no software installation on their side.
- NFR5 (Recoverability): A visible "Restart Round" control must exist for both acts.

## 6. Out of Scope

- User accounts, data storage across sessions, multi-user leaderboard.
- Mobile app version.
- Production-grade voice cloning or advanced ML gesture classifiers (rule-based zone detection
  is sufficient).

## 7. Assumptions & Constraints

- One laptop with a working webcam, one external monitor/screen ideal but not required.
- LLM access via API key (assume available; must have offline fallback per NFR3).
- Total build/test window: ~14–15 working hours across both people, overnight.

## 8. Success Criteria (Judge-Facing)

- A judge can go from sitting down to seeing their final "employable" card in under 3 minutes
  without either teammate needing to explain controls verbally.
- The Mental Stability collapse is visually obvious without narration.
