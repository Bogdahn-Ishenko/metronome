'use client';

import Link from 'next/link';
import { usePreferences } from '@/components/PreferencesProvider';

export default function RelatedPages() {
  const { language, messages } = usePreferences();
  return (
    <nav className="related-pages" aria-label={messages.relatedTitle}>
      <h2 className="section-block__title">{messages.relatedTitle}</h2>
      <div className="related-pages__links">
        {messages.relatedPages.map((page) => (
          <Link
            className="related-pages__link"
            href={language === 'ru' ? page.href : `/${language}${page.href}`}
            key={page.href}
          >
            {page.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
