import type {
  ContactMode,
  LocalizedText,
  PlaceContact,
} from '@/features/places/types';
import { SafeExternalLink } from '@/features/shared/components/SafeExternalLink';

type ContactCTABlockProps = {
  contact: PlaceContact;
  contactMode: ContactMode;
  address?: LocalizedText;
  contactLabel: string;
  visitLabel: string;
  websiteLabel: string;
  locale: string;
};

// ---------------------------------------------------------------------------
// ContactCTABlock — contact actions, adapts to contactMode
// Renders nothing when contactMode is 'none'
// ---------------------------------------------------------------------------
export function ContactCTABlock({
  contact,
  contactMode,
  address,
  contactLabel,
  visitLabel,
  websiteLabel,
  locale,
}: ContactCTABlockProps): React.ReactElement | null {
  if (contactMode === 'none') return null;

  const hasPhone = Boolean(contact.phone);
  const hasWebsite = Boolean(contact.website);
  const hasAddress =
    address && (address[locale as keyof typeof address] ?? address.ar);
  const addressText = address?.[locale as keyof typeof address] ?? address?.ar;

  return (
    <section className="contact-cta">
      <h3 className="contact-cta__heading">{contactLabel}</h3>
      <ul className="contact-cta__list" role="list">
        {hasPhone && (
          <li className="contact-cta__item">
            <a
              href={`tel:${contact.phone}`}
              className="contact-cta__link contact-cta__link--phone"
            >
              {contact.phone}
            </a>
          </li>
        )}
        {hasWebsite && (
          <li className="contact-cta__item">
            <SafeExternalLink
              href={contact.website!}
              className="contact-cta__link contact-cta__link--website"
            >
              {websiteLabel}
            </SafeExternalLink>
          </li>
        )}
        {hasAddress && (
          <li className="contact-cta__item contact-cta__item--address">
            <span className="contact-cta__label">{visitLabel}</span>
            <address className="contact-cta__address">{addressText}</address>
          </li>
        )}
      </ul>
    </section>
  );
}
