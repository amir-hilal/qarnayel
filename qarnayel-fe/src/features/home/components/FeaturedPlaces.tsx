import Image from 'next/image';
import Link from 'next/link';
import type { FeaturedPlaceViewModel } from '@/features/home/view-models/home.view-model';

type FeaturedPlacesProps = {
  title: string;
  places: FeaturedPlaceViewModel[];
  exploreMoreLabel: string;
  explorePlacesHref: string;
};

// ---------------------------------------------------------------------------
// FeaturedPlaces — grid of featured place cards on the homepage
// ---------------------------------------------------------------------------
export function FeaturedPlaces({
  title,
  places,
  exploreMoreLabel,
  explorePlacesHref,
}: FeaturedPlacesProps): React.ReactElement {
  if (places.length === 0) return <></>;

  return (
    <section className="featured-places">
      <div className="featured-places__inner">
        <h2 className="featured-places__title">{title}</h2>
        <ul className="featured-places__grid" role="list">
          {places.map(place => (
            <li key={place.id} className="featured-places__item">
              <Link href={place.href} className="featured-place-card">
                {place.imageUrl ? (
                  <div className="featured-place-card__image-wrap">
                    <Image
                      src={place.imageUrl}
                      alt={place.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="featured-place-card__image"
                    />
                  </div>
                ) : (
                  <div className="featured-place-card__image-placeholder" aria-hidden="true" />
                )}
                <div className="featured-place-card__body">
                  <span className={`category-badge category-badge--${place.category}`}>
                    {place.category}
                  </span>
                  <h3 className="featured-place-card__title">{place.title}</h3>
                  <p className="featured-place-card__desc">{place.shortDescription}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="featured-places__footer">
          <Link href={explorePlacesHref} className="btn btn--outline">
            {exploreMoreLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
