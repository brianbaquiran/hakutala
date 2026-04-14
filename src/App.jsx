import React, { useEffect, useState } from 'react';
import { Metronome } from './components/Metronome';
import './App.css';

const THEME_KEY = 'hakutala-theme';

function App() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light') return false;
      if (stored === 'dark') return true;
    } catch {
      /* ignore */
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }, [isDark]);

  return (
    <div className="app-container">
      <button
        type="button"
        className="app-theme-toggle"
        onClick={() => setIsDark((d) => !d)}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {isDark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <header className="app-header">
        <h1 className="app-title">Hakutala</h1>
        <p className="app-subtitle">Musician-grade Metronome</p>
      </header>

      <main className="app-main">
        <Metronome />
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Hakutala. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
