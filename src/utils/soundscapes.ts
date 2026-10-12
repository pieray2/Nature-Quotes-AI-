// Procedural Web Audio API Soundscape Generator
// Creates zero-dependency, rich nature ambiances directly in the browser

class NatureSoundEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;

  // Individual channels
  private channelGains: Record<string, GainNode> = {};
  private activeNodes: Array<{ stop?: () => void; disconnect: () => void }> = [];
  private birdTimer: number | null = null;
  private campfireTimer: number | null = null;

  // Volumes state: 0 to 1
  private volumes = {
    wind: 0.4,
    rain: 0.0,
    waves: 0.0,
    birds: 0.3,
    fire: 0.0,
    stream: 0.0,
  };

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate pink/white noise buffer
  private createNoiseBuffer(duration = 5): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  public async start() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.isRunning) return;

    this.isRunning = true;
    const noiseBuffer = this.createNoiseBuffer(6);

    // 1. Forest Wind Generator
    const windGain = this.ctx.createGain();
    windGain.gain.value = this.volumes.wind;
    windGain.connect(this.masterGain);
    this.channelGains.wind = windGain;

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(350, this.ctx.currentTime);

    // Subtle wind oscillation (LFO)
    const windOsc = this.ctx.createOscillator();
    const windOscGain = this.ctx.createGain();
    windOsc.frequency.setValueAtTime(0.15, this.ctx.currentTime); // slow swell
    windOscGain.gain.setValueAtTime(180, this.ctx.currentTime);
    windOsc.connect(windOscGain);
    windOscGain.connect(windFilter.frequency);
    windOsc.start();

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windSource.start();
    this.activeNodes.push(windSource, windFilter, windGain, windOsc, windOscGain);

    // 2. Ocean Waves Generator
    const wavesGain = this.ctx.createGain();
    wavesGain.gain.value = this.volumes.waves;
    wavesGain.connect(this.masterGain);
    this.channelGains.waves = wavesGain;

    const wavesSource = this.ctx.createBufferSource();
    wavesSource.buffer = noiseBuffer;
    wavesSource.loop = true;

    const wavesFilter = this.ctx.createBiquadFilter();
    wavesFilter.type = 'bandpass';
    wavesFilter.frequency.setValueAtTime(280, this.ctx.currentTime);
    wavesFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const waveLfo = this.ctx.createOscillator();
    const waveLfoGain = this.ctx.createGain();
    waveLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 12-second wave period
    waveLfoGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    const waveSwellGain = this.ctx.createGain();
    waveSwellGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    waveLfo.connect(waveLfoGain);
    waveLfoGain.connect(waveSwellGain.gain);
    waveLfo.start();

    wavesSource.connect(wavesFilter);
    wavesFilter.connect(waveSwellGain);
    waveSwellGain.connect(wavesGain);
    wavesSource.start();
    this.activeNodes.push(wavesSource, wavesFilter, wavesGain, waveLfo, waveLfoGain, waveSwellGain);

    // 3. Gentle Rain Generator
    const rainGain = this.ctx.createGain();
    rainGain.gain.value = this.volumes.rain;
    rainGain.connect(this.masterGain);
    this.channelGains.rain = rainGain;

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'highpass';
    rainFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainSource.start();
    this.activeNodes.push(rainSource, rainFilter, rainGain);

    // 4. Stream / Water Brook
    const streamGain = this.ctx.createGain();
    streamGain.gain.value = this.volumes.stream;
    streamGain.connect(this.masterGain);
    this.channelGains.stream = streamGain;

    const streamSource = this.ctx.createBufferSource();
    streamSource.buffer = noiseBuffer;
    streamSource.loop = true;

    const streamFilter = this.ctx.createBiquadFilter();
    streamFilter.type = 'bandpass';
    streamFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
    streamFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    streamSource.connect(streamFilter);
    streamFilter.connect(streamGain);
    streamSource.start();
    this.activeNodes.push(streamSource, streamFilter, streamGain);

    // 5. Procedural Birds
    const birdsGain = this.ctx.createGain();
    birdsGain.gain.value = this.volumes.birds;
    birdsGain.connect(this.masterGain);
    this.channelGains.birds = birdsGain;

    this.startBirdChirps(birdsGain);

    // 6. Campfire Crackle
    const fireGain = this.ctx.createGain();
    fireGain.gain.value = this.volumes.fire;
    fireGain.connect(this.masterGain);
    this.channelGains.fire = fireGain;

    this.startCampfire(fireGain);
  }

  private startBirdChirps(targetGain: GainNode) {
    const scheduleNext = () => {
      if (!this.isRunning || !this.ctx) return;
      const delay = 2500 + Math.random() * 5000;
      this.birdTimer = window.setTimeout(() => {
        this.playBirdNote(targetGain);
        scheduleNext();
      }, delay);
    };
    scheduleNext();
  }

  private playBirdNote(targetGain: GainNode) {
    if (!this.ctx || !this.isRunning || this.volumes.birds <= 0.05) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 2200 + Math.random() * 1400;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.18);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(targetGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  private startCampfire(targetGain: GainNode) {
    const schedulePop = () => {
      if (!this.isRunning || !this.ctx) return;
      const delay = 100 + Math.random() * 300;
      this.campfireTimer = window.setTimeout(() => {
        if (this.volumes.fire > 0.05 && this.ctx) {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(120 + Math.random() * 180, now);
          gain.gain.setValueAtTime(0.06 * Math.random(), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
          osc.connect(gain);
          gain.connect(targetGain);
          osc.start(now);
          osc.stop(now + 0.04);
        }
        schedulePop();
      }, delay);
    };
    schedulePop();
  }

  public setChannelVolume(channel: keyof typeof this.volumes, val: number) {
    this.volumes[channel] = Math.max(0, Math.min(1, val));
    const gainNode = this.channelGains[channel];
    if (gainNode && this.ctx) {
      gainNode.gain.setTargetAtTime(this.volumes[channel], this.ctx.currentTime, 0.1);
    }
  }

  public setMasterVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.1);
    }
  }

  public getVolumes() {
    return { ...this.volumes };
  }

  public getIsRunning() {
    return this.isRunning;
  }

  public stop() {
    this.isRunning = false;
    if (this.birdTimer) clearTimeout(this.birdTimer);
    if (this.campfireTimer) clearTimeout(this.campfireTimer);
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {
        // ignore disconnect errors on cleanup
      }
    });
    this.activeNodes = [];
    this.channelGains = {};
  }
}

export const soundEngine = new NatureSoundEngine();
