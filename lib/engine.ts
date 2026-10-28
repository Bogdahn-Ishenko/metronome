import { divisionsPerPulse, isCompound, pulsesPerBar } from './meter';

/**
 * Движок метронома поверх Web Audio API.
 *
 * Ключевое решение по точности: щелчки планируются заранее по аудиочасам
 * (`AudioContext.currentTime`), а не по таймерам. setInterval даёт джиттер
 * в десятки миллисекунд, здесь расхождение не превышает единиц сэмпла.
 */

export type AccentKind = 'strong' | 'group' | 'normal' | 'sub';

export interface MetronomeSettings {
  bpm: number;
  beats: number;
  unit: number;
  compound: boolean;
  subdivisions: 1 | 2 | 3 | 4;
  accent: boolean;
  volume: number;
}

export interface TickInfo {
  /** Время щелчка на аудиочасах. */
  time: number;
  /** Индекс доли внутри такта (0-based, по доле размера). */
  cell: number;
  /** Индекс пульса внутри такта. */
  pulse: number;
  /** Номер такта, начиная с 1. */
  measure: number;
  accent: AccentKind;
  /** Длительность импульса до следующего пульса, секунды. */
  gap: number;
}

const CLICK_TABLE: Record<AccentKind, { freq: number; gain: number }> = {
  strong: { freq: 1568, gain: 1 },
  group: { freq: 1318.5, gain: 0.5 },
  normal: { freq: 1046.5, gain: 0.4 },
  sub: { freq: 784, gain: 0.13 },
};

/**
 * Таймер в Worker: фоновые вкладки Chrome душат обычные setInterval
 * до одной секунды, а метроном в фоне обязан продолжать играть ровно.
 */
const WORKER_SOURCE = `let id = null;
self.onmessage = (e) => {
  if (e.data === 'start') {
    if (id === null) id = setInterval(() => self.postMessage('tick'), 25);
  } else if (e.data === 'stop') {
    if (id !== null) { clearInterval(id); id = null; }
  }
};`;

