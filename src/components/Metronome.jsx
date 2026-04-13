import React, { useState, useCallback } from 'react';
import { BpmControl } from './BpmControl';
import { useMetronome } from '../hooks/useMetronome';
import { useTapTempo } from '../hooks/useTapTempo';
import { useMetronomeStore } from '../store/useMetronomeStore';

/**
 * Main Metronome component that combines all controls and the audio engine.
 */
export const Metronome = () => {
  const [currentBeat, setCurrentBeat] = useState(-1);
  
  // Audio engine callback for visual feedback
  const onBeat = useCallback((beat) => {
    setCurrentBeat(beat);
  }, []);

  const { isRunning, toggleMetronome } = useMetronome(onBeat);
  const { tap } = useTapTempo();
  const { timeSignature, setTimeSignature } = useMetronomeStore();

  const handleTimeSignatureChange = (e) => {
    const beats = parseInt(e.target.value, 10);
    setTimeSignature(beats, timeSignature.beatValue);
  };

  return (
    <div className="metronome">
      <div className="beat-indicator">
        {Array.from({ length: timeSignature.beatsPerMeasure }).map((_, i) => (
          <div 
            key={i} 
            className={`beat-dot ${i === currentBeat ? 'active' : ''} ${i === 0 ? 'downbeat' : ''}`}
          />
        ))}
      </div>

      <BpmControl />

      <div className="time-signature">
        <label htmlFor="ts-select">Time Signature</label>
        <select id="ts-select" value={timeSignature.beatsPerMeasure} onChange={handleTimeSignatureChange}>
          {[2, 3, 4, 5, 6, 7].map(n => (
            <option key={n} value={n}>{n}/4</option>
          ))}
        </select>
      </div>

      <div className="transport">
        <button className="tap-btn" onClick={tap}>TAP</button>
        <button 
          className={`start-stop-btn ${isRunning ? 'running' : ''}`} 
          onClick={toggleMetronome}
        >
          {isRunning ? 'STOP' : 'START'}
        </button>
      </div>
    </div>
  );
};
