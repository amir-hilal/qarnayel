import Link from 'next/link';
import './SiteNav.css';

// ---------------------------------------------------------------------------
// SiteNav — shared navigation list used by SiteHeader and SiteFooter.
// Parents build the items array and pass an optional className for
// context-specific layout overrides.
// ---------------------------------------------------------------------------

export interface SiteNavItem {
  href: string;
  label: string;
}

interface SiteNavProps {
  items: SiteNavItem[];
  ariaLabel: string;
  /** Extra class added to <nav> for context-specific CSS overrides. */
  className?: string;
}

export function SiteNav({
  items,
  ariaLabel,
  className,
}: SiteNavProps): React.ReactElement {
  const cls = ['site-nav', className].filter(Boolean).join(' ');

  return (
    <nav className={cls} aria-label={ariaLabel}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="site-nav__link">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
