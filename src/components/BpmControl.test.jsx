import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BpmControl } from './BpmControl';
import { useMetronomeStore } from '../store/useMetronomeStore';

describe('BpmControl', () => {
  beforeEach(() => {
    useMetronomeStore.setState({ bpm: 120 });
  });

  it('renders current BPM', () => {
    render(<BpmControl />);
    const input = screen.getByLabelText(/bpm/i);
    expect(input.value).toBe('120');
  });

  it('increments BPM when + button is clicked', () => {
    render(<BpmControl />);
    const incrementBtn = screen.getByText('+');
    fireEvent.click(incrementBtn);
    expect(useMetronomeStore.getState().bpm).toBe(121);
  });

  it('decrements BPM when - button is clicked', () => {
    render(<BpmControl />);
    const decrementBtn = screen.getByText('-');
    fireEvent.click(decrementBtn);
    expect(useMetronomeStore.getState().bpm).toBe(119);
  });

  it('updates BPM when input changes', () => {
    render(<BpmControl />);
    const input = screen.getByLabelText(/bpm/i);
    fireEvent.change(input, { target: { value: '140' } });
    expect(useMetronomeStore.getState().bpm).toBe(140);
  });
});
