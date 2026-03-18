import type { Place } from '@/features/places/types';
import { getPrimaryImageUrl } from '@/features/places/utils';
import Image from 'next/image';
import Link from 'next/link';
import { CategoryBadge } from '../CategoryBadge/CategoryBadge';
import './PlaceCard.css';

type PlaceCardProps = {
  place: Place;
  categoryLabel: string;
  href: string;
  locale: string;
};

// ---------------------------------------------------------------------------
// PlaceCard — summary card used in list views and search results
// ---------------------------------------------------------------------------
export function PlaceCard({
  place,
  categoryLabel,
  href,
  locale,
}: PlaceCardProps): React.ReactElement {
  const imageUrl = getPrimaryImageUrl(place.images);
  const title =
    place.title[locale as keyof typeof place.title] ?? place.title.ar;
  const description =
    place.shortDescription[locale as keyof typeof place.shortDescription] ??
    place.shortDescription.ar;

  return (
    <article className="place-card">
      <Link href={href} className="place-card__link" aria-label={title}>
        {imageUrl ? (
          <div className="place-card__image-wrap">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="place-card__image"
            />
          </div>
        ) : (
          <div className="place-card__image-placeholder" aria-hidden="true" />
        )}
        <div className="place-card__body">
          <CategoryBadge category={place.category} label={categoryLabel} />
          <h2 className="place-card__title">{title}</h2>
          {description && (
            <p className="place-card__description">{description}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
