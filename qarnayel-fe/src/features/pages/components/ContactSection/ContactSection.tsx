import type { SiteSettings } from '@/types';
import './ContactSection.css';

type ContactSectionProps = {
  title: string;
  settings: SiteSettings | null;
  locale: string;
  emailLabel: string;
  phoneLabel: string;
  socialLabel: string;
};

// ---------------------------------------------------------------------------
// ContactSection — renders the hardcoded contact page with info from siteSettings
// ---------------------------------------------------------------------------
export function ContactSection({
  title,
  settings,
  emailLabel,
  phoneLabel,
  socialLabel,
}: ContactSectionProps): React.ReactElement {
  return (
    <article className="contact-section">
      <header className="contact-section__header">
        <h1 className="contact-section__title">{title}</h1>
      </header>

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
