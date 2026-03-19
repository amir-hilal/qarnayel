'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import { NavOrderManager } from '@/features/pages/components/NavOrderManager/NavOrderManager';
import {
  deletePageContent,
  fetchAllPageContent,
} from '@/features/pages/repositories/pages.repository';
import { fetchSiteSettings } from '@/features/settings/repositories/settings.repository';
import { StatusBadge } from '@/features/shared/components/StatusBadge/StatusBadge';
import { useToast } from '@/features/shared/components/Toast/Toast';
import { ConfirmDialog } from '@/features/shared/forms/ConfirmDialog/ConfirmDialog';
import type { NavItem, PageContent } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PagesListPage() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([fetchAllPageContent(), fetchSiteSettings()])
      .then(([pagesData, settings]) => {
        setPages(pagesData);
        setNavItems(settings?.navItems ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(slug: string) {
    setDeleting(slug);
    try {
      await deletePageContent(slug);
      setPages((prev) => prev.filter((p) => p.slug !== slug));
      toast('Page deleted.', 'success');
    } catch {
      toast('Failed to delete page.', 'error');
    } finally {
      setDeleting(null);
      setConfirmSlug(null);
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Pages</h1>
          <p className="admin-page-header__subtitle">
            Static page content (History, Contact, etc.)
          </p>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.PAGE_NEW} className="btn btn--primary">
            + New Page
          </Link>
        </div>
      </div>

      {/* Pages table */}
      <div className="admin-card" style={{ marginBlockEnd: 'var(--space-6)' }}>
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
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm btn--danger"
                        disabled={deleting === page.slug}
                        onClick={() => setConfirmSlug(page.slug)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Navigation order */}
      {!loading && (
        <div className="admin-card">
          <div className="admin-card__body">
            <h2
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 600,
                marginBlockEnd: 'var(--space-1)',
              }}
            >
              Navigation Order
            </h2>
            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-sm)',
                marginBlockEnd: 'var(--space-5)',
              }}
            >
              Drag items to reorder. Home is always first and cannot be moved.
              Add pages from the list above, or remove them to hide from nav.
            </p>
            <NavOrderManager initialNavItems={navItems} pages={pages} />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmSlug !== null}
        title="Delete page"
        message={`Are you sure you want to permanently delete "${confirmSlug}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDangerous
        onConfirm={() => confirmSlug && handleDelete(confirmSlug)}
        onCancel={() => setConfirmSlug(null)}
      />
    </>
  );
}
