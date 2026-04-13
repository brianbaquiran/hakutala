import { useEffect, useCallback } from 'react';
import { useMetronomeStore } from '../store/useMetronomeStore';
import { metronomeEngine } from '../audio/MetronomeEngine';

/**
 * Custom hook to control the metronome audio engine from components.
 * Manages the connection between the Zustand store and the Web Audio engine.
 */
export const useMetronome = (onBeat) => {
  const { 
    bpm, 
    isRunning, 
    timeSignature, 
    volume,
    setRunning 
  } = useMetronomeStore();

  // Initialize and handle start/stop
  useEffect(() => {
    if (isRunning) {
      metronomeEngine.start(
        bpm, 
        timeSignature.beatsPerMeasure,
        timeSignature.beatValue,
        volume,
        onBeat
      );
    } else {
      metronomeEngine.stop();
    }
    
    // Cleanup on unmount or when isRunning changes
    return () => metronomeEngine.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, onBeat]); // Only re-run if running state or onBeat callback changes (initial start/stop)

  // Update parameters while running
  useEffect(() => {
    if (isRunning) {
      metronomeEngine.updateParams(
        bpm, 
        timeSignature.beatsPerMeasure,
        timeSignature.beatValue,
        volume
      );
    }
  }, [bpm, timeSignature, volume, isRunning]);

  const toggleMetronome = useCallback(() => {
    setRunning(!isRunning);
  }, [isRunning, setRunning]);

  return {
    toggleMetronome,
    isRunning,
    bpm,
    timeSignature,
    volume
  };
};
