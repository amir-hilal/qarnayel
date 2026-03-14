import { ROUTES } from '@/config/constants';
import type { Place } from '@/features/places/types';
import { EmptyState } from '@/features/shared/components/EmptyState';
import { PlaceCard } from './PlaceCard';

type PlaceListProps = {
  places: Place[];
  locale: string;
  emptyCopy: string;
  categoryLabels: Record<string, string>;
};

// ---------------------------------------------------------------------------
// PlaceList — responsive grid of PlaceCard components
// ---------------------------------------------------------------------------
export function PlaceList({
  places,
  locale,
  emptyCopy,
  categoryLabels,
}: PlaceListProps): React.ReactElement {
  if (places.length === 0) {
    return <EmptyState message={emptyCopy} />;
  }

  return (
    <ul className="place-list" role="list">
      {places.map((place) => (
        <li key={place.id} className="place-list__item">
          <PlaceCard
            place={place}
            categoryLabel={categoryLabels[place.category] ?? place.category}
            href={ROUTES.PLACE_DETAIL(locale, place.slug)}
            locale={locale}
          />
        </li>
      ))}
    </ul>
  );
}
