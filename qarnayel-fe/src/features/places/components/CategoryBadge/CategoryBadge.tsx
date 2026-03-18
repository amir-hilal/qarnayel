import type { PlaceCategory } from '@/features/places/types';
import './CategoryBadge.css';

type CategoryBadgeProps = {
  category: PlaceCategory;
  label: string;
};

// ---------------------------------------------------------------------------
// CategoryBadge — small visual label for a place's category
// ---------------------------------------------------------------------------
export function CategoryBadge({
  category,
  label,
}: CategoryBadgeProps): React.ReactElement {
  return (
    <span
      className={`category-badge category-badge--${category}`}
      aria-label={label}
    >
      {label}
    </span>
  );
}
