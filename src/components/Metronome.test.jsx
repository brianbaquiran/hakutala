import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Metronome } from './Metronome';
import { useMetronomeStore } from '../store/useMetronomeStore';

// Define stubs, the actual mock implementations will be set in beforeEach
let metronomeEngineStubs = {
  start: () => {},
  stop: () => {},
  updateParams: () => {},
  onBeatCallback: null,
};

vi.mock('../audio/MetronomeEngine', () => ({
  metronomeEngine: {
    start: (...args) => metronomeEngineStubs.start(...args),
    stop: (...args) => metronomeEngineStubs.stop(...args),
    updateParams: (...args) => metronomeEngineStubs.updateParams(...args),
  },
}));

describe('Metronome', () => {
  beforeEach(() => {
    // Reset and spy on the stubs for each test
    metronomeEngineStubs.onBeatCallback = null; // Clear any stored callback

    metronomeEngineStubs.start = vi.fn((bpm, beatsPerMeasure, beatValue, volume, onBeat) => {
      metronomeEngineStubs.onBeatCallback = onBeat;
    });
    metronomeEngineStubs.stop = vi.fn();
    metronomeEngineStubs.updateParams = vi.fn((bpm, beatsPerMeasure, beatValue, volume, onBeat) => {
      if (onBeat) metronomeEngineStubs.onBeatCallback = onBeat;
    });

    act(() => {
      useMetronomeStore.setState({
        bpm: 120,
        isRunning: false,
        timeSignature: { beatsPerMeasure: 4, beatValue: 4 },
        volume: 0.8,
      });
    });
  });

  // Helper to get the onBeat callback from the mock
  const getOnBeatCallback = () => metronomeEngineStubs.onBeatCallback;

  it('renders core controls', () => {
    render(<Metronome />);
    expect(screen.getByLabelText(/bpm/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tap/i })).toBeInTheDocument();
  });

  it('toggles start/stop when button is clicked', () => {
    render(<Metronome />);
    const toggleBtn = screen.getByRole('button', { name: /start/i });
    
    fireEvent.click(toggleBtn);
    expect(useMetronomeStore.getState().isRunning).toBe(true);
    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(useMetronomeStore.getState().isRunning).toBe(false);
  });

  it('visual beat indicator functions correctly even when volume is minimum', async () => {
    render(<Metronome />);
    const toggleBtn = screen.getByRole('button', { name: /start/i });
    
    // Start metronome
    fireEvent.click(toggleBtn);
    expect(useMetronomeStore.getState().isRunning).toBe(true);

    // Set volume to minimum
    act(() => {
      useMetronomeStore.getState().setVolume(0);
    });
    
    // Verify volume is 0
    expect(useMetronomeStore.getState().volume).toBe(0);

    // Manually trigger onBeat callbacks for a 4/4 time signature
    // Beat 0 (downbeat)
    act(() => {
      getOnBeatCallback()(0);
    });
    let beatDots = screen.getAllByTestId(/beat-dot-/i); // Assuming beat dots have a test id
    expect(beatDots[0]).toHaveClass('metronome__beat-dot--active');
    expect(beatDots[0]).toHaveClass('metronome__beat-dot--downbeat');
    expect(beatDots[1]).not.toHaveClass('metronome__beat-dot--active');

    // Beat 1
    act(() => {
      getOnBeatCallback()(1);
    });
    beatDots = screen.getAllByTestId(/beat-dot-/i);
    expect(beatDots[0]).not.toHaveClass('metronome__beat-dot--active');
    expect(beatDots[1]).toHaveClass('metronome__beat-dot--active');
    expect(beatDots[1]).not.toHaveClass('metronome__beat-dot--downbeat');

    // Beat 2
    act(() => {
      getOnBeatCallback()(2);
    });
    beatDots = screen.getAllByTestId(/beat-dot-/i);
    expect(beatDots[1]).not.toHaveClass('metronome__beat-dot--active');
    expect(beatDots[2]).toHaveClass('metronome__beat-dot--active');

    // Beat 3
    act(() => {
      getOnBeatCallback()(3);
    });
    beatDots = screen.getAllByTestId(/beat-dot-/i);
    expect(beatDots[2]).not.toHaveClass('metronome__beat-dot--active');
    expect(beatDots[3]).toHaveClass('metronome__beat-dot--active');
  });
});
