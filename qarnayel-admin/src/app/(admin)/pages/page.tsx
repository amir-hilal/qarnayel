'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import { fetchAllPageContent } from '@/features/pages/repositories/pages.repository';
import { StatusBadge } from '@/features/shared/components/StatusBadge/StatusBadge';
import type { PageContent } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PagesListPage() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPageContent()
      .then(setPages)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Pages</h1>
          <p className="admin-page-header__subtitle">
            Static page content (About, Contact, etc.)
          </p>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-page-loading">Loading…</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Slug</th>
                  <th>Title (EN)</th>
                  <th>Title (AR)</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td>
                      <code
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--font-size-xs)',
                        }}
                      >
                        {page.slug}
                      </code>
                    </td>
                    <td>{page.title.en}</td>
                    <td dir="rtl" lang="ar">
                      {page.title.ar}
                    </td>
                    <td>
                      <StatusBadge status={page.status} />
                    </td>
                    <td className="admin-table__actions">
                      <Link
                        href={ADMIN_ROUTES.PAGE_EDIT(page.slug)}
                        className="btn btn--ghost btn--sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
