import './HeroSection.css';
import type { HomeViewModel } from '@/features/home/view-models/home.view-model';

type HeroSectionProps = {
  heroTitle: string;
  heroSubtitle: string;
  ctas: HomeViewModel['ctas'];
  heroImageAlt: string;
  heroImageUrl?: string;
};

// ---------------------------------------------------------------------------
// HeroSection — the full-bleed hero on the homepage with the two main CTAs
// ---------------------------------------------------------------------------
export function HeroSection({
  heroTitle,
  heroSubtitle,
  ctas,
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
          {ctas.map((cta, i) => (
            <a
              key={cta.href}
              href={cta.href}
              className={i === 0 ? 'btn btn--primary' : 'btn btn--secondary'}
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>
      <span className="sr-only">{heroImageAlt}</span>
    </section>
  );
}
