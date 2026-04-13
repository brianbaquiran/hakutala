# Hakutala — AI Agent Configuration

Hakutala is a cross-platform professional metronome web app inspired by the
BOSS Dr. Beat product line, built with React + Vite + Web Audio API, deployable
to web, Android, and iOS via Capacitor.

---

## Project Goal

Build a feature-rich, accurate, musician-grade metronome app with:
- Precise audio timing using the Web Audio API scheduler
- Cross-platform deployment: web (primary), Android and iOS via Capacitor
- A phased feature rollout from core metronome to full rhythm guide and song mode
- A distinctive visual identity — NOT a copy of any BOSS/Roland product

The developer is a non-frontend developer learning as they go. Prefer clarity
and explainability over cleverness. Add comments to non-obvious audio logic.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI framework | React 18+ with hooks |
| Build tool | Vite |
| Language | JavaScript (ES2022+), no TypeScript for now |
| Audio | Web Audio API — no external audio libraries |
| State | Zustand (lightweight, no boilerplate) |
| Styling | CSS Modules or plain CSS — no Tailwind |
| Mobile wrapper | Capacitor 6+ |
| Package manager | npm |
| Testing | Vitest + React Testing Library |

Do NOT introduce additional dependencies without asking first.

---

## Project Structure

```
hakutala/
├── public/
│   └── sounds/              # .wav sample files (Phase 2+)
├── src/
│   ├── audio/               # Web Audio engine and scheduler logic
│   ├── components/          # React UI components
│   ├── hooks/               # Custom hooks: useMetronome, useTapTempo, etc.
│   ├── patterns/            # Rhythm pattern data as JSON
│   ├── store/               # Zustand state stores
│   └── App.jsx              # Root component
├── android/                 # Capacitor-generated — do not hand-edit
├── ios/                     # Capacitor-generated — do not hand-edit
├── capacitor.config.js
├── vite.config.js
├── index.html
├── AGENTS.md                # This file — source of truth for all AI tools
├── CLAUDE.md                # Claude Code-specific config (imports this file)
└── GEMINI.md                # Gemini CLI-specific config (imports this file)
```

---

