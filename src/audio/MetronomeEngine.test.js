import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MetronomeEngine } from './MetronomeEngine';

/**
 * Minimal AudioContext mock. Real browsers reject exponential gain ramps
 * to/from zero; that used to throw inside the scheduler at volume 0 and
 * silently kill the metronome while isRunning stayed true.
 */
function createStrictMockContext() {
  let audioTime = 0;
  return {
    get currentTime() {
      return audioTime;
    },
    advanceAudioClock(seconds) {
      audioTime += seconds;
    },
    state: 'running',
    resume: vi.fn().mockResolvedValue(undefined),
    destination: {},
    createOscillator: vi.fn(() => ({
      frequency: { value: 440 },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    })),
    createGain: vi.fn(() => ({
      gain: {
        value: 0,
        exponentialRampToValueAtTime: vi.fn((value) => {
          if (value <= 0) {
            throw new DOMException(
              'The value must be strictly greater than 0.',
              'InvalidStateError'
            );
          }
        }),
      },
      connect: vi.fn(),
    })),
  };
}

describe('MetronomeEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new MetronomeEngine();
  });

  afterEach(() => {
    engine.stop();
    vi.useRealTimers();
  });

  it('does not throw when starting at volume 0 (silent beats)', () => {
    const ctx = createStrictMockContext();
    engine.audioContext = ctx;
    const onBeat = vi.fn();

    expect(() => {
      engine.start(120, 4, 4, 0, onBeat);
    }).not.toThrow();

    expect(onBeat).toHaveBeenCalled();
    expect(ctx.createOscillator).not.toHaveBeenCalled();
  });

  it('keeps scheduling onBeat callbacks when volume is 0', () => {
    vi.useFakeTimers();
    const ctx = createStrictMockContext();
    engine.audioContext = ctx;
    const onBeat = vi.fn();

    engine.start(240, 4, 4, 0, onBeat);
    const afterStart = onBeat.mock.calls.length;
    expect(afterStart).toBeGreaterThan(0);

    // Drive fake timeouts and advance the audio clock like a real context.
    for (let i = 0; i < 40; i++) {
      vi.advanceTimersByTime(25);
      ctx.advanceAudioClock(0.025);
    }

    expect(onBeat.mock.calls.length).toBeGreaterThan(afterStart);
    expect(ctx.createOscillator).not.toHaveBeenCalled();

    engine.stop();
  });

  it('builds oscillator clicks when volume is greater than zero', () => {
    const ctx = createStrictMockContext();
    engine.audioContext = ctx;
    engine.start(120, 4, 4, 0.8, vi.fn());

    expect(ctx.createOscillator).toHaveBeenCalled();
    expect(ctx.createGain).toHaveBeenCalled();
  });
});
