import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomeLanding from '@/components/HomeLanding';
import { MESSAGES } from '@/lib/i18n';
import { INDEXABLE_LANGUAGES, languageAlternates, localeOpenGraph, type IndexableLanguage } from '@/lib/localeSeo';

export const dynamicParams = false;

function isIndexableLanguage(value: string): value is IndexableLanguage {
  return INDEXABLE_LANGUAGES.includes(value as IndexableLanguage);
}

export function generateStaticParams() {
  return INDEXABLE_LANGUAGES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isIndexableLanguage(locale)) notFound();
  const messages = MESSAGES[locale];
  const url = `/${locale}/`;

  return {
    title: { absolute: messages.documentTitle },
    description: messages.lead,
    alternates: { canonical: url, languages: languageAlternates('/') },
    openGraph: {
      type: 'website',
      locale: localeOpenGraph(locale),
      url,
      siteName: messages.brand,
      title: messages.documentTitle,
      description: messages.lead,
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.documentTitle,
      description: messages.lead,
    },
  };
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isIndexableLanguage(locale)) notFound();
  return <HomeLanding pageUrl={`/${locale}/`} />;
}
