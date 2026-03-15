'use client';

import { useState, useEffect } from 'react';
import { ADMIN_ROUTES } from '@/config/routes';
import { fetchAllHistoryEntries } from '@/features/history/repositories/history.repository';
import { EmptyState } from '@/features/shared/components/EmptyState';
import { StatusBadge } from '@/features/shared/components/StatusBadge';
import type { HistoryEntry } from '@/types';
import Link from 'next/link';

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllHistoryEntries().then(setEntries).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">History</h1>
          <p className="admin-page-header__subtitle">
            {loading ? 'Loading…' : `${entries.length} entr${entries.length !== 1 ? 'ies' : 'y'} total`}
          </p>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.HISTORY_NEW} className="btn btn--primary">
            Add entry
          </Link>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-page-loading">Loading…</div>
        ) : entries.length === 0 ? (
          <EmptyState
            title="No history entries yet"
            description="Document the history of Qarnayel by adding the first entry."
            action={
              <Link
                href={ADMIN_ROUTES.HISTORY_NEW}
                className="btn btn--primary"
              >
                Add entry
              </Link>
            }
          />
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title (EN)</th>
                  <th>Title (AR)</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.title.en}</td>
                    <td dir="rtl" lang="ar">
                      {entry.title.ar}
                    </td>
                    <td>
                      {entry.periodStart}
                      {entry.periodEnd ? ` – ${entry.periodEnd}` : ''}
                    </td>
                    <td>
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="admin-table__actions">
                      <Link
                        href={ADMIN_ROUTES.HISTORY_EDIT(entry.id)}
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
