import { ADMIN_ROUTES } from '@/config/routes';
import { EditHistoryEntryForm } from '@/features/history/forms/EditHistoryEntryForm';
import { fetchHistoryEntryById } from '@/features/history/repositories/history.repository';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const entry = await fetchHistoryEntryById(id);
  return { title: entry ? `Edit: ${entry.title.en}` : 'Edit History Entry' };
}

export const dynamic = 'force-dynamic';

export default async function EditHistoryPage({ params }: Props) {
  const { id } = await params;
  const entry = await fetchHistoryEntryById(id);

  if (!entry) notFound();

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
