/**
 * Чистая логика размера: работает и на сервере, и в клиенте.
 * Единый источник правды для UI и аудио-движка.
 */

export const MIN_BPM = 20;
export const MAX_BPM = 300;

export const UNIT_OPTIONS = [2, 4, 8, 16] as const;
export const BEATS_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 12] as const;

/** Подпись доли: 1/2, ♩, ♪, 1/16 — без экзотических глифов, чтобы не было «тофу». */
export const NOTE_LABEL: Record<number, string> = {
  2: '1/2',
  4: '♩',
  8: '♪',
  16: '1/16',
};

export function clampBpm(value: number): number {
  if (!Number.isFinite(value)) return MIN_BPM;
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)));
}

/** Сложный размер (6/8, 9/8, 12/8) — группами по три. */
export function supportsCompound(unit: number, beats: number): boolean {
  return unit === 8 && beats >= 6 && beats % 3 === 0;
}

export function isCompound(unit: number, beats: number, compound: boolean): boolean {
  return compound && supportsCompound(unit, beats);
}

/** Сколько «пульсов» (щелчков) в такте. */
export function pulsesPerBar(unit: number, beats: number, compound: boolean): number {
  return isCompound(unit, beats, compound) ? beats / 3 : beats;
}

/** Сколько звуковых делений внутри одного пульса. */
export function divisionsPerPulse(
  subdivisions: number,
  unit: number,
  beats: number,
  compound: boolean,
): number {
  return isCompound(unit, beats, compound) ? 3 : subdivisions;
}

/** Глиф той доли, которую отбивает пульс. */
export function pulseNote(unit: number, compound: boolean): string {
  return compound ? '♩.' : (NOTE_LABEL[unit] ?? '♩');
}

/**
 * Позиции акцентов среди долей такта (1-based).
 * В сложных размерах акцент падает на начало каждой группы из трёх.
 */
export function accentPositions(unit: number, beats: number, compound: boolean): number[] {
  if (isCompound(unit, beats, compound)) {
    const positions: number[] = [];
    for (let i = 0; i < beats; i += 3) positions.push(i + 1);
    return positions;
  }
  return [1];
}

export function patternLabel(unit: number, beats: number, compound: boolean): string {
  const positions = accentPositions(unit, beats, compound);
  return `Акцент: ${positions.join(', ')}`;
}
