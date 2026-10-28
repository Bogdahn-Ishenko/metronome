import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PracticeLanding from '@/components/PracticeLanding';
import { PRACTICE_COPY, type PracticePageId } from '@/lib/practiceI18n';
import { MESSAGES } from '@/lib/i18n';
import { INDEXABLE_LANGUAGES, languageAlternates, localeOpenGraph, type IndexableLanguage } from '@/lib/localeSeo';
import { PRACTICE_PAGES, type PracticePage } from '@/lib/practicePages';

export const dynamicParams = false;

const PRACTICE_ENTRIES = Object.entries(PRACTICE_PAGES) as [PracticePageId, PracticePage][];

function isIndexableLanguage(value: string): value is IndexableLanguage {
  return INDEXABLE_LANGUAGES.includes(value as IndexableLanguage);
}

function findPage(slug: string): [PracticePageId, PracticePage] | undefined {
  return PRACTICE_ENTRIES.find(([, page]) => page.path.split('/').filter(Boolean).at(-1) === slug);
}

function getPageContent(locale: IndexableLanguage, entry: [PracticePageId, PracticePage]) {
  const [id, page] = entry;
  return { ...page, ...PRACTICE_COPY[locale]?.[id] };
}

export function generateStaticParams() {
  const slugs = PRACTICE_ENTRIES.map(([, page]) => page.path.split('/').filter(Boolean).at(-1)!);
  return INDEXABLE_LANGUAGES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isIndexableLanguage(locale)) notFound();
  const entry = findPage(slug);
  if (!entry) notFound();
  const page = getPageContent(locale, entry);
  const url = `/${locale}/${slug}/`;
  const defaultPath = entry[1].path;

  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url, languages: languageAlternates(defaultPath) },
    openGraph: {
      type: 'website',
      locale: localeOpenGraph(locale),
      url,
      siteName: MESSAGES[locale].brand,
      title: page.title,
      description: page.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
    },
  };
}

export default async function LocalizedPracticePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isIndexableLanguage(locale)) notFound();
  const entry = findPage(slug);
  if (!entry) notFound();
  const page = getPageContent(locale, entry);
  page.path = `/${locale}/${slug}/`;
  return <PracticeLanding pageId={entry[0]} page={page} />;
}
