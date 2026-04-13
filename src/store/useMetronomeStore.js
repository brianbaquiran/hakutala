import { create } from 'zustand';

/**
 * Zustand store for metronome state.
 * Handles BPM, time signature, running state, and volume.
 */
export const useMetronomeStore = create((set) => ({
  bpm: 120,
  isRunning: false,
  timeSignature: { beatsPerMeasure: 4, beatValue: 4 },
  volume: 0.8,
  
  setBpm: (bpm) => set({ bpm: Math.min(Math.max(bpm, 20), 300) }),
  setRunning: (isRunning) => set({ isRunning }),
  setTimeSignature: (beatsPerMeasure, beatValue) => 
    set({ timeSignature: { beatsPerMeasure, beatValue } }),
  setVolume: (volume) => set({ volume: Math.min(Math.max(volume, 0), 1) }),
  
  toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),
}));
