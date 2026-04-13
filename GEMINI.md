# Hakutala — Gemini CLI Configuration

See AGENTS.md for full project context, tech stack, structure, roadmap,
audio engine rules, branding rules, and code conventions.

---

## Gemini CLI-Specific Instructions

### Working Style
This project is a learning exercise for a non-frontend developer. When making
changes:
- Explain what you are doing and why before writing code
- Develop using TDD. Write test first, show it fails. Then implement the minimum required to make the test pass. Refactor and refine.
- Check in to git whenever you get to a good stopping point and all tests pass. 
- Add inline comments to non-obvious logic, especially in `src/audio/`
- If asked to build a feature, break it into small, reviewable steps
- Ask before creating new files or directories not in the planned structure

### Preferred Commands During Development
```bash
npm run dev          # Always verify dev server runs after scaffold changes
npm run test:watch   # Keep running during feature development
npm run build        # Run before any Capacitor sync
```

### Session Behaviour
- Before starting a new feature, read the relevant existing files first
- Prefer editing existing files over creating new ones
- When modifying the audio engine, always check `src/hooks/useMetronome.js`
  for downstream effects
- Run `npm run test` after any change to `src/audio/`

### Commit Style
Use conventional commits:
```
feat: add tap tempo hook
fix: correct lookahead scheduler drift on Safari
docs: update AGENTS.md with Phase 2 pattern format
```
