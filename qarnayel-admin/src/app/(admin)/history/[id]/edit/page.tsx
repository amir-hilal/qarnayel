'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ADMIN_ROUTES } from '@/config/routes';
import { EditHistoryEntryForm } from '@/features/history/forms/EditHistoryEntryForm';
import { fetchHistoryEntryById } from '@/features/history/repositories/history.repository';
import type { HistoryEntry } from '@/types';
import Link from 'next/link';

export default function EditHistoryPage() {
  const params = useParams<{ id: string }>();
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetchHistoryEntryById(params.id)
      .then((result) => {
        if (!result) setNotFound(true);
        else setEntry(result);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="admin-page-loading">Loading…</div>;
  if (notFound) return <div className="admin-page-loading">Entry not found.</div>;
  if (!entry) return null;

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Edit History Entry</h1>
          <p className="admin-page-header__subtitle">{entry.title.en}</p>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.HISTORY} className="btn btn--ghost">
            Back to list
          </Link>
        </div>
      </div>

      <EditHistoryEntryForm entry={entry} />
    </>
  );
}
