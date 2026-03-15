'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ADMIN_ROUTES } from '@/config/routes';
import { EditPlaceForm } from '@/features/places/forms/EditPlaceForm';
import { fetchPlaceById } from '@/features/places/repositories/places.repository';
import type { Place } from '@/types';
import Link from 'next/link';

export default function EditPlacePage() {
  const params = useParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetchPlaceById(params.id)
      .then((result) => {
        if (!result) setNotFound(true);
        else setPlace(result);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="admin-page-loading">Loading…</div>;
  if (notFound) return <div className="admin-page-loading">Place not found.</div>;
  if (!place) return null;

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">Edit Place</h1>
          <p className="admin-page-header__subtitle">{place.title.en}</p>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.PLACES} className="btn btn--ghost">
            Back to list
          </Link>
        </div>
      </div>

      <EditPlaceForm place={place} />
    </>
  );
}
