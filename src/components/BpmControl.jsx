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
      <label className="bpm-control__label" htmlFor="bpm-input">
        Tempo
      </label>
      <div className="bpm-control__row">
        <button
          type="button"
          className="bpm-control__step"
          onClick={handleDecrement}
          disabled={bpm <= 20}
          aria-label="Decrease tempo"
        >
          -
        </button>
        <div className="bpm-control__value-wrap">
          <input
            id="bpm-input"
            className="bpm-control__input"
            type="number"
            value={bpm}
            onChange={handleChange}
            min="20"
            max="300"
            aria-label="Tempo in BPM"
          />
          <div className="bpm-control__unit">BPM</div>
        </div>
        <button
          type="button"
          className="bpm-control__step"
          onClick={handleIncrement}
          disabled={bpm >= 300}
          aria-label="Increase tempo"
        >
          +
        </button>
      </div>
    </div>
  );
};