## Common Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
npm run test         # Run Vitest test suite
npm run test:watch   # Run tests in watch mode
npm run lint         # ESLint check
npx cap sync         # Sync web build to Android/iOS after npm run build
npx cap open android # Open Android Studio
npx cap open ios     # Open Xcode
```

---

## Feature Roadmap

### Phase 1 — Core Metronome
- **Phase 1.1: Basic Controls & Engine**
  - Implement BPM control (numeric input, +/- buttons)
  - Implement Start/Stop toggle
  - Basic Web Audio API engine with synthesized clicks
  - Integrate `useMetronomeStore` and `useMetronome` hook
  - **Acceptance Criteria (Tests):**
    - Verify BPM can be set via input and +/- buttons.
    - Verify BPM value is within 20-300 range.
    - Verify metronome starts and stops via toggle button.
    - Verify `useMetronome` hook correctly interacts with `metronomeEngine.start()` and `metronomeEngine.stop()`.
    - Verify `MetronomeEngine` initializes `AudioContext` and schedules notes.
    - Verify `MetronomeEngine` plays distinct sounds for downbeats (first beat) and regular beats.
    - Verify `useMetronomeStore` updates `bpm` and `isRunning` states correctly.
- **Phase 1.2: Time Signature & Visuals**
  - Implement Time Signature selection (2/4, 3/4, 4/4, 5/4, 6/8, 7/8)
  - Develop Visual Beat Indicator (flash on downbeat)
  - Differentiate accent beat vs. regular beat audio
  - **Acceptance Criteria (Tests):**
    - (To be defined)
- **Phase 1.3: Volume & Tap Tempo**
  - Implement Volume control
  - Integrate Tap Tempo functionality
  - Ensure robust audio context handling (resume on user gesture)
  - Initial UI/UX polish for core features
  - **Acceptance Criteria (Tests):**
    - (To be defined)

### Phase 2 — Rhythm Guide
- **Phase 2.1: Subdivisions & Basic Samples**
  - Add subdivision selection (quarter, 8th, 16th, triplets)
  - Introduce `public/sounds/` directory and basic `.wav` sample loading
  - Replace synthesized clicks with `AudioBuffer` sample playback for basic beats
  - **Acceptance Criteria (Tests):**
    - (To be defined)
- **Phase 2.2: Pattern Management & Multiple Voices**
  - Implement preset rhythm patterns (bossa nova, shuffle, rock, waltz)
  - Introduce multiple sound voices (hi-hat, kick, snare, woodblock)
  - Develop a mechanism for per-beat accent levels (3 levels)
  - **Acceptance Criteria (Tests):**
    - (To be defined)
- **Phase 2.3: Advanced Pattern Features**
  - Implement A/B pattern switching
  - Refine UI for pattern selection and customization
  - Optimize sample loading and playback performance
  - **Acceptance Criteria (Tests):**
    - (To be defined)

### Phase 3 — Song Mode
- **Phase 3.1: Pattern Sequencing**
  - Implement pattern chaining with repeat counts
  - Develop UI for sequencing patterns
  - **Acceptance Criteria (Tests):**
    - (To be defined)
- **Phase 3.2: Dynamic Tempo & Storage**
  - Implement gradual BPM increase mode (speeds up every N bars)
  - Implement named pattern storage via `localStorage`
  - **Acceptance Criteria (Tests):**
    - (To be defined)
- **Phase 3.3: Instrument Control**
  - Add functionality to mute individual instruments per beat
  - Enhance UI for detailed song mode editing
  - **Acceptance Criteria (Tests):**
    - (To be defined)

### Phase 4 — Native Mobile Polish
- **Phase 4.1: Haptics & Background Audio**
  - Integrate Capacitor Haptics plugin for haptic feedback
  - Implement background audio playback
  - **Acceptance Criteria (Tests):**
    - (To be defined)
- **Phase 4.2: Basic Mobile UI/UX**
  - Optimize UI for mobile platforms (Android/iOS)
  - Address any platform-specific UI issues or interactions
  - **Acceptance Criteria (Tests):**
    - (To be defined)
- **Phase 4.3: Advanced Mobile Features (Post-launch consideration)**
  - Investigate and plan for MIDI sync (if requested post-launch)
  - Further performance optimizations for mobile.
  - **Acceptance Criteria (Tests):**
    - (To be defined)

---

## Audio Engine Rules

The audio engine is the most critical part of this app. Follow these rules:

1. **Always use the Web Audio API clock** (`audioContext.currentTime`) for
   scheduling — never use `setInterval` or `setTimeout` for audio events.
2. **Use a lookahead scheduler pattern**: schedule notes ~100ms ahead into the
   future to avoid timing gaps caused by the JS event loop.
3. All audio logic lives in `src/audio/`. Components never call Web Audio API
   directly — they use hooks in `src/hooks/`.
4. Resume `AudioContext` only on a user gesture (browser requirement).
5. Synthesize clicks using `OscillatorNode` + `GainNode` for Phase 1.
   Replace with `AudioBuffer` sample playback in Phase 2.

---

## Branding & Legal Rules

- App name: **Hakutala** (combines 拍 *haku*, Japanese for "beat", and
  *tala*, the Sanskrit/Indian classical rhythmic cycle concept)
- Do NOT reference BOSS, Roland, Dr. Beat, or any DB-series model numbers
  anywhere in code, comments, UI text, or documentation
- Do NOT copy the visual design of any specific hardware metronome
- All audio must be synthesized or use properly licensed samples
- UI may be inspired by professional music tool aesthetics generally

---

## Code Conventions

- One component per file, filename matches component name
- Custom hooks prefixed with `use`
- Audio engine functions are pure where possible (take state, return scheduled events)
- Prefer named exports over default exports (except for React components)
- Keep files under 300 lines — split if larger
- Comment non-obvious audio math and Web Audio API usage

---

## What NOT to Do

- Do not add a backend — this is a 100% frontend app
- Do not use TypeScript yet — keep it plain JavaScript
- Do not use CSS frameworks (Tailwind, Bootstrap, etc.)
- Do not use external audio libraries (Tone.js, Howler.js, etc.)
- Do not mutate state directly — use Zustand setters
- Do not hand-edit the `android/` or `ios/` directories
- Do not add dependencies without asking
