'use client';

import { PAGE_SLUGS } from '@/config/constants';
import { EditPageContentForm } from '@/features/pages/forms/EditPageContentForm';
import {
  fetchPageContentBySlug,
  upsertPageContent,
} from '@/features/pages/repositories/pages.repository';
import type { PageContent, PageContentFormValues } from '@/types';
import { useEffect, useState } from 'react';

const BLANK: PageContentFormValues = {
  slug: PAGE_SLUGS.HISTORY,
  status: 'draft',
  title: { ar: '', en: '' },
  body: { ar: '', en: '' },
  seo: {
    ar: { title: '', description: '' },
    en: { title: '', description: '' },
  },
};

export default function HistoryPage() {
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContentBySlug(PAGE_SLUGS.HISTORY).then(async (result) => {
      if (!result) {
        await upsertPageContent(PAGE_SLUGS.HISTORY, BLANK);
        const created = await fetchPageContentBySlug(PAGE_SLUGS.HISTORY);
        setPage(created);
      } else {
        setPage(result);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="admin-page-loading">Loading…</div>;
  if (!page)
    return <div className="admin-page-loading">Could not load page.</div>;

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">History</h1>
          <p className="admin-page-header__subtitle">
            Edit the history page content shown on the public website.
          </p>
        </div>
      </div>

      <EditPageContentForm page={page} />
    </>
  );
}
