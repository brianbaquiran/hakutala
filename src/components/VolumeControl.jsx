import React from 'react';
import { useMetronomeStore } from '../store/useMetronomeStore';

/**
 * Component for controlling the metronome's volume.
 * Includes a slider input.
 */
export const VolumeControl = () => {
  const { volume, setVolume } = useMetronomeStore();
  const isMuted = volume === 0;

  const handleChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="volume-control">
      <span className="volume-control__icon" aria-hidden>
        {isMuted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M11 5L6 9H3v6h3l5 4V5zM23 9l-6 6M17 9l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M11 5L6 9H3v6h3l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a9 9 0 0 1 0 14.14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          </svg>
        )}
      </span>

      <div className="volume-control__track">
        <div
          className="volume-control__fill"
          style={{ width: `${volume * 100}%` }}
          aria-hidden
        />
        <input
          id="volume-slider"
          className="volume-control__range"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleChange}
          aria-label="Volume"
        />
      </div>

      <span className="volume-control__pct">{Math.round(volume * 100)}%</span>
    </div>
  );
};
