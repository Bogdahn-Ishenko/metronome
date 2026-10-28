import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteUrl';
import { INDEXABLE_LANGUAGES, localizedPath } from '@/lib/localeSeo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const defaultPaths = [
    '/',
    '/metronome-for-guitar/',
    '/6-8-metronome/',
    '/tap-tempo/',
  ];
  const localizedPaths = INDEXABLE_LANGUAGES.flatMap((language) =>
    defaultPaths.map((path) => localizedPath(language, path)),
  );
  const paths = [...defaultPaths, ...localizedPaths];

  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
