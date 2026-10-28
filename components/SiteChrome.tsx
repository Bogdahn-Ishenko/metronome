'use client';

import { LANGUAGE_NAMES, LANGUAGES, type Language, type Theme } from '@/lib/i18n';
import { usePreferences } from '@/components/PreferencesProvider';
import Link from 'next/link';

export function SiteHeader() {
  const { language, theme, messages, setLanguage, setTheme } = usePreferences();
  const homeHref = language === 'ru' ? '/' : `/${language}/`;

  return (
    <header className="site">
      <Link className="site__mark" href={homeHref}>
        {messages.brand}
      </Link>
      <div className="site__actions">
        <span className="site__meta mono">{messages.headerMeta}</span>
        <label className="preference">
          <span className="preference__label">{messages.language}</span>
          <select
            className="preference__select"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
            aria-label={messages.language}
          >
            {LANGUAGES.map((value) => (
              <option key={value} value={value}>{LANGUAGE_NAMES[value]}</option>
            ))}
          </select>
        </label>
        <label className="preference">
          <span className="preference__label">{messages.theme}</span>
          <select
            className="preference__select"
            value={theme}
            onChange={(event) => setTheme(event.target.value as Theme)}
            aria-label={messages.theme}
          >
            {(['auto', 'dark', 'light'] as const).map((value) => (
              <option key={value} value={value}>{messages.themes[value]}</option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { messages } = usePreferences();
  return (
    <footer className="sitefoot">
      <span className="mono">{messages.footerTitle}</span>
      <span className="mono sitefoot__end">{messages.footerMeta}</span>
      <a
        className="github-link mono"
        href="https://github.com/Bogdahn-Ishenko/metronome"
        target="_blank"
        rel="noopener noreferrer"
      >
        {messages.githubLink}<span aria-hidden="true"> ↗</span>
      </a>
    </footer>
  );
}