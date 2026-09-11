# Oru Average Malayali — Familial Career Allocation Protocol

A two-act satirical web + hand-tracked experience. Act 1 is the AI career agent that always assigns Engineer / Doctor / Nurse Abroad; Act 2 is a real-time OpenCV hand-tracking game about surviving Indian academic pressure.

## Screenshots

![Loading Screen](Screenshot%202026-09-12%20042312.png)
*Loading screen with the hamster wheel during the "Malayali Rat Race" boot sequence.*

![Hero Screen](Screenshot%202026-09-12%20042328.png)
*Hero screen — the claymation diorama, aspirant name input, and "Find Out My Future" start button.*

![Questionnaire Stepper](Screenshot%202026-09-12%20042342.png)
*Quiz screen with the dark-emerald kinetic grid background and the 8-step questionnaire.*

![Career Certificate](Screenshot%202026-09-12%20042530.png)
*Certificate rendered by the Ammavan Council — assigned career pathway, signatures, and pearl-styled action buttons.*

![Act 2 Transition](Screenshot%202026-09-12%20042554.png)
*Transition screen bridging to Act 2, the real-time OpenCV hand-tracking round.*

## Diagrams

```mermaid
flowchart TD
    A[Loading Screen<br/>5 sec hamster wheel] --> B[Hero Screen<br/>Enter your name]
    B --> C[Take the 8-Question Quiz]
    C --> D[Loading Screen<br/>Ammavan Council judges]
    D --> E[Career Certificate<br/>e.g. Doctor Pathway]
    E -->|I want this career| F[Act 2: Hand-Tracking Game<br/>Survive 30 seconds]
    E -->|I don't want this career| E
    F --> G[Radar Chart Result<br/>Total Burnout Achieved]
```

*Workflow: a loading intro leads to the hero screen, then an 8-question quiz, then the Ammavan Council "judges" the answers and issues a career certificate. Accepting the verdict starts the Act 2 hand-tracking game; rejecting it is instantly overruled and sends you right back to your certificate.*