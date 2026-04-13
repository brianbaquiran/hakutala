import React from 'react';
import { useMetronomeStore } from '../store/useMetronomeStore';

/**
 * Component for controlling BPM (Beats Per Minute).
 * Includes an input field and +/- buttons.
 */
export const BpmControl = () => {
  const { bpm, setBpm } = useMetronomeStore();

  const handleIncrement = () => setBpm(bpm + 1);
  const handleDecrement = () => setBpm(bpm - 1);
  const handleChange = (e) => setBpm(parseInt(e.target.value, 10) || 0);

  return (
    <div className="bpm-control">
      <label htmlFor="bpm-input">BPM</label>
      <button onClick={handleDecrement}>-</button>
      <input
        id="bpm-input"
        type="number"
        value={bpm}
        onChange={handleChange}
        min="20"
        max="300"
      />
      <button onClick={handleIncrement}>+</button>
    </div>
  );
};
