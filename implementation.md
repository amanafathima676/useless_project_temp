# Implementation Plan
## Project: Oru Average Malayali
**Window:** 11 Sept 5 PM → 12 Sept 9 AM (16 hours)

---

## 0. Team Split Summary

| Person | Owns | Core Tech |
|---|---|---|
| **Person A** | Act 1 — Career Agent (LLM persona, questionnaire, certificate screen, fallback bank) | LLM API, prompt engineering, front-end form UI |
| **Person B** | Act 2 — Indian Education Machine (hand tracking, zone mapping, stat engine, radar chart, result card) | Python, OpenCV/MediaPipe, canvas/chart rendering |

Both jointly own: title screen, transition screen, visual theme, final integration, pitch
rehearsal.

---

## 1. Person A — Hour-by-Hour Plan (Career Agent)

| Hours | Task |
|---|---|
| 0–1 | Kickoff sync with Person B: agree tech stack, theme, folder structure |
| 1–2 | Build questionnaire UI — 5–6 questions (interests, hobbies, skills, work environment, work hours, one free-text field) |
| 2–3 | Write and iterate the locked persona system prompt: "No matter the input, conclude Engineer / Doctor / Nursing Abroad, justify using the user's actual answers in exaggerated Malayali-relative logic" |
| 3–4 | Wire LLM API client (request/response handling, 5-second timeout) |
| 4–5 | Build the Fallback Response Bank — 15–20 canned verdict templates covering common answer patterns, for when API is slow/down (this is a P0, not optional) |
| 5–6 | **Checkpoint with Person B** — demo Act 1 standalone |
| 6–8 | Build the Career Certificate result screen (styled card, verdict + justification text) |
| 8–9 | Test edge cases: empty answers, very long free-text, offensive/joke inputs — make sure fallback always produces something funny, never breaks |
| 9–10 | Polish visuals to match shared theme; add a subtle sound cue on verdict reveal |
| 10–11 | **Checkpoint 2** — help wire Act 1 → Act 2 transition screen |
| 11–13 | Assist Person B if Act 2 is behind schedule (buffer capacity) |
| 13–14 | Full run-through with Person B, timing check (<3 min total experience) |
| 14–16 | Bug fixes, pitch rehearsal, prep opening line and 200-word pitch delivery |

**Deliverables:**
- Questionnaire UI (functional)
- Persona prompt (final, tested against 10+ varied inputs)
- LLM client with timeout handling
- Fallback response bank (JSON, 15–20 entries)
- Career Certificate screen

---

## 2. Person B — Hour-by-Hour Plan (Indian Education Machine)

| Hours | Task |
|---|---|
| 0–1 | Kickoff sync with Person A: agree tech stack, theme, folder structure |
| 1–2 | Set up MediaPipe Hands (or OpenCV fallback), confirm webcam access, print raw (x,y) landmark data to console |
| 2–3 | Build Zone Mapper — `atan2`-based 8-directional zone detection with a center dead-zone |
| 3–4 | Build the Stat Engine — 8-stat dictionary + increment logic per active zone |
| 4–5 | Implement tradeoff rules (Assignments↑→Sleep↓, Hackathon↑→Friends↓+Sleep↓↓, Placement↑→Club↓, Club↑→Assignments↓, Sleep↑→Placement↓, Friends↑→Record↓) + passive Mental Health decay |
| 5–6 | **Checkpoint with Person A** — demo Act 2 core loop standalone (even without UI polish) |
| 6–8 | Build live radar/spider chart rendering (Chart.js via lightweight local server, or pygame/matplotlib live redraw) |
| 8–9 | Add 60-second timer with visible countdown + on-screen zone labels so players know where to move their hand |
| 9–10 | Build the "STUDENT STATUS" end-card generator with final stat values + fixed punchline text |
| 10–11 | **Checkpoint 2** — wire Act 1 → Act 2 transition with Person A |
| 11–12 | Test hand tracking in actual venue lighting; tune sensitivity/dead-zone radius |
| 12–13 | Add Restart control for back-to-back judges; add tension sound/music that intensifies as Mental Health drops |
| 13–14 | Full run-through with Person A, timing check |
| 14–16 | Bug fixes, lighting re-test if venue conditions changed, pitch rehearsal |

**Deliverables:**
- Hand tracking module (tested in venue lighting)
- Zone Mapper (8 directions + dead zone)
- Stat Engine with tradeoff rules + Mental Health decay
- Live radar chart
- 60-second timer + Result Card generator
- Restart control

---

## 3. Joint Tasks

| Hours | Task | Who |
|---|---|---|
| 0–1 | Agree visual theme (colors/fonts), folder structure, integration approach (likely: sequential screens/windows rather than single unified app — see Architecture doc §3) | Both |
| 10–13 | Wire title screen → Act 1 → transition → Act 2 → end | Both |
| 13–14 | End-to-end timing rehearsal (<3 min target) | Both |
| 14–15 | Write/rehearse the pitch (open with the "three career paths" line, live demo, close on the Mental Stability reveal) | Both |
| 15–16 | Final buffer — fix whatever broke in rehearsal | Both |

---

## 4. Definition of Done (Minimum Viable Demo)

Before Hour 14, both must confirm:
- [ ] Act 1 produces a verdict (LLM or fallback) within 5 seconds for any input
- [ ] Act 2 hand tracking works reliably in venue lighting with the actual demo laptop
- [ ] Radar chart updates live and clearly shows Mental Health collapsing
- [ ] Full cycle (title → Act 1 → transition → Act 2 → result) completes in under 3 minutes
- [ ] Restart works without restarting the whole application
- [ ] Pitch is rehearsed and timed under 60 seconds spoken intro

## 5. Stretch Goals (Only if ahead of schedule)

- Act 1 verdict flavor text carries into Act 2 ("Simulating: Engineer Edition")
- Printed physical "Career Certificate" / "Student Status" via a thermal receipt printer for a
  stronger photo/demo moment
- Background ambient sound design specific to each Act
