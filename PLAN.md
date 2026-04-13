# Phase 1.3 — Implementation Plan

Living document for **Volume**, **Tap Tempo**, **AudioContext handling**, and **core UI polish**. `AGENTS.md` remains the long-term roadmap; this file tracks **current implementation state** and **next steps**.

---

## Goals (from AGENTS.md Phase 1.3)

1. Volume control wired into playback.
2. Tap tempo integrated with BPM state.
3. Robust `AudioContext` handling (resume on user gesture where required).
4. Initial UI/UX polish for these features.

---

## Current state (as of this plan)

### Done

| Area | Status |
|------|--------|
| **Store** | `volume` (default `0.8`), `setVolume` clamped to `[0, 1]` in `useMetronomeStore`. |
| **Engine** | `MetronomeEngine.start` / `updateParams` accept `volume`; click gain uses `envelope.gain` with `volume`. `start()` calls `init()`, resumes if `suspended`, then schedules. |
| **Hook** | `useMetronome` passes `volume` into `start` and `updateParams` while running. |
| **UI** | `VolumeControl` — labeled range `0–1`, step `0.01`, bound to store. Styles live in `Metronome.css` (plain CSS, consistent with the rest of the screen). |
| **Tap tempo** | `useTapTempo` — moving average over up to 4 taps, 2s idle reset, updates `setBpm` (clamped by store). Unit tests in `useTapTempo.test.js`. |
| **Metronome screen** | TAP button, START/STOP, BPM, time signature, beat dots, volume slider. |
| **Tests** | `Metronome.test.jsx` covers engine mock with `volume` arg and beat indicator at volume `0`. |

### Gaps / risks

- **`AudioContext.resume()`** is only invoked from `MetronomeEngine.start()`. Gestures that change tempo or volume **without** starting (e.g. TAP only, or slider only) may leave the context suspended until START — acceptable for some UX, but worth validating on Safari/mobile and deciding if TAP or first interaction should `resume()` proactively.
- **`useMetronome`**: the “live update” `useEffect` dependency list omits `onBeat`; if `onBeat` identity changes while running, the engine might keep an old callback until another param changes. Low priority if `Metronome` keeps `onBeat` stable via `useCallback([])`.
- **Test coverage**: no dedicated tests for `setVolume` / `VolumeControl` / passing volume into the engine from an integration-style test; no `MetronomeEngine` unit tests (project guidance: run `npm run test` after `src/audio/` changes — engine tests would support that).
- **Tap tempo**: first tap after a long gap only seeds timing (by design); document or test edge cases (single tap, very fast taps hitting BPM clamp20–300).
- **Polish**: optional numeric volume readout, ARIA for slider, keyboard focus order, disabled/visual state when stopped (if desired).

---

## How to continue development

Ordered so each step is shippable and testable.

### 1. Lock in Volume behavior (tests + edge cases)

- Add store tests for `setVolume` (in-range, clamp below 0 / above 1).
- Add a `Metronome` (or `VolumeControl`) test: moving the slider updates store and that `metronomeEngine.updateParams` receives the new volume when running (extend existing mock pattern).
- Optionally add a small `MetronomeEngine` test module: after `start` with a stubbed/minimal context, assert scheduled gain or that `volume` is applied (only if we can do it without brittle Web Audio mocking).

### 2. AudioContext robustness

- Manually verify: fresh load → START hears audio; load → adjust volume → START; load → TAP only → START; Safari / mobile if available.
- If needed: expose a small `resumeAudioContextIfNeeded()` (or call `init()` + `resume()` from hook on first user gesture: START, TAP, or volume change) so the first audible action is reliable. Keep all Web Audio calls in `src/audio/`.

### 3. Tap tempo hardening

- Confirm UX: whether first two taps should set BPM immediately (currently BPM updates from the third tap onward when using the moving average — tests document current behavior).
- Add tests for: BPM clamping via tap (e.g. intervals implying < 20 or > 300 BPM), and any bug fixes (e.g. stale closure in `useTapTempo` if we refactor to refs instead of `taps` in `useCallback` deps).

### 4. Phase 1.3 UI polish (minimal, on-brand)

- Align TAP / START / volume block spacing and labels with existing `Metronome.css` variables.
- Optional: `aria-valuenow` / `aria-valuemin` / `aria-valuemax` on the volume slider for screen readers.
- Remove leftover-only comments in JSX if any (keep code review clean).

### 5. Close Phase 1.3

- Run `npm run test` and `npm run lint`; fix regressions.
- Update or add acceptance-style tests that match what we want for 1.3 (volume audible range, tap updates BPM, start/stop still correct).
- When satisfied, treat Phase 1.3 as complete per `AGENTS.md` and move focus to Phase 2 planning separately.

---

## Definition of done (Phase 1.3)

- [ ] Volume reliably affects click loudness; slider (and store clamps) covered by tests where practical.
- [ ] Tap tempo updates BPM within 20–300; long pause resets; tests cover main paths and clamps.
- [ ] No known case where a normal user gesture path leaves audio permanently silent solely because `AudioContext` stayed suspended (document platform exceptions if any remain).
- [ ] UI for volume + tap + transport is coherent with existing plain CSS and readable on a narrow viewport.

---

## Files most involved

| File | Role |
|------|------|
| `src/audio/MetronomeEngine.js` | Volume in synthesis; `resume`; scheduling |
| `src/hooks/useMetronome.js` | Passes volume; start/stop lifecycle |
| `src/hooks/useTapTempo.js` | Tap → BPM |
| `src/store/useMetronomeStore.js` | `volume`, `setVolume` |
| `src/components/VolumeControl.jsx` | Volume UI |
| `src/components/Metronome.jsx` | Composition |
| `src/components/Metronome.css` | Layout/styling |
| `*.test.js` / `*.test.jsx` | Regression safety |

---

## Notes

- **Dependencies**: No new npm packages for Phase 1.3 unless you explicitly approve.
- **CSS**: Continue plain CSS in component files (current pattern); no Tailwind/CSS Modules unless the project shifts globally.
