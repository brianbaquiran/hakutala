import { useState, useCallback, useRef } from 'react';
import { useMetronomeStore } from '../store/useMetronomeStore';

/**
 * Custom hook to calculate BPM based on tap timing.
 * Resets if tap interval is greater than 2 seconds.
 */
export const useTapTempo = () => {
  const setBpm = useMetronomeStore((state) => state.setBpm);
  const [taps, setTaps] = useState([]);
  const lastTapRef = useRef(0);

  const tap = useCallback(() => {
    const now = Date.now();
    const interval = now - lastTapRef.current;
    
    // Reset if it's been more than 2 seconds since last tap
    if (interval > 2000) {
      setTaps([now]);
    } else {
      const newTaps = [...taps, now];
      // Keep only last 4 taps for moving average
      if (newTaps.length > 1) {
        const intervals = [];
        for (let i = 1; i < newTaps.length; i++) {
          intervals.push(newTaps[i] - newTaps[i - 1]);
        }
        
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const bpm = Math.round(60000 / avgInterval);
        setBpm(bpm);
      }
      setTaps(newTaps.slice(-4)); // Keep history short
    }
    
    lastTapRef.current = now;
  }, [taps, setBpm]);

  return { tap };
};
