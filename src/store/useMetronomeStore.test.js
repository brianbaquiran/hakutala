import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useMetronomeStore } from './useMetronomeStore';

describe('useMetronomeStore', () => {
  beforeEach(() => {
    // Reset store state before each test if needed
    // Zustand stores persist in memory during tests, so we manually reset
    act(() => {
      useMetronomeStore.setState({
        bpm: 120,
        isRunning: false,
        timeSignature: { beatsPerMeasure: 4, beatValue: 4 },
        volume: 0.8,
      });
    });
  });

  it('should have default values', () => {
    const { result } = renderHook(() => useMetronomeStore());
    expect(result.current.bpm).toBe(120);
    expect(result.current.isRunning).toBe(false);
  });

  it('should update BPM within limits', () => {
    const { result } = renderHook(() => useMetronomeStore());
    
    act(() => result.current.setBpm(200));
    expect(result.current.bpm).toBe(200);

    act(() => result.current.setBpm(10)); // Below min (20)
    expect(result.current.bpm).toBe(20);

    act(() => result.current.setBpm(400)); // Above max (300)
    expect(result.current.bpm).toBe(300);
  });

  it('should toggle running state', () => {
    const { result } = renderHook(() => useMetronomeStore());
    
    act(() => result.current.toggleRunning());
    expect(result.current.isRunning).toBe(true);

    act(() => result.current.toggleRunning());
    expect(result.current.isRunning).toBe(false);
  });
});
