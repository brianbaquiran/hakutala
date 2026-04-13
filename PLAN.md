# Phase 1.3 — Implementation Plan

Living document for **Volume**, **Tap Tempo**, **AudioContext handling**, and **core UI polish**. `AGENTS.md` remains the long-term roadmap; this file tracks **current implementation state** and **next steps**.

---

## Goals (from AGENTS.md Phase 1.3)

1. Volume control wired into playback.
2. Tap tempo integrated with BPM state.
3. Robust `AudioContext` handling (resume on user gesture where required).
4. Initial UI/UX polish for these features.

---

## Senior code review (summary)

**Verdict:** This would **pass a pragmatic senior review for an early Phase 1 app** — architecture respects the “audio in `src/audio/`, UI through hooks” rule, the zero-volume bug was root-caused correctly (Web Audio exponential gain constraints), and the new engine tests are meaningful. A stricter reviewer would **request changes before a “production” merge**, mainly around React hook dependencies, tap-tempo implementation style, and a few engine/UX edge cases below.

### Strengths

- Clear separation: `MetronomeEngine` owns scheduling; components do not touch Web Audio.
- Lookahead scheduler + `currentTime` for note times matches established practice.
- Exporting `MetronomeEngine` as a class for tests while keeping a singleton for the app is a reasonable compromise.
- Engine tests use a mock that encodes real browser rules (strictly positive exponential gain), not only happy-path mocks.
- Volume is single-sourced in Zustand and threaded consistently into `start` / `updateParams`.

### Issues a senior would likely raise

| Severity | Topic | Detail |
|----------|--------|--------|
| **Medium** | `useMetronome` effects | First `useEffect` intentionally omits `bpm`, `timeSignature`, `volume` from deps (eslint disabled). That avoids restarting the whole engine on every BPM tick, but it deserves a **short comment explaining the contract**: live updates must go through `updateParams`. Without that, future edits may “fix” deps and regress behavior. |
| **Medium** | `useMetronome` second effect | Omits `onBeat` from the dependency array. Safe today because `Metronome` stabilizes `onBeat` with `useCallback([])`, but **fragile** if a caller passes an inline function. Either add `onBeat` to deps or document “stable callback required”. |
| **Medium** | `onBeat` from scheduler | `scheduleNote` invokes `onBeat` synchronously inside the `while` loop, so **many React `setState` calls can run in one timer tick** at high BPM or when the tab catches up. Can cause jank or React warnings. Long-term: throttle to animation frames, batch, or drive visuals off `currentTime` + `requestAnimationFrame`. |
| **Low** | `useTapTempo` | `tap` depends on `taps` state, so the callback identity **changes every tap** — unnecessary for current usage but a smell; a ref-based tap buffer avoids stale-pattern risk and extra renders if `tap` is ever passed deep. |
| **Low** | `MetronomeEngine.stop` | Only `clearTimeout`; does not null `timerID` or drain already-scheduled nodes (acceptable for Phase 1). Double `stop` is fine. |
| **Low** | `resume()` | `audioContext.resume()` returns a Promise and is not awaited; races are rare but a pedantic reviewer might ask for `void resume().catch(...)` or await in a dedicated init path. |
| **Low** | `VolumeControl` | `parseFloat` without NaN guard; store clamps help but **defensive parse** (or `Number.isFinite`) is cheap. Slider **a11y** (`aria-valuenow` / text value) still open. |
| **Low** | JSX hygiene | Redundant comments (`// Import VolumeControl`, `{/* Add VolumeControl here */}`) look like scaffolding; a senior would ask to **remove** them in a polish pass. |
| **Low** | Test gaps | `updateParams`, suspended `resume` branch, and real `init()` path are **uncovered** in engine tests (mock context pre-injected). `setVolume` / slider interaction still light on tests. |

### Would it ship?

- **Internal / Phase 1.3 milestone:** yes, with the above logged as follow-ups.
- **App-store “polish” bar:** not yet — address at least hook documentation or deps, `onBeat` scheduling strategy, AudioContext resume UX on non-START gestures, and basic a11y on the volume control.

---

## Current state (as of this plan)

### Done