export class MetronomeEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private worker: Worker | null = null;
  private fallbackTimer: number | null = null;
  private rafId = 0;
  private running = false;
  private muted = false;

  private nextNoteTime = 0;
  private lastScheduledTime = 0;
  private prevPulseTime: number | null = null;
  private lastPulseEvent: TickInfo | null = null;
  private pulseIndex = 0;
  private queue: TickInfo[] = [];

  private lastClickTime = 0;
  private lastSide = 1;
  private swingDeg = 30;

  private settings: MetronomeSettings;

  /** Событие доли: двигатель не знает про React. */
  onTick: ((tick: TickInfo) => void) | null = null;
  /** Кадр маятника: угол в градусах, вызывается каждый кадр анимации. */
  onFrame: ((angle: number) => void) | null = null;

  constructor(settings: MetronomeSettings) {
    this.settings = { ...settings };
  }

  get isRunning(): boolean {
    return this.running;
  }

  /** Текущее время аудиочасов: эталон для проверки точности темпа. */
  get audioTime(): number {
    return this.ctx?.currentTime ?? 0;
  }

  /** Готов ли аудиоконтекст к воспроизведению (не заблокирован автоплеем). */
  get isAudioReady(): boolean {
    return this.ctx?.state === 'running';
  }

  setSettings(next: Partial<MetronomeSettings>): void {
    const previous = this.settings;
    this.settings = { ...previous, ...next };

    if (this.master && next.volume !== undefined) {
      this.master.gain.value = this.muted ? 0 : this.settings.volume;
    }
    if (this.running && next.bpm !== undefined && next.bpm !== previous.bpm) {
      this.retime();
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master) {
      this.master.gain.value = muted ? 0 : this.settings.volume;
    }
  }

  /** Создаёт аудиоконтекст (нужен жест пользователя) и снимает автоплей-блокировку. */
  unlock(): void {
    this.ensureContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  start(): void {
    if (this.running) return;
    this.ensureContext();
    const ctx = this.ctx;
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume();

    this.running = true;
    this.pulseIndex = 0;
    this.queue = [];
    this.prevPulseTime = null;
    this.lastPulseEvent = null;
    this.lastScheduledTime = 0;
    this.nextNoteTime = ctx.currentTime + 0.12;

    this.startClock();
    this.loop();
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.stopClock();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    this.queue = [];
    this.onFrame?.(0);
  }

  dispose(): void {
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }

  private ensureContext(): void {
    if (this.ctx) return;
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = this.muted ? 0 : this.settings.volume;
    master.connect(ctx.destination);

    const noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.05), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }

    this.ctx = ctx;
    this.master = master;
    this.noiseBuffer = noise;
  }

  private pulseSeconds(): number {
    return 60 / this.settings.bpm;
  }

  /**
   * Смена темпа на ходу: щелчок, который уже запланирован, остаётся на месте,
   * меняется только интервал до следующего. Никаких «прыжков» в ритме.
   */
  private retime(): void {
    const gap = this.pulseSeconds();
    if (this.lastPulseEvent) this.lastPulseEvent.gap = gap;
    if (this.lastScheduledTime > 0) {
      this.nextNoteTime = this.lastScheduledTime + gap;
    }
  }

  private startClock(): void {
    if (typeof Worker !== 'undefined' && typeof Blob !== 'undefined') {
      try {
        const blob = new Blob([WORKER_SOURCE], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const worker = new Worker(url);
        URL.revokeObjectURL(url);
        worker.onmessage = () => this.pump();
        worker.onerror = () => {
          this.worker = null;
          this.startFallbackClock();
        };
        worker.postMessage('start');
        this.worker = worker;
        return;
      } catch {
        // blob-воркер недоступен (например, file://) — уходим на таймер
      }
    }
    this.startFallbackClock();
  }

  private startFallbackClock(): void {
    if (this.fallbackTimer !== null) return;
    this.fallbackTimer = window.setInterval(() => this.pump(), 25);
  }

  private stopClock(): void {
    if (this.worker) {
      this.worker.postMessage('stop');
      this.worker.terminate();
      this.worker = null;
    }
    if (this.fallbackTimer !== null) {
      window.clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  /**
   * Планирование щелчков с горизонтом ~300 мс вперёд.
   *
   * Важно: пока аудиоконтекст не в состоянии running, его currentTime стоит.
   * Если в такой момент двигать сетку, планировщик «догоняет» прошедшее время
   * и выдаёт пачку щелчков. Поэтому при остановленных часах сетка не трогается.
   */
  private pump(): void {
    const ctx = this.ctx;
    if (!ctx || !this.running) return;

    if (ctx.state !== 'running') {
      void ctx.resume().catch(() => undefined);
      return;
    }

    // Часы могли догнать после паузы: переносим сетку в настоящее.
    if (this.nextNoteTime < ctx.currentTime) {
      this.nextNoteTime = ctx.currentTime + 0.05;
      this.prevPulseTime = null;
    }

    const horizon = ctx.currentTime + 0.3;
    let guard = 0;
    while (this.nextNoteTime < horizon && guard < 64) {
      this.schedulePulse(this.nextNoteTime);
      guard += 1;
    }
  }

  private schedulePulse(time: number): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const { unit, beats, compound } = this.settings;
    const divisions = divisionsPerPulse(this.settings.subdivisions, unit, beats, compound);
    const perBar = pulsesPerBar(unit, beats, compound);
    const pulseInBar = this.pulseIndex % perBar;
    const compoundMeter = isCompound(unit, beats, compound);

    const duration =
      this.prevPulseTime === null ? this.pulseSeconds() : time - this.prevPulseTime;

    let accent: AccentKind = 'normal';
    if (pulseInBar === 0) accent = 'strong';
    else if (compoundMeter) accent = 'group';

    // Выключенный акцент превращает сильную долю в обычную.
    if (!this.settings.accent) accent = 'normal';

    const measure = Math.floor(this.pulseIndex / perBar) + 1;
    const gap = this.pulseSeconds();

    this.click(time, accent);

    const pulseEvent: TickInfo = {
      time,
      cell: compoundMeter ? pulseInBar * 3 : pulseInBar,
      pulse: pulseInBar,
      measure,
      accent,
      gap,
    };
    this.queue.push(pulseEvent);
    this.lastPulseEvent = pulseEvent;

    for (let k = 1; k < divisions; k += 1) {
      const subTime = time + (duration * k) / divisions;
      this.click(subTime, 'sub');
      this.queue.push({
        time: subTime,
        cell: compoundMeter ? pulseInBar * 3 + k : pulseInBar,
        pulse: pulseInBar,
        measure,
        accent: 'sub',
        gap,
      });
    }

    this.prevPulseTime = time;
    this.lastScheduledTime = time;
    this.pulseIndex += 1;
    this.nextNoteTime = time + gap;
  }

  private click(time: number, kind: AccentKind): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    const { freq, gain } = CLICK_TABLE[kind];

    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), time + 0.0015);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    osc.connect(env);
    env.connect(master);
    osc.start(time);
    osc.stop(time + 0.07);

    if (this.noiseBuffer) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const band = ctx.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.value = freq * 1.4;
      band.Q.value = 0.9;
      const noiseEnv = ctx.createGain();
      noiseEnv.gain.setValueAtTime(gain * 0.45, time);
      noiseEnv.gain.exponentialRampToValueAtTime(0.0001, time + 0.018);
      src.connect(band);
      band.connect(noiseEnv);
      noiseEnv.connect(master);
      src.start(time);
      src.stop(time + 0.03);
    }
  }

  /**
   * Кадр анимации: разбираем наступившие события и считаем угол маятника.
   * Угол выводится через transform — без layout thrashing.
   */
  private loop = (): void => {
    this.rafId = requestAnimationFrame(this.loop);
    const ctx = this.ctx;
    if (!ctx) return;

    const now = ctx.currentTime;
    let latest: TickInfo | null = null;
    while (this.queue.length && this.queue[0].time <= now + 0.005) {
      latest = this.queue.shift() ?? null;
    }

    if (latest) {
      if (latest.accent !== 'sub') {
        this.lastClickTime = latest.time;
        this.lastSide = -this.lastSide;
      }
      this.onTick?.(latest);
    }

    if (this.running && this.lastClickTime > 0) {
      const gap = Math.max(0.08, this.lastPulseEvent?.gap ?? this.pulseSeconds());
      const elapsed = Math.max(0, now - this.lastClickTime);
      const angle = this.lastSide * this.swingDeg * Math.cos((Math.PI * elapsed) / gap);
      this.onFrame?.(angle);
    }
  };
}
