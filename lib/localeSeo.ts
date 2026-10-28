import type { Language } from '@/lib/i18n';
import { SITE_URL } from '@/lib/siteUrl';

export const INDEXABLE_LANGUAGES = ['en', 'es', 'fr', 'de'] as const satisfies readonly Language[];
export type IndexableLanguage = (typeof INDEXABLE_LANGUAGES)[number];

export function localizedPath(language: IndexableLanguage, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath === '/' ? `/${language}/` : `/${language}${normalizedPath}`;
}

export function languageAlternates(defaultPath: string): Record<string, string> {
  const normalizedPath = defaultPath.startsWith('/') ? defaultPath : `/${defaultPath}`;
  const defaultUrl = `${SITE_URL}${normalizedPath}`;
  return {
    ru: defaultUrl,
    ...Object.fromEntries(
      INDEXABLE_LANGUAGES.map((language) => [
        language,
        `${SITE_URL}${localizedPath(language, normalizedPath)}`,
      ]),
    ),
    'x-default': defaultUrl,
  };
}

export function localeOpenGraph(locale: IndexableLanguage): string {
  return { en: 'en_US', es: 'es_ES', fr: 'fr_FR', de: 'de_DE' }[locale];
}