| Area | Status |
|------|--------|
| **Store** | `volume` (default `0.8`), `setVolume` clamped to `[0, 1]` in `useMetronomeStore`. |
| **Engine** | `start` / `updateParams` accept `volume`; silent path at `volume <= 0` avoids invalid exponential ramps; scheduler keeps running. |
| **Hook** | `useMetronome` passes `volume` into `start` and `updateParams` while running. |
| **UI** | `VolumeControl` — labeled range `0–1`, step `0.01`, bound to store. Styles in `Metronome.css` (plain CSS). |
| **Tap tempo** | `useTapTempo` — moving average over up to 4 taps, 2s idle reset, updates `setBpm` (clamped by store). Tests in `useTapTempo.test.js`. |
| **Metronome screen** | TAP, START/STOP, BPM, time signature, beat dots, volume. |
| **Tests** | `MetronomeEngine.test.js` (volume 0 scheduling, oscillator path); `Metronome.test.jsx` (mock engine, beat UI at volume 0). |
| **Coverage** | `npm run test:coverage`; `@vitest/coverage-v8`; `coverage/` gitignored. |

### Open gaps (rolled forward from review)

- **`AudioContext.resume()`** still only from `start()`. Validate TAP-only / volume-only then START on Safari; consider `resume` on first relevant gesture in `src/audio/` if needed.
- **`onBeat` / React:** consider throttling or rAF if profiling shows issues.
- **`useTapTempo`:** optional ref refactor; tests for BPM clamp edges.
- **Tests:** store `setVolume`; slider changes `updateParams`; engine branches for `updateParams`, `suspended` + `resume`, and `init()` without pre-set context (integration or stripped-down test).
- **Polish:** remove scaffolding JSX comments; ARIA / numeric volume readout optional.

---

## How to continue development

Ordered so each step is shippable and testable.

### 1. Hook clarity and safety (small PR)

- Document in `useMetronome.js` why effect deps are narrowed; add `onBeat` to the update effect **or** document stability requirement.
- Fix trivial formatting (`useMetronome` closing brace alignment).

### 2. Volume tests and UX

- Store tests for `setVolume`; component test driving the range input.
- Optional: `aria-valuenow` / min / max on the volume slider; strip JSX noise comments in `Metronome.jsx`.

### 3. AudioContext robustness

- Manual matrix: fresh load, volume before START, TAP before START, Safari if available.
- If gaps: centralize `resume` in the audio layer on first user gesture that should affect audio.

### 4. Tap tempo hardening

- Confirm product intent for “first two taps” vs moving average from tap 3.
- Refactor to refs if profiling or lint rules push that way; add clamp tests.

### 5. Engine tests (incremental)

- Cover `updateParams` while running (volume change mid-stream).
- Optional: test with `state: 'suspended'` and assert `resume` called.

### 6. Close Phase 1.3

- Run `npm run test`, `npm run test:coverage`, `npm run lint`.
- Revisit definition of done below; then treat Phase 1.3 as complete per `AGENTS.md`.

---

## Definition of done (Phase 1.3)

- [x] Volume affects click loudness; zero volume does not kill the scheduler (regression covered by engine tests).
- [ ] Slider / `setVolume` covered by automated tests where practical.
- [ ] Tap tempo: main paths + BPM clamp edges tested; UX for first taps agreed.
- [ ] `useMetronome` dependency / callback contract documented or fixed.
- [ ] No known blocker where a normal gesture leaves audio silent only because `AudioContext` stayed suspended (or documented platform exception).
- [ ] UI coherent on narrow viewport; scaffolding comments removed.

---

## Files most involved

| File | Role |
|------|------|
| `src/audio/MetronomeEngine.js` | Volume in synthesis; `resume`; scheduling |
| `src/audio/MetronomeEngine.test.js` | Engine regressions (silent volume, strict gain mock) |
| `src/hooks/useMetronome.js` | Passes volume; start/stop lifecycle |
| `src/hooks/useTapTempo.js` | Tap → BPM |
| `src/store/useMetronomeStore.js` | `volume`, `setVolume` |
| `src/components/VolumeControl.jsx` | Volume UI |
| `src/components/Metronome.jsx` | Composition |
| `src/components/Metronome.css` | Layout/styling |
| `*.test.js` / `*.test.jsx` | Regression safety |

---

## Notes

- **Dependencies**: No new npm packages for Phase 1.3 unless explicitly approved (coverage tooling already added).
- **CSS**: Plain CSS in component files; no Tailwind/CSS Modules unless the project shifts globally.
