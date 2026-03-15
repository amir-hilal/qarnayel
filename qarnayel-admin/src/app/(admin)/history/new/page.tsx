import { ADMIN_ROUTES } from '@/config/routes';
import { NewHistoryEntryForm } from '@/features/history/forms/NewHistoryEntryForm';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'New History Entry' };

export default function NewHistoryPage() {
  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-header__text">
          <h1 className="admin-page-header__title">New History Entry</h1>
        </div>
        <div className="admin-page-header__actions">
          <Link href={ADMIN_ROUTES.HISTORY} className="btn btn--ghost">
            Cancel
          </Link>
        </div>
      </div>

      <NewHistoryEntryForm />
    </>
  );
}
