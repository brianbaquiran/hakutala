 Design brief: Hakutala (web metronome)

Figma Link: https://www.figma.com/make/0Yaot9DH1DjUu7wHsmr9BV/%E7%84%A1%E9%A1%8C?t=Mv7tE9EJuv5jJobZ-1

  1. Product

  Hakutala is a cross-platform musician-grade metronome (web first; later Android/iOS via Capacitor). The name blends
  ideas of beat and rhythmic cycle; it should feel precise, calm, and professional, not toy-like or gimmicky.
  Current scope (Phase 1): BPM control, start/stop, time signature, visual beat dots, volume, tap tempo. No rhythm
  pattern editor or sample library in this brief unless you explicitly expand scope.

  ────────────────────────────────────────



  2. Audience and context

  • Primary: Practicing musicians (any level) using phone, tablet, or laptop in rehearsal rooms, bedrooms, or teaching
    studios—often dim light, sometimes one-handed use.
  • Secondary: Teachers demonstrating tempo; quick “I need a click” sessions.
  • Expectation: Controls are glanceable and touch-friendly; the running state must be obvious at a distance (is it
    on? where is the downbeat?).


  ────────────────────────────────────────



  3. Brand and legal constraints (non-negotiable)

  • Do not reference or visually imitate any specific commercial hardware metronome or well-known metronome product
    lines. The app may feel “at home next to DAWs and tuner apps” in a generic sense only—no clone UI.
  • Do not use competitor trademarks or model names in copy or mockups.
  • Do give Hakutala a distinct visual identity (typography, color, layout, motion) that could stand alone in an app
    store screenshot.


  ────────────────────────────────────────



  4. Current implementation (baseline for redesign)

  • Stack: React, plain CSS (no Tailwind in codebase today). Design can assume CSS variables for theme tokens
    (light/dark already planned via prefers-color-scheme).
  • Shell: Centered layout, app title “Hakutala”, subtitle “Musician-grade Metronome”, footer with copyright.
  • Core panel (“Metronome” card): Beat indicator (dots), BPM control (+/− and numeric field), time signature
    <select>, volume slider, TAP and START/STOP (stop state uses a distinct treatment today).

  Designers do not need to preserve current layout; treat it as functional wireframe level.

  ────────────────────────────────────────



  5. Design goals

  1. Clarity hierarchy: Primary = tempo + transport; secondary = time signature and volume; tertiary = tap and chrome.
  2. Confidence: Running vs stopped is unmistakable; downbeat vs other beats reads in peripheral vision (size, color,
     glow, or motion—your call).
  3. Polish without clutter: Fewer borders/boxes if a cleaner structure works; generous spacing; consistent radii and
     elevation.
  4. Dark and light: Full themes (not only inverted grays)—contrast safe for small text and controls in both.
  5. Motion (optional): Subtle, purposeful (e.g. beat pulse); respect `prefers-reduced-motion`.
  6. Accessibility: WCAG-minded contrast; visible focus states; hit targets ≥ 44×44 px where possible; slider and
     controls usable with keyboard and screen readers (labels, states).


  ────────────────────────────────────────



  6. Deliverables requested from design (Figma)


  ┌─────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Deliver │ Notes                                                                                                    │
  │ able    │                                                                                                          │
  ├─────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Design  │ Color (semantic: background, surface, text, accent, danger/stop), typography scale, spacing, radii,      │
  │ tokens  │ elevation, motion durations.                                                                             │
  │ Typogra │ App name treatment + UI type. Latin-first; note if you want future Japanese support in marketing or UI   │
  │ phy     │ strings.                                                                                                 │
  │ Compone │ Primary/secondary/tertiary buttons, icon buttons if any, numeric stepper, select, range slider (+        │
  │ nts     │ optional numeric volume), beat indicator variants for 2–7 beats per bar.                                 │
  │ Key     │ Desktop (~1280) and mobile (375–430 width): default, running, volume at zero (silent but “on”), dark and │
  │ screens │ light.                                                                                                   │
  │ States  │ Hover, active, focus-visible, disabled (if any), loading (if you add later).                             │
  │ Handoff │ Redlines or auto-layout specs; export notes for CSS variables naming if possible.                        │
  └─────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────┘


  ────────────────────────────────────────



  7. Open creative direction (for the designer)

  • Mood keywords: Rhythm, precision, night studio, calm focus—avoid “arcade” or “kids’ app.”
  • Inspiration (category only): Professional audio/musician utilities and instrument tuners—not one specific app to
    copy.
  • Name story (optional in UI): A single short line in About or marketing is enough; avoid long ethno-linguistic
    explanations on the main metronome screen.


  ────────────────────────────────────────



  8. Out of scope for this brief (unless you add them)

  • Rhythm patterns, subdivisions, sample-based sounds, song mode.
  • Marketing site, logo animation, full brand book (can be phase 2).


  ────────────────────────────────────────



  9. Success criteria

  • A musician can start/stop, read BPM, and see the downbeat in &lt; 2 seconds on first open without reading help
    text.
  • The UI feels intentionally designed (not default browser widgets stacked in a box).
  • Engineering can implement with plain CSS + variables without a new CSS framework.