import React, { useState, useCallback } from 'react';
import { BpmControl } from './BpmControl';
import { useMetronome } from '../hooks/useMetronome';
import { useTapTempo } from '../hooks/useTapTempo';
import { useMetronomeStore } from '../store/useMetronomeStore';
import './Metronome.css';

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
    const [beats, value] = e.target.value.split('/').map(Number);
    setTimeSignature(beats, value);
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
        <select id="ts-select" value={`${timeSignature.beatsPerMeasure}/${timeSignature.beatValue}`} onChange={handleTimeSignatureChange}>
          <option value="2/4">2/4</option>
          <option value="3/4">3/4</option>
          <option value="4/4">4/4</option>
          <option value="5/4">5/4</option>
          <option value="6/8">6/8</option>
          <option value="7/8">7/8</option>
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
