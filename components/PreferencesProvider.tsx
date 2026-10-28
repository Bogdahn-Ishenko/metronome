'use client';

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LANGUAGES, MESSAGES, type Language, type Messages, type Theme } from '@/lib/i18n';
import { PRACTICE_COPY, type PracticePageId } from '@/lib/practiceI18n';
import { PRACTICE_PAGES } from '@/lib/practicePages';
import { INDEXABLE_LANGUAGES, localizedPath, type IndexableLanguage } from '@/lib/localeSeo';

const STORAGE_KEY = 'metronome.preferences.v1';
const CHANGE_EVENT = 'metronome:preferences-changed';
const DEFAULT_PREFERENCES = { language: 'ru' as Language, theme: 'auto' as Theme };

interface Preferences {
  language: Language;
  theme: Theme;
}

interface PreferencesContextValue extends Preferences {
  messages: Messages;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): null {
  return null;
}

function parsePreferences(raw: string | null): Preferences {
  if (!raw) return DEFAULT_PREFERENCES;
  try {
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      language: LANGUAGES.includes(parsed.language as Language)
        ? (parsed.language as Language)
        : DEFAULT_PREFERENCES.language,
      theme: parsed.theme === 'dark' || parsed.theme === 'light' || parsed.theme === 'auto'
        ? parsed.theme
        : DEFAULT_PREFERENCES.theme,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(preferences: Preferences): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Preferences still apply for this render if storage is unavailable.
  }
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const preferences = parsePreferences(raw);
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split('/').filter(Boolean);
  const routeLocale = INDEXABLE_LANGUAGES.find((locale) => locale === pathSegments[0]);
  const language = routeLocale ?? 'ru';
  const localizedContentPath = routeLocale
    ? pathSegments.length > 1 ? `/${pathSegments.slice(1).join('/')}/` : '/'
    : pathname.endsWith('/') ? pathname : `${pathname}/`;
  const normalizedPathname = localizedContentPath.replace(/\/$/, '');
  const messages = MESSAGES[language];
  const currentPage = Object.entries(PRACTICE_PAGES).find(
    ([, page]) => page.path.replace(/\/$/, '') === normalizedPathname,
  );
  const pageId = currentPage?.[0] as PracticePageId | undefined;
  const translatedPage = pageId
    ? PRACTICE_COPY[language]?.[pageId]
    : undefined;
  const documentTitle = currentPage
    ? `${translatedPage?.title ?? currentPage[1].title} — ${messages.brand}`
    : messages.documentTitle;
  const documentDescription = currentPage
    ? translatedPage?.description ?? currentPage[1].description
    : messages.lead;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = preferences.theme;
    const syncMetadata = () => {
      if (document.title !== documentTitle) document.title = documentTitle;
      document.querySelectorAll('meta[name="description"]').forEach((meta) => {
        if (meta.getAttribute('content') !== documentDescription) {
          meta.setAttribute('content', documentDescription);
        }
      });
      document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((meta) => {
        if (meta.getAttribute('content') !== documentTitle) {
          meta.setAttribute('content', documentTitle);
        }
      });
      document.querySelectorAll('meta[property="og:description"], meta[name="twitter:description"]').forEach((meta) => {
        if (meta.getAttribute('content') !== documentDescription) {
          meta.setAttribute('content', documentDescription);
        }
      });
    };

    let frame = 0;
    const observer = new MutationObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncMetadata);
    });
    observer.observe(document.head, {
      attributes: true,
      attributeFilter: ['content'],
      childList: true,
      subtree: true,
    });
    syncMetadata();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [documentDescription, documentTitle, language, preferences.theme]);

  const setLanguage = (nextLanguage: Language) => {
    savePreferences({ ...preferences, language: nextLanguage });
    const targetPath = nextLanguage === 'ru'
      ? localizedContentPath
      : localizedPath(nextLanguage as IndexableLanguage, localizedContentPath);
    const target = `${targetPath}${window.location.search}${window.location.hash}`;
    if (targetPath !== pathname) router.push(target);
  };
  const setTheme = (theme: Theme) => savePreferences({ ...preferences, theme });

  return (
    <PreferencesContext.Provider
      value={{ ...preferences, messages, setLanguage, setTheme }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error('usePreferences must be used within PreferencesProvider');
  return value;
}