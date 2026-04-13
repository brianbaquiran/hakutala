import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTapTempo } from './useTapTempo';
import { useMetronomeStore } from '../store/useMetronomeStore';

describe('useTapTempo', () => {
  beforeEach(() => {
    act(() => {
      useMetronomeStore.setState({ bpm: 120 });
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 1, 1, 12, 0, 0));
  });

  it('should calculate BPM after at least two taps', () => {
    const { result } = renderHook(() => useTapTempo());
    const initialBpm = useMetronomeStore.getState().bpm;

    // First tap
    act(() => result.current.tap());
    expect(useMetronomeStore.getState().bpm).toBe(initialBpm);

    // Second tap 500ms later
    act(() => {
      vi.advanceTimersByTime(500);
      result.current.tap();
    });
    expect(useMetronomeStore.getState().bpm).toBe(120);

    // Third tap 400ms later (Avg: 450ms)
    act(() => {
      vi.advanceTimersByTime(400);
      result.current.tap();
    });
    expect(useMetronomeStore.getState().bpm).toBe(133);
  });

  it('should reset if interval is too long (e.g., > 2 seconds)', () => {
    const { result } = renderHook(() => useTapTempo());
    
    act(() => result.current.tap());
    vi.advanceTimersByTime(2500); // Wait 2.5s
    act(() => result.current.tap());
    
    // Should treat second tap as a fresh start, so BPM remains unchanged
    expect(useMetronomeStore.getState().bpm).toBe(120);
  });
});
