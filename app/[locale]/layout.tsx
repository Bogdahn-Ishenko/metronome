import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import DocumentShell from '@/components/DocumentShell';
import { INDEXABLE_LANGUAGES, type IndexableLanguage } from '@/lib/localeSeo';
import { SITE_URL } from '@/lib/siteUrl';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Metronome',
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#EFEDE7',
  width: 'device-width',
  initialScale: 1,
};

function isIndexableLanguage(value: string): value is IndexableLanguage {
  return INDEXABLE_LANGUAGES.includes(value as IndexableLanguage);
}

export default async function LocalizedRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isIndexableLanguage(locale)) notFound();
  return <DocumentShell language={locale}>{children}</DocumentShell>;
}
