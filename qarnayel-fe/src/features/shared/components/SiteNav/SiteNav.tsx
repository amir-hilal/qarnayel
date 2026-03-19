import Link from 'next/link';
import './SiteNav.css';

// ---------------------------------------------------------------------------
// SiteNav — shared navigation list used by SiteHeader and SiteFooter.
// Shows up to MAX_VISIBLE items; additional items collapse into an "Other"
// <details> dropdown so the nav bar never exceeds the visible cap.
// ---------------------------------------------------------------------------

const MAX_VISIBLE = 5;

export interface SiteNavItem {
  href: string;
  label: string;
}

interface SiteNavProps {
  items: SiteNavItem[];
  ariaLabel: string;
  /** Extra class added to <nav> for context-specific CSS overrides. */
  className?: string;
  /** Label for the overflow dropdown trigger (defaults to "More"). */
  otherLabel?: string;
}

export function SiteNav({
  items,
  ariaLabel,
  className,
  otherLabel = 'More',
}: SiteNavProps): React.ReactElement {
  const cls = ['site-nav', className].filter(Boolean).join(' ');
  const visibleItems = items.slice(0, MAX_VISIBLE);
  const overflowItems = items.slice(MAX_VISIBLE);

  return (
    <nav className={cls} aria-label={ariaLabel}>
      {visibleItems.map((item) => (
        <Link key={item.href} href={item.href} className="site-nav__link">
          {item.label}
        </Link>
      ))}

      {overflowItems.length > 0 && (
        <details className="site-nav__more">
          <summary className="site-nav__more-trigger">
            {otherLabel}
            <span
              className="material-symbols-outlined site-nav__more-icon"
              aria-hidden="true"
            >
              expand_more
            </span>
          </summary>
          <ul className="site-nav__more-dropdown" role="list">
            {overflowItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="site-nav__link site-nav__more-link"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
    </nav>
  );
}
