'use client';

import Metronome from '@/components/Metronome';
import RelatedPages from '@/components/RelatedPages';
import { usePreferences } from '@/components/PreferencesProvider';
import { PRACTICE_COPY, type PracticePageId } from '@/lib/practiceI18n';
import { PRACTICE_PAGES } from '@/lib/practicePages';
import type { PracticePage } from '@/lib/practicePages';

export default function PracticeLanding({
  page,
  pageId: providedPageId,
}: {
  page: PracticePage;
  pageId?: PracticePageId;
}) {
  const { language, messages } = usePreferences();
  const pageId = providedPageId ?? (Object.entries(PRACTICE_PAGES).find(([, candidate]) => candidate.path === page.path)?.[0]
    ?? '') as PracticePageId;
  const content = { ...page, ...PRACTICE_COPY[language]?.[pageId] };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: content.title,
        url: page.path,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any',
        description: content.description,
        inLanguage: language,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: content.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <main>
      <section className="hero">
        <h1 className="hero__title">{content.title}</h1>
        <p className="hero__lead">{content.intro}</p>
      </section>

      <Metronome
        key={pageId}
        initialSettings={page.initialSettings}
        settingsScope={PRACTICE_PAGES[pageId].path}
      />

      <section className="section-block" aria-label={content.title}>
        {content.sections.map((section) => (
          <article className="practice-section" key={section.title}>
            <h2 className="section-block__title">{section.title}</h2>
            <p className="feature__text">{section.text}</p>
          </article>
        ))}
      </section>

      <section className="section-block" aria-labelledby="faq-title">
        <h2 className="section-block__title" id="faq-title">{messages.faqTitle}</h2>
        <div className="faq">
          {content.faq.map((item) => (
            <details className="faq__item" key={item.question}>
              <summary className="faq__q">{item.question}</summary>
              <p className="faq__a">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <RelatedPages />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
