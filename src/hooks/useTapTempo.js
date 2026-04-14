import { useState, useCallback, useRef, useEffect } from 'react';
import { useMetronomeStore } from '../store/useMetronomeStore';

/**
 * Custom hook to calculate BPM based on tap timing.
 * Resets if tap interval is greater than 2 seconds.
 * @returns {{ tap: () => void, tapCount: number }}
 */
export const useTapTempo = () => {
  const setBpm = useMetronomeStore((state) => state.setBpm);
  const [taps, setTaps] = useState([]);
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef(0);
  const hideCountTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (hideCountTimeoutRef.current) {
        clearTimeout(hideCountTimeoutRef.current);
      }
    };
  }, []);

  const tap = useCallback(() => {
    const now = Date.now();
    const interval = now - lastTapRef.current;

    if (hideCountTimeoutRef.current) {
      clearTimeout(hideCountTimeoutRef.current);
      hideCountTimeoutRef.current = null;
    }

    if (interval > 2000) {
      setTaps([now]);
      setTapCount(1);
    } else {
      const newTaps = [...taps, now];
      if (newTaps.length > 1) {
        const intervals = [];
        for (let i = 1; i < newTaps.length; i++) {
          intervals.push(newTaps[i] - newTaps[i - 1]);
        }

        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const bpm = Math.round(60000 / avgInterval);
        setBpm(bpm);
      }
      const trimmed = newTaps.slice(-4);
      setTapCount(trimmed.length);
      setTaps(trimmed);
    }

    lastTapRef.current = now;

    hideCountTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
      hideCountTimeoutRef.current = null;
    }, 2000);
  }, [taps, setBpm]);

  return { tap, tapCount };
};
