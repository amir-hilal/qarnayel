'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import { fetchAllPlaces } from '@/features/places/repositories/places.repository';
import { EmptyState } from '@/features/shared/components/EmptyState';
import { StatusBadge } from '@/features/shared/components/StatusBadge';
import type { Place } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPlaces()
      .then(setPlaces)
      .finally(() => setLoading(false));
  }, []);

  const published = places.filter((p) => p.status === 'published').length;
  const drafts = places.filter((p) => p.status === 'draft').length;
  const archived = places.filter((p) => p.status === 'archived').length;

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Dashboard</h1>
          <p className="admin-page-header__subtitle">
            Overview of your content
          </p>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
          gap: 'var(--space-4)',
          marginBlockEnd: 'var(--space-8)',
        }}
      >
        <div className="stat-card">
          <p className="stat-card__label">Total Places</p>
          <p className="stat-card__value">{loading ? '…' : places.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Published</p>
          <p className="stat-card__value">{loading ? '…' : published}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Drafts</p>
          <p className="stat-card__value">{loading ? '…' : drafts}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Archived</p>
          <p className="stat-card__value">{loading ? '…' : archived}</p>
        </div>
      </div>

      {/* Recent places */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Recent Places</h2>
          <Link href={ADMIN_ROUTES.PLACES} className="btn btn--ghost btn--sm">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="admin-page-loading">Loading…</div>
        ) : places.length === 0 ? (
          <EmptyState
            title="No places yet"
            description="Create your first place to get started."
            action={
              <Link href={ADMIN_ROUTES.PLACE_NEW} className="btn btn--primary">
                Add place
              </Link>
            }
          />
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title (EN)</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {places.slice(0, 5).map((place) => (
                  <tr key={place.id}>
                    <td>{place.title.en}</td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {place.category}
                    </td>
                    <td>
                      <StatusBadge status={place.status} />
                    </td>
                    <td className="admin-table__actions">
                      <Link
                        href={ADMIN_ROUTES.PLACE_EDIT(place.id)}
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
