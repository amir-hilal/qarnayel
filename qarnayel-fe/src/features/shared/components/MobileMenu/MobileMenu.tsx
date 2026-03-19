'use client';

import type { SiteNavItem } from '@/features/shared/components/SiteNav/SiteNav';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './MobileMenu.css';

// ---------------------------------------------------------------------------
// MobileMenu — hamburger toggle + full-screen overlay for small screens.
// Auto-collapses when the viewport grows past the mobile breakpoint.
// ---------------------------------------------------------------------------

interface MobileMenuProps {
  items: SiteNavItem[];
  ariaLabel: string;
  /** Accessible label for the open-menu button. */
  openLabel?: string;
  /** Accessible label for the close-menu button. */
  closeLabel?: string;
}

export function MobileMenu({
  items,
  ariaLabel,
  openLabel = 'Open menu',
  closeLabel = 'Close menu',
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Auto-collapse when viewport grows back to desktop width
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    function onChange(e: MediaQueryListEvent) {
      if (e.matches) setOpen(false);
    }
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      {/* Hamburger toggle — only visible on mobile via CSS */}
      <button
        type="button"
        className="mobile-menu__toggle"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={openLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          menu
        </span>
      </button>

      {open && (
        <nav
          id="mobile-nav-panel"
          className="mobile-menu__panel"
          aria-label={ariaLabel}
        >
          {/* Close button inside the panel */}
          <button
            type="button"
            className="mobile-menu__close"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>

          <ul className="mobile-menu__list" role="list">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="mobile-menu__link"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
