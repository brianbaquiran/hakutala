/**
 * MetronomeEngine handles the Web Audio API scheduling.
 * It uses a lookahead scheduler to ensure precise timing.
 */
export class MetronomeEngine {
  constructor() {
    this.audioContext = null;
    this.timerID = null;
    this.nextNoteTime = 0.0; // When the next note is due
    this.lookahead = 25.0; // How frequently to call scheduler (ms)
    this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (s)
    this.currentBeat = 0;
    
    // Configurable parameters (could be passed from store)
    this.bpm = 120;
    this.beatsPerMeasure = 4;
    this.volume = 0.8;
    this.beatValue = 4;
    
    // Callback for UI updates (e.g., visual beat indicator)
    this.onBeat = null;
  }

  /**
   * Initializes the AudioContext if it hasn't been created yet.
   * Browsers require a user gesture to start/resume AudioContext.
   */
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  /**
   * Starts the metronome scheduler.
   */
  start(bpm, beatsPerMeasure, beatValue, volume, onBeat) {
    this.init();
    
    // Resume context in case it was suspended (browser policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.bpm = bpm;
    this.beatsPerMeasure = beatsPerMeasure;
    this.beatValue = beatValue;
    this.volume = volume;
    this.onBeat = onBeat;

    this.currentBeat = 0;
    this.nextNoteTime = this.audioContext.currentTime + 0.05;
    this.scheduler();
  }

  /**
   * Stops the metronome scheduler.
   */
  stop() {
    clearTimeout(this.timerID);
  }

  /**
   * Main scheduler loop.
   */
  scheduler() {
    // While there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      this.nextNote();
    }
    this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
  }

  /**
   * Schedules a single beat.
   * @param {number} beatNumber - The current beat index in the measure.
   * @param {number} time - The precise Web Audio time to play the beat.
   */
  scheduleNote(beatNumber, time) {
    // Trigger onBeat callback for visual feedback
    if (this.onBeat) {
      // Direct call to onBeat for immediate visual feedback.
      // This bypasses any potential timing issues with setTimeout,
      // which might be problematic in throttled environments or at zero gain.
      this.onBeat(beatNumber);
    }

    // Web Audio: GainNode.exponentialRampToValueAtTime requires strictly
    // positive values; at volume 0 the envelope math throws and the scheduler
    // dies while the UI still shows "running". Skip audio; beats stay silent.
    if (this.volume <= 0) {
      return;
    }

    const osc = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    // Distinguish the downbeat (accent) from regular beats
    const isDownbeat = beatNumber === 0;
    osc.frequency.value = isDownbeat ? 1000 : 800;

    envelope.gain.value = this.volume;
    // Fast attack and decay for a "click" sound
    envelope.gain.exponentialRampToValueAtTime(this.volume, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc.connect(envelope);
    envelope.connect(this.audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  }

  /**
   * Advances the internal beat counter and calculates the next note time.
   */
  nextNote() {
    // Corrected calculation for seconds per beat based on beatValue
    const secondsPerBeat = (60.0 / this.bpm) * (4 / this.beatValue);
    this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    // Advance beat, wrap around measure
    this.currentBeat = (this.currentBeat + 1) % this.beatsPerMeasure;
  }

  /**
   * Updates parameters while the metronome is running.
   */
  updateParams(bpm, beatsPerMeasure, beatValue, volume, onBeat) {
    this.bpm = bpm;
    this.beatsPerMeasure = beatsPerMeasure;
    this.beatValue = beatValue;
    this.volume = volume;
    if (onBeat) { // Only update if a new onBeat is provided
      this.onBeat = onBeat;
    }
  }
}

export const metronomeEngine = new MetronomeEngine();
