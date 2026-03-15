'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

// =============================================================================
// Sidebar — primary navigation shell for the admin dashboard
// =============================================================================

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const ICON_SIZE = { width: 18, height: 18 };

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Content',
    items: [
      {
        label: 'Dashboard',
        href: ADMIN_ROUTES.DASHBOARD,
        icon: (
          <svg
            {...ICON_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
      {
        label: 'Places',
        href: ADMIN_ROUTES.PLACES,
        icon: (
          <svg
            {...ICON_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        ),
      },
      {
        label: 'History',
        href: ADMIN_ROUTES.HISTORY,
        icon: (
          <svg
            {...ICON_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 15" />
          </svg>
        ),
      },
      {
        label: 'Pages',
        href: ADMIN_ROUTES.PAGES,
        icon: (
          <svg
            {...ICON_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="12" y2="17" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Assets',
    items: [
      {
        label: 'Media',
        href: ADMIN_ROUTES.MEDIA,
        icon: (
          <svg
            {...ICON_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        label: 'Settings',
        href: ADMIN_ROUTES.SETTINGS,
        icon: (
          <svg
            {...ICON_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        ),
      },
    ],
  },
];

interface SidebarProps {
  /** Controlled open state for mobile. When omitted, sidebar is always visible. */
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === ADMIN_ROUTES.DASHBOARD) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarClasses = [
    'admin-sidebar',
    isOpen !== undefined && isOpen ? 'admin-sidebar--open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="admin-sidebar-overlay admin-sidebar-overlay--visible"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={sidebarClasses} aria-label="Main navigation">
        {/* Brand */}
        <Link
          href={ADMIN_ROUTES.DASHBOARD}
          className="admin-sidebar__brand"
          onClick={onClose}
        >
          <span className="admin-sidebar__brand-text">Qarnayel Admin</span>
        </Link>

        {/* Navigation */}
        <nav className="admin-sidebar__nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="admin-sidebar__section">
              <p className="admin-sidebar__section-label">{section.label}</p>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link${isActive(item.href) ? ' admin-nav-link--active' : ''}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  onClick={onClose}
                >
                  <span className="admin-nav-link__icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
