import React from 'react';
import { useMetronomeStore } from '../store/useMetronomeStore';

/**
 * Component for controlling the metronome's volume.
 * Includes a slider input.
 */
export const VolumeControl = () => {
  const { volume, setVolume } = useMetronomeStore();

  const handleChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="volume-control">
      <label htmlFor="volume-slider">Volume</label>
      <input
        id="volume-slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleChange}
      />
    </div>
  );
};
