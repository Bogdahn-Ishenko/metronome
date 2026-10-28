'use client';

import Metronome from '@/components/Metronome';
import RelatedPages from '@/components/RelatedPages';
import { usePreferences } from '@/components/PreferencesProvider';

export default function HomeLanding({ pageUrl = '/' }: { pageUrl?: string }) {
  const { language, messages } = usePreferences();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: messages.title,
        url: pageUrl,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any',
        browserRequirements: 'JavaScript with Web Audio API support',
        description: messages.lead,
        inLanguage: language,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: messages.features.map((feature) => feature.title),
      },
      {
        '@type': 'FAQPage',
        mainEntity: messages.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <main>
      <section className="hero">
        <h1 className="hero__title">{messages.title}</h1>
        <p className="hero__lead">{messages.lead}</p>
      </section>

      <Metronome settingsScope="main" />
      <RelatedPages />

      <section className="section-block" aria-labelledby="features-title">
        <h2 className="section-block__title" id="features-title">
          {messages.featuresTitle}
        </h2>
        <div className="features">
          {messages.features.map((feature) => (
            <article className="feature" key={feature.title}>
              <h3 className="feature__title">{feature.title}</h3>
              <p className="feature__text">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block" aria-labelledby="faq-title">
        <h2 className="section-block__title" id="faq-title">
          {messages.faqTitle}
        </h2>
        <div className="faq">
          {messages.faq.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary className="faq__q">{item.q}</summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
