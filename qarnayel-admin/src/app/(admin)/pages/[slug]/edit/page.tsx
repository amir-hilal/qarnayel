'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import { EditPageContentForm } from '@/features/pages/forms/EditPageContentForm';
import { fetchPageContentBySlug } from '@/features/pages/repositories/pages.repository';
import type { PageContent } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPageContentPage() {
  const params = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    fetchPageContentBySlug(params.slug)
      .then((result) => {
        if (!result) setNotFound(true);
        else setPage(result);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className="admin-page-loading">Loading…</div>;
  if (notFound)
    return <div className="admin-page-loading">Page not found.</div>;
  if (!page) return null;

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Edit Page</h1>
          <p className="admin-page-header__subtitle">
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              {params.slug}
            </code>
          </p>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.PAGES} className="btn btn--ghost">
            Back to list
          </Link>
        </div>
      </div>

      <EditPageContentForm page={page} />
    </>
  );
}
