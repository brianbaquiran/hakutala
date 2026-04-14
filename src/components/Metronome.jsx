import React, { useState, useCallback } from 'react';
import { BpmControl } from './BpmControl';
import { useMetronome } from '../hooks/useMetronome';
import { useTapTempo } from '../hooks/useTapTempo';
import { useMetronomeStore } from '../store/useMetronomeStore';
import { VolumeControl } from './VolumeControl';
import './Metronome.css';

/**
 * Main Metronome component that combines all controls and the audio engine.
 */
export const Metronome = () => {
  const [currentBeat, setCurrentBeat] = useState(-1);

  const onBeat = useCallback((beat) => {
    setCurrentBeat(beat);
  }, []);

  const { isRunning, toggleMetronome } = useMetronome(onBeat);
  const { tap, tapCount } = useTapTempo();
  const { timeSignature, setTimeSignature } = useMetronomeStore();

  const activeBeat = isRunning ? currentBeat : -1;

  const handleTimeSignatureChange = (e) => {
    const [beats, value] = e.target.value.split('/').map(Number);
    setTimeSignature(beats, value);
  };

  return (
    <div className="metronome">
      <div className="metronome__beats" role="status" aria-live="polite">
        {Array.from({ length: timeSignature.beatsPerMeasure }).map((_, i) => {
          const active = i === activeBeat;
          return (
            <div key={i} className="metronome__beat-wrap">
              {active && (
                <span
                  className={`metronome__beat-glow ${i === 0 ? 'metronome__beat-glow--downbeat' : ''}`}
                  aria-hidden
                />
              )}
              <div
                data-testid={`beat-dot-${i}`}
                className={[
                  'metronome__beat-dot',
                  i === 0 ? 'metronome__beat-dot--downbeat' : '',
                  active ? 'metronome__beat-dot--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            </div>
          );
        })}
      </div>

      <div className="metronome__bpm">
        <BpmControl />
      </div>

      <div className="metronome__transport">
        <button
          type="button"
          className={`metronome__play ${isRunning ? 'metronome__play--running' : ''}`}
          onClick={toggleMetronome}
          aria-label={isRunning ? 'Stop metronome' : 'Start metronome'}
        >
          {isRunning ? (
            <svg className="metronome__play-icon" width="28" height="28" viewBox="0 0 24 24" aria-hidden>
              <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg className="metronome__play-icon metronome__play-icon--play" width="28" height="28" viewBox="0 0 24 24" aria-hidden>
              <path d="M9 7v10l9-5-9-5z" fill="currentColor" />
            </svg>
          )}
          {isRunning && <span className="metronome__play-ring" aria-hidden />}
        </button>
      </div>

      <div className="metronome__grid">
        <div className="metronome__field">
          <label className="metronome__field-label" htmlFor="ts-select">
            Time Signature
          </label>
          <div className="metronome__select-wrap">
            <select
              id="ts-select"
              className="metronome__select"
              value={`${timeSignature.beatsPerMeasure}/${timeSignature.beatValue}`}
              onChange={handleTimeSignatureChange}
              aria-label="Time signature"
            >
              <option value="2/4">2/4</option>
              <option value="3/4">3/4</option>
              <option value="4/4">4/4</option>
              <option value="5/4">5/4</option>
              <option value="6/8">6/8</option>
              <option value="7/8">7/8</option>
            </select>
            <span className="metronome__select-chevron" aria-hidden>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="metronome__field metronome__field--tap">
          <span className="metronome__field-label metronome__field-label--placeholder" aria-hidden>
            &nbsp;
          </span>
          <button type="button" className="metronome__tap" onClick={tap} aria-label="Tap tempo">
            Tap
            {tapCount > 0 && <span className="metronome__tap-count"> ({tapCount})</span>}
          </button>
        </div>
      </div>

      <div className="metronome__volume">
        <VolumeControl />
      </div>
    </div>
  );
};
