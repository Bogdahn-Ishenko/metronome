/**
 * Проверка аудио-движка без браузера: настоящий MetronomeEngine работает
 * поверх заглушки Web Audio API, а тест сверяет сетку щелчков с тактом.
 *
 * Запуск: npm run verify:engine
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { MetronomeEngine, type MetronomeSettings } from '../lib/engine';

interface RecordedTick {
  time: number;
  cell: number;
  pulse: number;
  measure: number;
  accent: string;
}

class FakeParam {
  value = 0;
  setValueAtTime() {}
  exponentialRampToValueAtTime() {}
  linearRampToValueAtTime() {}
}

class FakeNode {
  connect() {
    return this;
  }
  disconnect() {}
}

class FakeAudioContext {
  static startedAt = Date.now();
  state: AudioContextState = 'running';
  sampleRate = 48000;
  destination = new FakeNode();

  constructor() {
    FakeAudioContext.startedAt = Date.now();
  }

  get currentTime(): number {
    return (Date.now() - FakeAudioContext.startedAt) / 1000;
  }

  createGain() {
    const node = new FakeNode() as any;
    node.gain = new FakeParam();
    return node;
  }

  createOscillator() {
    const node = new FakeNode() as any;
    node.type = 'sine';
    node.frequency = new FakeParam();
    node.start = () => {};
    node.stop = () => {};
    return node;
  }

  createBiquadFilter() {
    const node = new FakeNode() as any;
    node.frequency = new FakeParam();
    node.Q = new FakeParam();
    return node;
  }

  createBufferSource() {
    const node = new FakeNode() as any;
    node.buffer = null;
    node.start = () => {};
    node.stop = () => {};
    return node;
  }

  createBuffer(_channels: number, length: number) {
    return { getChannelData: () => new Float32Array(length) };
  }

  resume() {
    this.state = 'running';
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }
}

(globalThis as any).window = {
  AudioContext: FakeAudioContext,
  setInterval: (fn: () => void, ms: number) => setInterval(fn, ms),
  clearInterval: (id: any) => clearInterval(id),
  setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
  clearTimeout: (id: any) => clearTimeout(id),
};
(globalThis as any).requestAnimationFrame = (cb: (t: number) => void) =>
  setTimeout(() => cb(Date.now()), 16);
(globalThis as any).cancelAnimationFrame = (id: any) => clearTimeout(id);

let failures = 0;

function check(label: string, condition: boolean, detail = ''): void {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function closeTo(actual: number, expected: number, tolerance: number): boolean {
  return Math.abs(actual - expected) <= tolerance;
}

function countPulses(ticks: RecordedTick[]): number {
  return ticks.filter((tick) => tick.accent !== 'sub').length;
}

async function collect(settings: MetronomeSettings, durationMs: number): Promise<RecordedTick[]> {
  const engine = new MetronomeEngine(settings);
  const ticks: RecordedTick[] = [];
  engine.onTick = (tick) => {
    ticks.push({
      time: tick.time,
      cell: tick.cell,
      pulse: tick.pulse,
      measure: tick.measure,
      accent: tick.accent,
    });
  };
  engine.start();
  await new Promise((resolve) => setTimeout(resolve, durationMs));
  engine.stop();
  engine.dispose();
  return ticks;
}

async function main(): Promise<void> {
  console.log('\n4/4, 120 BPM — базовая сетка');
  {
    const ticks = await collect(
      { bpm: 120, beats: 4, unit: 4, compound: false, subdivisions: 1, accent: true, volume: 0.7 },
      2400,
    );

    const pulses = ticks.filter((tick) => tick.accent !== 'sub');
    check('щелчков не меньше 4 за 2.4 с', pulses.length >= 4, `получено ${pulses.length}`);
    check(
      'интервал между пульсами 0.5 с (±5 мс)',
      pulses.slice(1).every((tick, index) => closeTo(tick.time - pulses[index].time, 0.5, 0.005)),
    );
    check(
      'акцент на первой доле такта',
      pulses.every((tick, index) => (tick.accent === 'strong') === (index % 4 === 0)),
    );
    check('доли такта идут 0,1,2,3', pulses.slice(0, 4).every((tick, index) => tick.cell === index));
    check('счётчик такта растёт', pulses[pulses.length - 1].measure > pulses[0].measure);
  }

  console.log('\n4/4, 120 BPM — дробление на 1/2');
  {
    const ticks = await collect(
      { bpm: 120, beats: 4, unit: 4, compound: false, subdivisions: 2, accent: true, volume: 0.7 },
      2400,
    );

    const subs = ticks.filter((tick) => tick.accent === 'sub');
    check(
      'по одному дробному щелчку на пульс',
      subs.length >= countPulses(ticks),
      `получено ${subs.length}`,
    );
    const firstPulse = ticks.find((tick) => tick.accent !== 'sub')!;
    check(
      'дробный щелчок ровно в середине доли (±5 мс)',
      closeTo(subs[0].time - firstPulse.time, 0.25, 0.005),
    );
  }

  console.log('\n6/8 с группировкой по три — сложный размер');
  {
    const ticks = await collect(
      { bpm: 120, beats: 6, unit: 8, compound: true, subdivisions: 1, accent: true, volume: 0.7 },
      2600,
    );

    const groups = ticks.filter((tick) => tick.accent === 'strong' || tick.accent === 'group');

    check('два пульса-группы в такте', groups.length >= 2, `получено ${groups.length}`);
    check(
      'пульс идёт по пунктирной четверти (0.5 с при 120 BPM)',
      groups.slice(1).every((tick, index) => closeTo(tick.time - groups[index].time, 0.5, 0.005)),
    );
    check(
      'акценты: сильный на первой группе, средний на второй',
      groups[0].accent === 'strong' && groups[1].accent === 'group',
      `${groups[0].accent}/${groups[1].accent}`,
    );
    check(
      'доли такта идут 0..5',
      ticks.slice(0, 6).map((tick) => tick.cell).join('') === '012345',
      ticks.slice(0, 6).map((tick) => tick.cell).join(''),
    );

    // Внутри группы две восьмые: ровно на 1/6 и 2/6 от начала группы.
    const groupIndexes = ticks
      .map((tick, index) => (tick.accent === 'strong' || tick.accent === 'group' ? index : -1))
      .filter((index) => index >= 0);

    let eighthsOk = true;
    let countOk = true;
    for (const groupIndex of groupIndexes) {
      const subs: RecordedTick[] = [];
      for (let k = groupIndex + 1; k < ticks.length && ticks[k].accent === 'sub'; k += 1) {
        subs.push(ticks[k]);
      }
      if (subs.length !== 2) countOk = false;
      if (!subs[0] || !closeTo(subs[0].time - ticks[groupIndex].time, 1 / 6, 0.005)) eighthsOk = false;
      if (!subs[1] || !closeTo(subs[1].time - ticks[groupIndex].time, 2 / 6, 0.005)) eighthsOk = false;
    }
    check('внутри группы ровно две восьмые', countOk);
    check('восьмые стоят через 1/6 и 2/6 от начала группы (±5 мс)', eighthsOk);
  }

  console.log('\n6/8 без группировки — пульс по восьмой');
  {
    const ticks = await collect(
      { bpm: 120, beats: 6, unit: 8, compound: false, subdivisions: 1, accent: true, volume: 0.7 },
      3600,
    );

    const groups = ticks.filter((tick) => tick.accent !== 'sub');
    // BPM — это щелчки в минуту: пульс всегда идёт со скоростью 60/BPM.
    check('шесть пульсов на такт', groups.length >= 6, `получено ${groups.length}`);
    check(
      'интервал 0.5 с (120 щелчков в минуту)',
      groups.slice(1).every((tick, index) => closeTo(tick.time - groups[index].time, 0.5, 0.005)),
    );
    check(
      'сильный акцент раз в шесть пульсов',
      groups.every((tick, index) => (tick.accent === 'strong') === (index % 6 === 0)),
    );
  }

  console.log('\nАкцент выключен');
  {
    const ticks = await collect(
      { bpm: 120, beats: 4, unit: 4, compound: false, subdivisions: 1, accent: false, volume: 0.7 },
      2400,
    );
    check('сильных акцентов нет', ticks.every((tick) => tick.accent !== 'strong'));
  }

  if (failures > 0) {
    console.log(`\nПровалено проверок: ${failures}\n`);
    process.exit(1);
  }

  console.log('\nВсе проверки пройдены.\n');
  process.exit(0);
}

void main();
