'use client';

import { ADMIN_ROUTES } from '@/config/routes';
import { AdminHeader } from '@/features/shared/components/AdminHeader/AdminHeader';
import { Sidebar } from '@/features/shared/components/Sidebar/Sidebar';
import { ToastProvider } from '@/features/shared/components/Toast/Toast';
import { useAdminAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';

// =============================================================================
// AdminShell — client component wrapping the authenticated admin layout
// =============================================================================

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
        }}
      >
        <div
          className="skeleton skeleton--text"
          style={{ width: '8rem', height: '1rem' }}
        />
      </div>
    );
  }

  if (!user) {
    redirect(ADMIN_ROUTES.LOGIN);
  }

  return (
    <div className="admin-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminHeader onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <main className="admin-content">
        <div className="admin-content__inner">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </ToastProvider>
  );
}
