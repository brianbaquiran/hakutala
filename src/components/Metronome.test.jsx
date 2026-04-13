import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Metronome } from './Metronome';
import { useMetronomeStore } from '../store/useMetronomeStore';

describe('Metronome', () => {
  beforeEach(() => {
    useMetronomeStore.setState({ 
      bpm: 120, 
      isRunning: false,
      timeSignature: { beatsPerMeasure: 4, beatValue: 4 }
    });
  });

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
});
