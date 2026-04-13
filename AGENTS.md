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

### Phase 1 — Core Metronome (current focus)
- BPM control: tap tempo, +/- buttons, numeric input (range: 20–300)
- Time signatures: 2/4, 3/4, 4/4, 5/4, 6/8, 7/8
- Start/stop toggle
- Visual beat indicator (flash on downbeat)
- Accent beat vs. regular beat (synthesized audio only)
- Volume control

### Phase 2 — Rhythm Guide
- Subdivisions: quarter, 8th, 16th, triplets
- Preset rhythm patterns (bossa nova, shuffle, rock, waltz, etc.)
- Multiple sound voices (hi-hat, kick, snare, woodblock)
- Per-beat accent levels (3 levels)
- A/B pattern switching
- Real audio samples (replace synthesized clicks)

### Phase 3 — Song Mode
- Pattern chaining with repeat counts
- Gradual BPM increase mode (speeds up every N bars)
- Named pattern storage via localStorage
- Mute individual instruments per beat

### Phase 4 — Native Mobile Polish
- Haptic feedback on the beat (Capacitor Haptics plugin)
- Background audio (keep playing when screen locks)
- MIDI sync (advanced, post-launch)

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
