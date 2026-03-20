'use client';

import type { FeaturedPlaceViewModel } from '@/features/home/view-models/home.view-model';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import './FeaturedPlaces.css';

type FeaturedPlacesProps = {
  title: string;
  places: FeaturedPlaceViewModel[];
  exploreMoreLabel: string;
  explorePlacesHref: string;
};

// ---------------------------------------------------------------------------
// FeaturedPlaces — scroll-driven timeline of featured place cards
// The vertical line grows as the user scrolls through the section.
// Each card fades+slides in when it enters the viewport.
// Line is at inline-start (left in LTR, right in RTL).
// ---------------------------------------------------------------------------
export function FeaturedPlaces({
  title,
  places,
  exploreMoreLabel,
  explorePlacesHref,
}: FeaturedPlacesProps): React.ReactElement {
  if (places.length === 0) return <></>;

  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    // Enable CSS animation classes (progressive enhancement — items are
    // fully visible without JS, animations only activate client-side).
    section.setAttribute('data-animate', 'true');

    // Grow the line in sync with scroll progress through the section.
    function updateLine() {
      const rect = section!.getBoundingClientRect();
      const vh = window.innerHeight;
      // starts growing when section top crosses the bottom of viewport,
      // reaches 100% when section bottom reaches the middle of viewport.
      const progress = Math.max(
        0,
        Math.min(1, (vh - rect.top) / (rect.height + vh * 0.4)),
      );
      line!.style.height = `${progress * 100}%`;
    }

    // Cards fade in individually as they enter the viewport.
    const items = section.querySelectorAll<HTMLElement>('.fp-timeline-item');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    items.forEach((item) => io.observe(item));

    window.addEventListener('scroll', updateLine, { passive: true });
    updateLine();

    return () => {
      window.removeEventListener('scroll', updateLine);
      io.disconnect();
    };
  }, []);

  return (
    <section className="featured-places" ref={sectionRef}>
      <div className="featured-places__inner">
        <h2 className="featured-places__title">{title}</h2>

        <div className="fp-timeline">
          {/* Vertical line rail */}
          <div className="fp-rail" aria-hidden="true">
            <div className="fp-rail__track" />
            <div className="fp-rail__fill" ref={lineRef} />
          </div>

          {/* Timeline cards */}
          <ul className="fp-list" role="list">
            {places.map((place) => (
              <li key={place.id} className="fp-timeline-item">
                {/* Dot anchored on the line */}
                <span className="fp-dot" aria-hidden="true" />

                <Link href={place.href} className="fp-card">
                  {/* Image — first in DOM; flex-direction:row auto-mirrors in RTL */}
                  <div className="fp-card__img-wrap">
                    {place.imageUrl ? (
                      <Image
                        src={place.imageUrl}
                        alt={place.title}
                        fill
                        sizes="(max-width: 640px) 40vw, 220px"
                        className="fp-card__img"
                      />
                    ) : (
                      <div
                        className="fp-card__img-placeholder"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className="fp-card__body">
                    <span
                      className={`category-badge category-badge--${place.category}`}
                    >
                      {place.category}
                    </span>
                    <h3 className="fp-card__title">{place.title}</h3>
                    <p className="fp-card__desc">{place.shortDescription}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="featured-places__footer">
          <Link href={explorePlacesHref} className="btn btn--outline">
            {exploreMoreLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
