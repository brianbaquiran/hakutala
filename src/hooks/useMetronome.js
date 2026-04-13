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

  // Start/stop only: do NOT list bpm, timeSignature, or volume here — that would
  // stop/start the engine on every control change and reset scheduling. While
  // running, those values are pushed via updateParams in the effect below.
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

    return () => metronomeEngine.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only isRunning + onBeat; see comment above
  }, [isRunning, onBeat]);

  // Live parameter updates while running (including onBeat identity changes).
  useEffect(() => {
    if (isRunning) {
      metronomeEngine.updateParams(
        bpm,
        timeSignature.beatsPerMeasure,
        timeSignature.beatValue,
        volume,
        onBeat
      );
    }
  }, [bpm, timeSignature, volume, isRunning, onBeat]);

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
