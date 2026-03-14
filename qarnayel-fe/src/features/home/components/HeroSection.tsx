import type { HomeViewModel } from '@/features/home/view-models/home.view-model';

type HeroSectionProps = {
  heroTitle: string;
  heroSubtitle: string;
  ctaExplorePlaces: HomeViewModel['ctaExplorePlaces'];
  ctaDiscoverHistory: HomeViewModel['ctaDiscoverHistory'];
  heroImageAlt: string;
};

// ---------------------------------------------------------------------------
// HeroSection — the full-bleed hero on the homepage with the two main CTAs
// ---------------------------------------------------------------------------
export function HeroSection({
  heroTitle,
  heroSubtitle,
  ctaExplorePlaces,
  ctaDiscoverHistory,
  heroImageAlt,
}: HeroSectionProps): React.ReactElement {
  return (
    <section className="hero-section" aria-label={heroTitle}>
      {/* Background image is set via CSS on .hero-section */}
      <div className="hero-section__overlay" aria-hidden="true" />
      <div className="hero-section__content">
        <h1 className="hero-section__title">{heroTitle}</h1>
        <p className="hero-section__subtitle">{heroSubtitle}</p>
        <div className="hero-section__ctas">
          <a href={ctaExplorePlaces.href} className="btn btn--primary">
            {ctaExplorePlaces.label}
          </a>
          <a href={ctaDiscoverHistory.href} className="btn btn--secondary">
            {ctaDiscoverHistory.label}
          </a>
        </div>
      </div>
      {/* Visually hidden text for the background image alt */}
      <span className="sr-only">{heroImageAlt}</span>
    </section>
  );
}
