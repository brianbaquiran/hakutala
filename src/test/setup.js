import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Audio API
class AudioContextMock {
  constructor() {
    this.state = 'suspended';
    this.currentTime = 0;
  }
  resume() {
    this.state = 'running';
    return Promise.resolve();
  }
  suspend() {
    this.state = 'suspended';
    return Promise.resolve();
  }
  createOscillator() {
    return {
      frequency: { value: 0 },
      start: vi.fn(),
      stop: vi.fn(),
      connect: vi.fn(),
    };
  }
  createGain() {
    return {
      gain: {
        value: 0,
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
  }
  get destination() {
    return {};
  }
}

vi.stubGlobal('AudioContext', AudioContextMock);
vi.stubGlobal('webkitAudioContext', AudioContextMock);
