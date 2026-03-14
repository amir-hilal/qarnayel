import type { HomeViewModel } from '@/features/home/view-models/home.view-model';

type HeroSectionProps = {
  heroTitle: string;
  heroSubtitle: string;
  ctaExplorePlaces: HomeViewModel['ctaExplorePlaces'];
  ctaDiscoverHistory: HomeViewModel['ctaDiscoverHistory'];
  heroImageAlt: string;
  heroImageUrl?: string;
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
  heroImageUrl,
}: HeroSectionProps): React.ReactElement {
  return (
    <section
      className="hero"
      aria-label={heroTitle}
      style={
        heroImageUrl ? { backgroundImage: `url(${heroImageUrl})` } : undefined
      }
    >
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__content">
        <h1 className="hero__title">{heroTitle}</h1>
        <p className="hero__subtitle">{heroSubtitle}</p>
        <div className="hero__ctas">
          <a href={ctaExplorePlaces.href} className="btn btn--primary">
            {ctaExplorePlaces.label}
          </a>
          <a href={ctaDiscoverHistory.href} className="btn btn--secondary">
            {ctaDiscoverHistory.label}
          </a>
        </div>
      </div>
      <span className="sr-only">{heroImageAlt}</span>
    </section>
  );
}
