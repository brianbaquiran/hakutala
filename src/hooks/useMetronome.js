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
        volume,
        onBeat
      );
    } else {
      metronomeEngine.stop();
    }
    
    // Cleanup on unmount or when isRunning changes
    return () => metronomeEngine.stop();
  }, [isRunning, onBeat]); // Only re-run if running state or callback changes

  // Update parameters while running
  useEffect(() => {
    if (isRunning) {
      metronomeEngine.updateParams(
        bpm, 
        timeSignature.beatsPerMeasure, 
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
