'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { MetronomeEngine, type MetronomeSettings } from '@/lib/engine';
import { usePreferences } from '@/components/PreferencesProvider';
import {
  accentPositions,
  clampBpm,
  isCompound,
  supportsCompound,
} from '@/lib/meter';

const STORAGE_KEY = 'metronome.settings.v1';
const MUTE_STORAGE_KEY = 'metronome.muted.v1';
const STORAGE_EVENT = 'metronome:settings-changed';
const LEGACY_LOCALES = ['en', 'es', 'fr', 'de'] as const;
const UNIT_VALUES = [2, 4, 8, 16];

type UrlSettings = Partial<MetronomeSettings> & { muted?: boolean };

const DEFAULTS: MetronomeSettings = {
  bpm: 120,
  beats: 4,
  unit: 4,
  compound: false,
  subdivisions: 1,
  accent: true,
  volume: 0.7,
};

const EMPTY_INITIAL_SETTINGS: Partial<MetronomeSettings> = {};

const PRESETS = [
  { name: 'Largo', bpm: 50 },
  { name: 'Adagio', bpm: 66 },
  { name: 'Andante', bpm: 76 },
  { name: 'Moderato', bpm: 100 },
  { name: 'Allegro', bpm: 120 },
  { name: 'Presto', bpm: 168 },
  { name: 'Prestissimo', bpm: 200 },
];

const UNIT_LABELS: Record<number, string> = { 2: '1/2', 4: '♩', 8: '♪', 16: '1/16' };

/**
 * Настройки лежат в localStorage — это внешнее хранилище, а не состояние React.
 * Читаем его через useSyncExternalStore: во время гидрации React берёт
 * серверный снимок, поэтому разметка не расходится с серверным HTML.
 */
function subscribeSettings(onChange: () => void): () => void {
  window.addEventListener(STORAGE_EVENT, onChange);
  window.addEventListener('popstate', onChange);
  return () => {
    window.removeEventListener(STORAGE_EVENT, onChange);
    window.removeEventListener('popstate', onChange);
  };
}

function readPersisted(storageKey: string): string | null {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved !== null) return saved;

    const isPageScope = storageKey.startsWith(`${STORAGE_KEY}:/`);
    const legacyPath = storageKey === STORAGE_KEY
      ? '/'
      : isPageScope ? storageKey.slice(STORAGE_KEY.length + 1) : null;
    if (!legacyPath) return null;

    for (const locale of LEGACY_LOCALES) {
      const legacyKey = `${STORAGE_KEY}:/${locale}${legacyPath}`;
      const legacyValue = window.localStorage.getItem(legacyKey);
      if (legacyValue !== null) {
        window.localStorage.setItem(storageKey, legacyValue);
        return legacyValue;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function readServerSnapshot(): string | null {
  return null;
}

function parseUrlSettings(search: string, defaults: MetronomeSettings): UrlSettings {
  const params = new URLSearchParams(search);
  const parsed: UrlSettings = {};
  const bpm = Number.parseInt(params.get('bpm') ?? '', 10);
  const beats = Number.parseInt(params.get('beats') ?? '', 10);
  const unit = Number.parseInt(params.get('unit') ?? '', 10);
  const subdivisions = Number.parseInt(params.get('subdivisions') ?? '', 10);
  const volume = Number.parseInt(params.get('volume') ?? '', 10);
  const parseFlag = (value: string | null): boolean | undefined => {
    if (value === '1' || value === 'true') return true;
    if (value === '0' || value === 'false') return false;
    return undefined;
  };

  if (params.has('bpm') && Number.isFinite(bpm)) parsed.bpm = clampBpm(bpm);
  if (Number.isInteger(beats) && beats >= 2 && beats <= 12) parsed.beats = beats;
  if (UNIT_VALUES.includes(unit)) parsed.unit = unit;
  if (Number.isInteger(subdivisions) && subdivisions >= 1 && subdivisions <= 4) {
    parsed.subdivisions = subdivisions as MetronomeSettings['subdivisions'];
  }
  if (Number.isInteger(volume) && volume >= 0 && volume <= 100) parsed.volume = volume / 100;

  const resolvedBeats = parsed.beats ?? defaults.beats;
  const resolvedUnit = parsed.unit ?? defaults.unit;
  const compound = parseFlag(params.get('compound'));
  const accent = parseFlag(params.get('accent'));
  if (compound !== undefined) {
    parsed.compound = compound && supportsCompound(resolvedUnit, resolvedBeats);
  }
  if (accent !== undefined) parsed.accent = accent;
  const muted = parseFlag(params.get('mute'));
  if (muted !== undefined) parsed.muted = muted;
  return parsed;
}

function parseSettings(
  raw: string | null,
  defaults: MetronomeSettings,
): Partial<MetronomeSettings> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<MetronomeSettings>;
    const { bpm, volume, ...rest } = parsed;
    return {
      ...rest,
      bpm: clampBpm(Number(bpm ?? defaults.bpm)),
      volume: Math.min(1, Math.max(0, Number(volume ?? defaults.volume))),
    };
  } catch {
    return null;
  }
}

