import './PlaceDetail.css';
import type { Place } from '@/features/places/types';
import { SafeExternalLink } from '@/features/shared/components/SafeExternalLink';
import Image from 'next/image';
import { CategoryBadge } from '../CategoryBadge/CategoryBadge';
import { ContactCTABlock } from '../ContactCTABlock/ContactCTABlock';
import { ResourceList } from '../ResourceList/ResourceList';

type PlaceDetailDict = {
  contactLabel: string;
  visitLabel: string;
  websiteLabel: string;
  resourcesHeading: string;
  mapLinkLabel: string;
  categoryLabel: string;
};

type PlaceDetailProps = {
  place: Place;
  locale: string;
  dict: PlaceDetailDict;
};

// ---------------------------------------------------------------------------
// PlaceDetail — full-page detail view for a single place
// ---------------------------------------------------------------------------
export function PlaceDetail({
  place,
  locale,
  dict,
}: PlaceDetailProps): React.ReactElement {
  const l = locale as 'ar' | 'en';

  const title = place.title[l] ?? place.title.ar;
  const description = place.description[l] ?? place.description.ar;
  const shortDescription =
    place.shortDescription[l] ?? place.shortDescription.ar;

  const primaryImage =
    (place.images ?? []).find((img) => img.isPrimary) ??
    (place.images ?? [])[0] ??
    null;

  const mapUrl = place.location?.mapUrl;

  return (
    <article className="place-detail">
      {primaryImage && (
        <figure className="place-detail__hero">
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt?.[l] ?? primaryImage.alt?.ar ?? title}
            fill
            priority
            sizes="100vw"
            className="place-detail__hero-image"
          />
        </figure>
      )}

      <div className="place-detail__content">
        <header className="place-detail__header">
          <CategoryBadge category={place.category} label={dict.categoryLabel} />
          <h1 className="place-detail__title">{title}</h1>
          {shortDescription && (
            <p className="place-detail__short-desc">{shortDescription}</p>
          )}
        </header>

        {description && (
          <section className="place-detail__description">
            <p>{description}</p>
          </section>
        )}

        {place.images && place.images.length > 1 && (
          <section className="place-detail__gallery" aria-label="Gallery">
            <ul className="place-detail__gallery-list" role="list">
              {place.images.map((img, i) => (
                <li key={i} className="place-detail__gallery-item">
                  <Image
                    src={img.url}
                    alt={img.alt?.[l] ?? img.alt?.ar ?? title}
                    width={400}
                    height={300}
                    className="place-detail__gallery-image"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {mapUrl && (
          <p className="place-detail__map-link">
            <SafeExternalLink href={mapUrl} className="btn btn--outline">
              {dict.mapLinkLabel}
            </SafeExternalLink>
          </p>
        )}

        {place.contact && (
          <ContactCTABlock
            contact={place.contact}
            contactMode={place.contactMode}
            {...(place.location?.address !== undefined
              ? { address: place.location.address }
              : {})}
            contactLabel={dict.contactLabel}
            visitLabel={dict.visitLabel}
            websiteLabel={dict.websiteLabel}
            locale={locale}
          />
        )}

        {place.resources && place.resources.length > 0 && (
          <ResourceList
            resources={place.resources}
            heading={dict.resourcesHeading}
            locale={locale}
          />
        )}
      </div>
    </article>
  );
}
