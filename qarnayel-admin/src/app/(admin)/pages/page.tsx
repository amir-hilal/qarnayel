'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import { NavManager } from '@/features/pages/components/NavManager/NavManager';
import { fetchAllPageContent } from '@/features/pages/repositories/pages.repository';
import { fetchSiteSettings } from '@/features/settings/repositories/settings.repository';
import type { NavItem, PageContent } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PagesListPage() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllPageContent(), fetchSiteSettings()])
      .then(([pagesData, settings]) => {
        setPages(pagesData);
        setNavItems(settings?.navItems ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Pages</h1>
          <p className="admin-page-header__subtitle">
            Manage pages and navigation order
          </p>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.PAGE_NEW} className="btn btn--primary">
            + New Page
          </Link>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-page-loading">Loading…</div>
        ) : (
          <div className="admin-card__body">
            <NavManager initialPages={pages} initialNavItems={navItems} />
          </div>
        )}
      </div>
    </>
  );
}
