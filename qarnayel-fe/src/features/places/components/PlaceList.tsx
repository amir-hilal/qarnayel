import type { Place } from '@/features/places/types';
import { PlaceCard } from './PlaceCard';
import { EmptyState } from '@/features/shared/components/EmptyState';
import { ROUTES } from '@/config/constants';

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
      {places.map(place => (
        <li key={place.id} className="place-list__item">
          <PlaceCard
            place={place}
            categoryLabel={categoryLabels[place.category] ?? place.category}
            href={ROUTES.placeDetail(locale, place.slug)}
            locale={locale}
          />
        </li>
      ))}
    </ul>
  );
}
