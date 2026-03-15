import { ADMIN_ROUTES } from '@/config/routes';
import { fetchAllPlaces } from '@/features/places/repositories/places.repository';
import { EmptyState } from '@/features/shared/components/EmptyState';
import { StatusBadge } from '@/features/shared/components/StatusBadge';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Places' };
export const dynamic = 'force-dynamic';

export default async function PlacesPage() {
  const places = await fetchAllPlaces();

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Places</h1>
          <p className="admin-page-header__subtitle">
            {places.length} place{places.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.PLACE_NEW} className="btn btn--primary">
            Add place
          </Link>
        </div>
      </div>

      <div className="admin-card">
        {places.length === 0 ? (
          <EmptyState
            title="No places yet"
            description="Start by adding the first place in Qarnayel."
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
                  <th>Title (AR)</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {places.map((place) => (
                  <tr key={place.id}>
                    <td>{place.title.en}</td>
                    <td dir="rtl" lang="ar">
                      {place.title.ar}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {place.category}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {place.placeType}
                    </td>
                    <td>
                      <StatusBadge status={place.status} />
                    </td>
                    <td>{place.featured ? '★' : '—'}</td>
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
