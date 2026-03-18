import './ContactSection.css';
import type { PageContent } from '@/features/pages/types';
import type { SiteSettings } from '@/types';

type ContactSectionProps = {
  page: PageContent;
  settings: SiteSettings | null;
  locale: string;
  emailLabel: string;
  phoneLabel: string;
  socialLabel: string;
};

// ---------------------------------------------------------------------------
// ContactSection — renders PageContent for the contact page with contact info
// ---------------------------------------------------------------------------
export function ContactSection({
  page,
  settings,
  locale,
  emailLabel,
  phoneLabel,
  socialLabel,
}: ContactSectionProps): React.ReactElement {
  const l = locale as 'ar' | 'en';
  const title = page.title[l] ?? page.title.ar;
  const body = page.body[l] ?? page.body.ar;

  return (
    <article className="contact-section">
      <header className="contact-section__header">
        <h1 className="contact-section__title">{title}</h1>
      </header>

      <div className="contact-section__body">
        {body.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {settings &&
        (settings.contactEmail ??
          settings.contactPhone ??
          settings.socialLinks) && (
          <section className="contact-section__info">
            {settings.contactEmail && (
              <p className="contact-section__row">
                <span className="contact-section__label">{emailLabel}</span>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="contact-section__link"
                >
                  {settings.contactEmail}
                </a>
              </p>
            )}
            {settings.contactPhone && (
              <p className="contact-section__row">
                <span className="contact-section__label">{phoneLabel}</span>
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="contact-section__link"
                >
                  {settings.contactPhone}
                </a>
              </p>
            )}
            {settings.socialLinks && (
              <div className="contact-section__social">
                <span className="contact-section__label">{socialLabel}</span>
                <ul className="contact-section__social-list" role="list">
                  {settings.socialLinks.facebook && (
                    <li>
                      <a
                        href={settings.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-section__social-link"
                      >
                        Facebook
                      </a>
                    </li>
                  )}
                  {settings.socialLinks.instagram && (
                    <li>
                      <a
                        href={settings.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-section__social-link"
                      >
                        Instagram
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </section>
        )}
    </article>
  );
}
