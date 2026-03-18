'use client';

import type { PlaceCategory, PlaceType } from '@/features/places/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import './PlaceFilters.css';

type PlaceFiltersProps = {
  allLabel: string;
  typeLabels: Record<PlaceType | 'all', string>;
  categoryLabels: Record<PlaceCategory | 'all', string>;
  availableTypes: PlaceType[];
  availableCategories: PlaceCategory[];
  filterByTypeLabel: string;
  filterByCategoryLabel: string;
};

// ---------------------------------------------------------------------------
// PlaceFilters — client component for URL-driven filtering via searchParams
// Updates ?type= and ?category= without a full page navigation
// ---------------------------------------------------------------------------
export function PlaceFilters({
  allLabel,
  typeLabels,
  categoryLabels,
  availableTypes,
  availableCategories,
  filterByTypeLabel,
  filterByCategoryLabel,
}: PlaceFiltersProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get('type') ?? 'all';
  const currentCategory = searchParams.get('category') ?? 'all';

  function updateFilter(key: 'type' | 'category', value: string): void {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="place-filters" aria-label="Filter places">
      <div className="place-filters__group">
        <label className="place-filters__label" htmlFor="filter-type">
          {filterByTypeLabel}
        </label>
        <select
          id="filter-type"
          className="place-filters__select"
          value={currentType}
          onChange={(e) => updateFilter('type', e.target.value)}
        >
          <option value="all">{allLabel}</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {typeLabels[type]}
            </option>
          ))}
        </select>
      </div>

      <div className="place-filters__group">
        <label className="place-filters__label" htmlFor="filter-category">
          {filterByCategoryLabel}
        </label>
        <select
          id="filter-category"
          className="place-filters__select"
          value={currentCategory}
          onChange={(e) => updateFilter('category', e.target.value)}
        >
          <option value="all">{allLabel}</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {categoryLabels[category]}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