export default function Metronome({
  initialSettings = EMPTY_INITIAL_SETTINGS,
  settingsScope = 'main',
}: {
  initialSettings?: Partial<MetronomeSettings>;
  settingsScope?: string;
}) {
  const { messages } = usePreferences();
  const storageKey = settingsScope === 'main' ? STORAGE_KEY : `${STORAGE_KEY}:${settingsScope}`;
  const muteStorageKey = settingsScope === 'main'
    ? MUTE_STORAGE_KEY
    : `${MUTE_STORAGE_KEY}:${settingsScope}`;
  const defaults = useMemo(() => ({ ...DEFAULTS, ...initialSettings }), [initialSettings]);
  const getSettingsSnapshot = useCallback(() => readPersisted(storageKey), [storageKey]);
  const getUrlSnapshot = useCallback(() => window.location.search, []);
  const getMuteSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(muteStorageKey);
    } catch {
      return null;
    }
  }, [muteStorageKey]);
  const persistedRaw = useSyncExternalStore(
    subscribeSettings,
    getSettingsSnapshot,
    readServerSnapshot,
  );
  const urlSearch = useSyncExternalStore(subscribeSettings, getUrlSnapshot, readServerSnapshot);
  const mutedRaw = useSyncExternalStore(subscribeSettings, getMuteSnapshot, readServerSnapshot);
  const persisted = useMemo(() => parseSettings(persistedRaw, defaults), [persistedRaw, defaults]);
  const urlSettings = useMemo(
    () => parseUrlSettings(urlSearch ?? '', defaults),
    [urlSearch, defaults],
  );
  const [live, setLive] = useState<Partial<MetronomeSettings>>({});

  const settings = useMemo<MetronomeSettings>(
    () => ({ ...defaults, ...persisted, ...urlSettings, ...live }),
    [defaults, persisted, urlSettings, live],
  );

  const [running, setRunning] = useState(false);
  const muted = urlSettings.muted ?? mutedRaw === 'true';
  const [measure, setMeasure] = useState(1);
  const [tapHint, setTapHint] = useState('');
  const [draftBpm, setDraftBpm] = useState('');
  const [audioBlocked, setAudioBlocked] = useState(false);

  const engineRef = useRef<MetronomeEngine | null>(null);
  const armRef = useRef<HTMLDivElement | null>(null);
  const cellsRef = useRef<HTMLDivElement | null>(null);
  const instrumentRef = useRef<HTMLDivElement | null>(null);
  const tapsRef = useRef<number[]>([]);
  const flashTimerRef = useRef<number | null>(null);
  const activeCellRef = useRef(-1);
  const measureRef = useRef(1);
  const touchedRef = useRef(false);
  const settingsRef = useRef(settings);

  const compound = isCompound(settings.unit, settings.beats, settings.compound);
  const accents = useMemo(
    () => accentPositions(settings.unit, settings.beats, settings.compound),
    [settings.unit, settings.beats, settings.compound],
  );

  // Движок живёт вне React: ни одна кнопка не перерисовывает дерево.
  useEffect(() => {
    const engine = new MetronomeEngine(DEFAULTS);
    engineRef.current = engine;

    engine.onTick = (tick) => {
      const root = instrumentRef.current;
      // Точное время щелчка по аудиочасам — по нему проверяется точность темпа.
      if (root) root.dataset.audioTime = tick.time.toFixed(4);

      // Подсветка доли — прямым доступом к DOM, без ререндера React.
      const container = cellsRef.current;
      if (container) {
        const children = container.children;
        const previous = activeCellRef.current;
        if (previous >= 0 && previous < children.length) {
          children[previous].classList.remove('cell--on');
        }
        if (tick.cell >= 0 && tick.cell < children.length) {
          children[tick.cell].classList.add('cell--on');
        }
        activeCellRef.current = tick.cell;
      }

      // Счётчик такта меняется раз за такт — это единственный ререндер.
      if (tick.measure !== measureRef.current) {
        measureRef.current = tick.measure;
        setMeasure(tick.measure);
      }

      if (tick.accent === 'strong') {
        const node = instrumentRef.current;
        if (node) {
          node.classList.add('is-accent');
          if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current);
          flashTimerRef.current = window.setTimeout(() => {
            node.classList.remove('is-accent');
          }, 90);
        }
      }

      setAudioBlocked((blocked) => (blocked ? false : blocked));
    };

    engine.onFrame = (angle) => {
      const arm = armRef.current;
      if (arm) arm.style.transform = `rotate(${angle.toFixed(2)}deg)`;
    };

    return () => {
      if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Настройки → движок
  useEffect(() => {
    engineRef.current?.setSettings(settings);
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    engineRef.current?.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (!touchedRef.current) return;
    const url = new URL(window.location.href);
    url.searchParams.set('bpm', String(settings.bpm));
    url.searchParams.set('beats', String(settings.beats));
    url.searchParams.set('unit', String(settings.unit));
    url.searchParams.set('compound', settings.compound ? '1' : '0');
    url.searchParams.set('subdivisions', String(settings.subdivisions));
    url.searchParams.set('accent', settings.accent ? '1' : '0');
    url.searchParams.set('volume', String(Math.round(settings.volume * 100)));
    url.searchParams.set('mute', muted ? '1' : '0');
    const nextHref = `${url.pathname}${url.search}${url.hash}`;
    const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextHref !== currentHref) window.history.replaceState(window.history.state, '', nextHref);
  }, [muted, settings]);

  // Сохранение в localStorage — только после действия пользователя,
  // иначе первый рендер затёр бы сохранённые значения.
  useEffect(() => {
    if (!touchedRef.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(settings));
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }, [settings, storageKey]);

  // После перерисовки долей подсветку нужно вернуть на место.
  useEffect(() => {
    const container = cellsRef.current;
    if (!container) return;
    const children = container.children;
    const index = activeCellRef.current;
    if (index >= 0 && index < children.length) {
      children[index].classList.add('cell--on');
    }
  }, [settings.beats, settings.compound, accents]);

  const update = useCallback((patch: Partial<MetronomeSettings>) => {
    touchedRef.current = true;
    setLive((prev) => ({ ...prev, ...patch }));
  }, []);

  const setMuted = useCallback((value: boolean) => {
    touchedRef.current = true;
    const url = new URL(window.location.href);
    url.searchParams.set('mute', value ? '1' : '0');
    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${url.search}${url.hash}`,
    );
    window.dispatchEvent(new Event(STORAGE_EVENT));
    try {
      window.localStorage.setItem(muteStorageKey, String(value));
    } catch {
      // Muting still works for the current page if storage is unavailable.
    }
  }, [muteStorageKey]);

  const setBpm = useCallback(
    (value: number) => {
      update({ bpm: clampBpm(value) });
    },
    [update],
  );

  const toggle = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.unlock();
    if (engine.isRunning) {
      engine.stop();
      setRunning(false);
      setAudioBlocked(false);
    } else {
      engine.start();
      setRunning(true);
      window.setTimeout(() => {
        if (!engine.isAudioReady) setAudioBlocked(true);
      }, 600);
    }
  }, []);

  const tap = useCallback(() => {
    const engine = engineRef.current;
    engine?.unlock();

    const now = performance.now();
    const taps = tapsRef.current;
    if (taps.length && now - taps[taps.length - 1] > 2000) taps.length = 0;
    taps.push(now);
    if (taps.length > 6) taps.shift();

    if (taps.length < 2) {
      setTapHint(messages.tapAgain);
      return;
    }

    let total = 0;
    for (let i = 1; i < taps.length; i += 1) total += taps[i] - taps[i - 1];
    const bpm = clampBpm(60000 / (total / (taps.length - 1)));
    setBpm(bpm);
    setTapHint(`${bpm} BPM`);
  }, [messages.tapAgain, setBpm]);

  // Горячие клавиши
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (target?.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return;
      }
      if (tag === 'BUTTON') return;

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          toggle();
          break;
        case 'ArrowUp':
          event.preventDefault();
          setBpm(settings.bpm + (event.shiftKey ? 10 : 1));
          break;
        case 'ArrowDown':
          event.preventDefault();
          setBpm(settings.bpm - (event.shiftKey ? 10 : 1));
          break;
        case 'KeyT':
          event.preventDefault();
          tap();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [settings.bpm, setBpm, tap, toggle]);

  const commitBpm = useCallback(() => {
    const parsed = Number.parseInt(draftBpm, 10);
    if (Number.isFinite(parsed)) setBpm(parsed);
    setDraftBpm('');
  }, [draftBpm, setBpm]);

  const changeBeats = useCallback((delta: number) => {
    touchedRef.current = true;
    setLive((prev) => {
      const current = { ...settingsRef.current, ...prev };
      const beats = Math.min(12, Math.max(2, current.beats + delta));
      const compound = supportsCompound(current.unit, beats) ? current.compound : false;
      return { ...current, beats, compound };
    });
  }, []);

  const changeUnit = useCallback((delta: number) => {
    setLive((prev) => {
      const current = { ...settingsRef.current, ...prev };
      const options = [2, 4, 8, 16];
      const index = options.indexOf(current.unit);
      const nextIndex = Math.min(options.length - 1, Math.max(0, index + delta));
      const unit = options[nextIndex];
      const compound = supportsCompound(unit, current.beats) ? current.compound : false;
      return { ...current, unit, compound };
    });
    touchedRef.current = true;
  }, []);

  const note = compound ? '♩.' : UNIT_LABELS[settings.unit];

  return (
    <div className="instrument" ref={instrumentRef}>
      <div className="instrument__stage">
        <div className="stage__head">
          <div className="readout">
            <div className="readout__num mono">{settings.bpm}</div>
            <div className="readout__meta">
              <span className="readout__note" aria-hidden="true">{note}</span>
              <span className="readout__unit mono">{settings.bpm} BPM</span>
            </div>
          </div>
          <div className="measure">
            <span className="measure__label">{messages.bar}</span>
            <span className="measure__num mono">{String(measure).padStart(3, '0')}</span>
            <span className="measure__meter mono">
              {settings.beats} / {settings.unit}
            </span>
          </div>
        </div>

        <div className="cells" ref={cellsRef} role="img" aria-label={messages.beatCells(settings.beats, settings.unit)}>
          {Array.from({ length: settings.beats }, (_, index) => {
            const isAccent = accents.includes(index + 1);
            const classes = ['cell'];
            if (isAccent) classes.push('cell--accent');
            return <div key={index} className={classes.join(' ')} />;
          })}
        </div>

        <div className="pendulum" aria-hidden="true">
          <div className="pendulum__pivot" />
          <div className="pendulum__arm" ref={armRef}>
            <div className="pendulum__rod" />
            <div className="pendulum__weight" />
          </div>
          <div className="pendulum__base" />
        </div>

        <div className="stage__foot">
          <span className="mono">{messages.accentPattern(accents.join(', '))}</span>
          <span className="mono stage__foot--end">
            {running ? messages.running : messages.paused} · {settings.bpm} BPM
          </span>
        </div>

        {audioBlocked && (
          <p className="notice">
            {messages.audioBlocked}
          </p>
        )}
      </div>

      <div className="instrument__panel">
        <div className="section">
          <div className="label">{messages.start}</div>
          <div className="transport">
            <button
              type="button"
              className="btn btn--primary"
              onClick={toggle}
              aria-pressed={running}
            >
              <span className="btn__mark" aria-hidden="true" />
              {running ? messages.stop : messages.start}
            </button>
            <button type="button" className="btn btn--tap" onClick={tap}>
              {messages.tap}
              <span className="btn__note mono">{tapHint || '—'}</span>
            </button>
          </div>
        </div>

        <div className="section">
          <div className="label">{messages.tempo}</div>
          <div className="tempoRow">
            <button
              type="button"
              className="btn btn--step"
              onClick={() => setBpm(settings.bpm - 1)}
              aria-label={messages.slower}
            >
              −
            </button>
            <div className="tempoField">
              <input
                className="tempoField__input mono"
                type="text"
                inputMode="numeric"
                value={draftBpm || String(settings.bpm)}
                aria-label={`${messages.tempo}, BPM`}
                onChange={(event) => setDraftBpm(event.target.value.replace(/[^\d]/g, ''))}
                onBlur={commitBpm}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') event.currentTarget.blur();
                }}
              />
            </div>
            <button
              type="button"
              className="btn btn--step"
              onClick={() => setBpm(settings.bpm + 1)}
              aria-label={messages.faster}
            >
              +
            </button>
          </div>
          <input
            className="range"
            type="range"
            min={20}
            max={300}
            step={1}
            value={settings.bpm}
            aria-label={messages.tempo}
            onChange={(event) => setBpm(Number(event.target.value))}
          />
          <div className="scale mono" aria-hidden="true">
            <span>40</span>
            <span>100</span>
            <span>160</span>
            <span>220</span>
            <span>280</span>
          </div>
        </div>

        <div className="section">
          <div className="label">{messages.meter}</div>
          <div className="meterRow">
            <div className="stepper">
              <button type="button" className="btn btn--step" onClick={() => changeBeats(-1)} aria-label={messages.fewerBeats}>
                −
              </button>
              <span className="stepper__value mono">{settings.beats}</span>
              <button type="button" className="btn btn--step" onClick={() => changeBeats(1)} aria-label={messages.moreBeats}>
                +
              </button>
            </div>
            <span className="meterRow__slash">/</span>
            <div className="stepper">
              <button type="button" className="btn btn--step" onClick={() => changeUnit(-1)} aria-label={messages.shorterUnit}>
                −
              </button>
              <span className="stepper__value mono">{settings.unit}</span>
              <button type="button" className="btn btn--step" onClick={() => changeUnit(1)} aria-label={messages.longerUnit}>
                +
              </button>
            </div>
          </div>
          {supportsCompound(settings.unit, settings.beats) && (
            <button
              type="button"
              className="btn btn--toggle btn--wide"
              aria-pressed={settings.compound}
              onClick={() => update({ compound: !settings.compound })}
            >
              {messages.groupByThree}
            </button>
          )}
        </div>

        <div className="section">
          <div className="label">{messages.subdivisions}</div>
          <div className="seg" role="group" aria-label={messages.subdivisions}>
            {([1, 2, 3, 4] as const).map((value) => (
              <button
                key={value}
                type="button"
                className="seg__btn"
                aria-pressed={settings.subdivisions === value}
                onClick={() => update({ subdivisions: value })}
              >
                {value === 1 ? messages.noSubdivisions : value === 2 ? '½' : value === 3 ? '⅓' : '¼'}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="label">{messages.sound}</div>
          <input
            className="range"
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(settings.volume * 100)}
            aria-label={messages.volume}
            onChange={(event) => update({ volume: Number(event.target.value) / 100 })}
          />
          <div className="toggles">
            <button
              type="button"
              className="btn btn--toggle"
              aria-pressed={settings.accent}
              onClick={() => update({ accent: !settings.accent })}
            >
              {messages.accent}
            </button>
            <button
              type="button"
              className="btn btn--toggle"
              aria-pressed={muted}
              onClick={() => setMuted(!muted)}
            >
              {messages.mute}
            </button>
          </div>
        </div>

        <div className="section">
          <div className="label">{messages.tempos}</div>
          <div className="presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.bpm}
                type="button"
                className="preset"
                aria-pressed={settings.bpm === preset.bpm}
                onClick={() => setBpm(preset.bpm)}
              >
                {preset.name}
                <em className="mono">{preset.bpm}</em>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
