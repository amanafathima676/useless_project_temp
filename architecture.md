# Architecture Document
## Project: Oru Average Malayali

---

## 1. High-Level Overview

Two independent modules sharing a single front-end shell and a thin session-state handoff.
Built this way **specifically so both teammates can work in parallel without blocking each
other overnight** — Act 1 and Act 2 have no runtime dependency on each other until the final
integration step.

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONT-END SHELL                        │
│   Title Screen → Act 1 View → Transition → Act 2 View → End   │
└───────────────┬─────────────────────────────┬─────────────────┘
                │                             │
        ┌───────▼────────┐           ┌────────▼─────────┐
        │   ACT 1 MODULE   │           │   ACT 2 MODULE     │
        │  Career Agent    │           │  Education Machine │
        │  (Person A)      │           │  (Person B)        │
        └───────┬────────┘           └────────┬─────────┘
                │                             │
        ┌───────▼────────┐           ┌────────▼─────────┐
        │   LLM API /      │           │  Webcam → OpenCV/  │
        │   Fallback bank  │           │  MediaPipe Hands   │
        └────────────────┘           └────────────────────┘
```

## 2. Module Breakdown

### 2.1 Act 1 — Career Agent Module (Owner: Person A)

**Responsibility:** Collect user input, send to LLM with locked persona prompt, render verdict.

**Components:**
- `Questionnaire UI` — 5–6 question form/chat interface (web-based: HTML/JS or React).
- `Persona Prompt Engine` — system prompt template enforcing the "always Engineer/Doctor/Nursing
  Abroad" logic, injected with user answers.
- `LLM Client` — API call wrapper (Anthropic API or equivalent) with timeout + retry.
- `Fallback Response Bank` — local JSON of 15–20 pre-written canned verdicts keyed loosely to
  common answer patterns, used if API fails or is slow (NFR3).
- `Certificate Renderer` — displays final verdict as a styled "Career Certificate" card.

**Data flow:**
```
User answers (JSON) → Prompt Engine → LLM API
                                        │
                                        ▼ (on failure/timeout)
                                  Fallback Bank
                                        │
                                        ▼
                              Certificate Renderer → screen
```

### 2.2 Act 2 — Indian Education Machine Module (Owner: Person B)

**Responsibility:** Real-time hand tracking, zone mapping, stat/tradeoff engine, live radar
chart, end-state card.

**Components:**
- `Hand Tracker` — MediaPipe Hands (preferred) or OpenCV HSV contour tracking (fallback if
  MediaPipe setup is problematic) → outputs live (x, y) centroid per frame.
- `Zone Mapper` — converts (x, y) offset from screen center into one of 8 angular zones via
  `atan2`; includes a dead-zone radius near center to avoid jitter noise.
- `Stat Engine` — holds the 8-stat dictionary (Assignments, Hackathon, Placement Prep, Club
  Activities, Sleep, Friends, Record, Mental Health), applies increment/decrement + tradeoff
  rules each frame, applies passive Mental Health decay.
- `Timer` — 60-second countdown, drives round start/end.
- `Radar Chart Renderer` — live-updating 8-axis spider chart (Chart.js/canvas), redrawn per
  frame or on throttled interval (e.g., every 100ms to avoid render lag).
- `Result Card Generator` — freezes final stats, renders "STUDENT STATUS" card with punchline.

**Data flow:**
```
Webcam frame → Hand Tracker → (x,y) centroid → Zone Mapper → active zone
                                                                  │
                                                                  ▼
                                                    Stat Engine (per-frame tick)
                                                                  │
                                        ┌─────────────────────────┴───────────────┐
                                        ▼                                         ▼
                              Radar Chart Renderer                    Timer expiry check
                                                                                  │
                                                                                  ▼
                                                                    Result Card Generator
```

### 2.3 Shared Shell (Owner: Both — built collaboratively at integration checkpoints)

- Title screen ("Oru Average Malayali")
- Transition screen (Act 1 verdict → "Let's see how that actually goes for you" → Act 2 start)
- Global Restart control
- Shared visual theme (colors, fonts, sound cues) — agree on this early (Hour 0–1) so both
  modules look cohesive without needing rework later

## 3. Technology Stack

| Layer | Choice | Owner |
|---|---|---|
| Act 1 UI | HTML/CSS/JS or React | Person A |
| Act 1 backend logic | JS/Python + LLM API client | Person A |
| Act 2 CV | Python + OpenCV + MediaPipe | Person B |
| Act 2 UI/chart | Python (pygame) OR JS canvas + Chart.js fed via WebSocket from Python | Person B |
| Shared shell | Whichever front-end framework both agree on Hour 0 | Both |
| Integration glue | Simple shared state (URL params, localStorage-equivalent in-memory JS
  object, or a small local JSON/session file) | Both, at checkpoints |

**Note:** If Act 2 is Python-based (likely, given OpenCV/MediaPipe) and Act 1 is JS-based, the
simplest integration is **two separate screens/windows launched in sequence by the Operator**,
rather than a single unified web app. This avoids a fragile cross-language runtime integration
during the final hours. Recommended default unless both people are comfortable with a
Python-JS bridge (e.g., Flask serving both, or a WebSocket bridge).

## 4. Integration Checkpoints (Critical — Prevents Last-Hour Chaos)

| Checkpoint | Time | What gets synced |
|---|---|---|
| Kickoff | Hour 0 | Agree on: tech stack, visual theme (fonts/colors), file/folder structure, who owns the shell |
| Mid-check 1 | Hour 5–6 | Each person demos their module standalone to the other |
| Mid-check 2 | Hour 10 | First attempt at wiring Act 1 → Act 2 transition |
| Final integration | Hour 12–13 | Full end-to-end run-through, timing rehearsal |
| Buffer | Hour 13–15 | Bug fixes, lighting/demo tuning, pitch rehearsal |

## 5. Risk Notes

- **Highest risk:** Hand-tracking reliability under venue lighting. Person B should test in the
  actual venue lighting as early as possible, not just at home.
- **Second risk:** LLM API latency/availability at a crowded event with shared wifi — Person A's
  fallback bank (NFR3) is not optional, treat it as a P0 deliverable, not a stretch goal.
- **Integration risk:** Cross-language handoff (Python ↔ JS) — decide the simplest possible
  approach at Hour 0 and do not revisit the decision mid-build.
