import type { PageContent } from '@/features/pages/types';

type AboutSectionProps = {
  page: PageContent;
  locale: string;
};

// ---------------------------------------------------------------------------
// AboutSection — renders PageContent for the about page
// ---------------------------------------------------------------------------
export function AboutSection({ page, locale }: AboutSectionProps): React.ReactElement {
  const l = locale as 'ar' | 'en';
  const title = page.title[l] ?? page.title.ar;
  const body = page.body[l] ?? page.body.ar;

  return (
    <article className="about-section">
      <header className="about-section__header">
        <h1 className="about-section__title">{title}</h1>
      </header>
      <div className="about-section__body">
        {body.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
