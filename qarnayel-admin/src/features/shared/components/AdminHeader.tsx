'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import { signOut, useAdminAuth } from '@/lib/auth';

// =============================================================================
// AdminHeader — top header bar for the admin shell
// =============================================================================

interface AdminHeaderProps {
  /** Page title to display in the header */
  title?: string;
  /** Toggle callback for the mobile sidebar menu */
  onMenuToggle?: () => void;
}

export function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  const { user } = useAdminAuth();

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        {onMenuToggle && (
          <button
            type="button"
            className="admin-header__menu-toggle"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        {title && <h1 className="admin-header__page-title">{title}</h1>}
      </div>

      <div className="admin-header__right">
        {user && (
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-muted)',
            }}
          >
            {user.email}
          </span>
        )}
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() =>
            signOut().then(() => {
              window.location.href = ADMIN_ROUTES.LOGIN;
            })
          }
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
