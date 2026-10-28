import type { Metadata, Viewport } from 'next';
import DocumentShell from '@/components/DocumentShell';
import { languageAlternates } from '@/lib/localeSeo';
import { SITE_URL } from '@/lib/siteUrl';
import '../globals.css';

const title = 'Онлайн-метроном — точный темп, размер и дробление';
const description =
  'Точный онлайн-метроном в браузере: Web Audio без задержек, tap tempo, размеры от 2/4 до 12/8, акценты и дробление. Без установки и регистрации.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: '%s — Онлайн-метроном',
  },
  description,
  applicationName: 'Онлайн-метроном',
  keywords: [
    'онлайн метроном',
    'метроном онлайн',
    'metronome online',
    'tap tempo',
    'метроном 6/8',
    'метроном 4/4',
    'метроном для гитары',
    'веб-метроном',
    'метроном с дроблением',
    'без установки метроном',
  ],
  authors: [{ name: 'Metronome' }],
  alternates: { canonical: '/', languages: languageAlternates('/') },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'Онлайн-метроном',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'music',
};

export const viewport: Viewport = {
  themeColor: '#EFEDE7',
  width: 'device-width',
  initialScale: 1,
};

export default function RussianRootLayout({ children }: { children: React.ReactNode }) {
  return <DocumentShell language="ru">{children}</DocumentShell>;
}
