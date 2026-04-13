import React from 'react';
import { Metronome } from './components/Metronome';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Hakutala</h1>
        <p className="subtitle">Musician-grade Metronome</p>
      </header>
      
      <main>
        <Metronome />
      </main>

      <footer>
        <p>&copy; 2026 Hakutala</p>
      </footer>
    </div>
  );
}

export default App;
