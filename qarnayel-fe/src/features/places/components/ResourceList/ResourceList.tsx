import './ResourceList.css';
import type { PlaceResource } from '@/features/places/types';
import { SafeExternalLink } from '@/features/shared/components/SafeExternalLink';

type ResourceListProps = {
  resources: PlaceResource[];
  heading: string;
  locale: string;
};

// ---------------------------------------------------------------------------
// ResourceList — list of external resources (websites, social pages, etc.)
// ---------------------------------------------------------------------------
export function ResourceList({
  resources,
  heading,
  locale,
}: ResourceListProps): React.ReactElement | null {
  if (resources.length === 0) return null;

  return (
    <section className="resource-list">
      <h3 className="resource-list__heading">{heading}</h3>
      <ul className="resource-list__items" role="list">
        {resources.map((resource, index) => {
          const label =
            resource.label[locale as keyof typeof resource.label] ?? resource.label.ar;
          return (
            <li key={index} className="resource-list__item">
              <SafeExternalLink href={resource.url} className="resource-list__link">
                {label}
              </SafeExternalLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
