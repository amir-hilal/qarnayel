import type { AdminUser } from '@/types';

// =============================================================================
// Permission helpers — placeholder implementation
// TODO: Replace with real role-based checks once custom claims are active.
// All checks currently return true (assume admin access for authenticated users).
// =============================================================================

export function canPublish(_user: AdminUser | null): boolean {
  // TODO: return _user?.role === 'admin' || _user?.role === 'editor';
  return true;
}

export function canArchive(_user: AdminUser | null): boolean {
  // TODO: return _user?.role === 'admin' || _user?.role === 'editor';
  return true;
}

export function canManageSettings(_user: AdminUser | null): boolean {
  // TODO: return _user?.role === 'admin';
  return true;
}

export function canUploadMedia(_user: AdminUser | null): boolean {
  // TODO: return _user?.role === 'admin' || _user?.role === 'editor';
  return true;
}

export function canDeleteMedia(_user: AdminUser | null): boolean {
  // TODO: return _user?.role === 'admin';
  return true;
}

export function canViewContent(_user: AdminUser | null): boolean {
  // TODO: return _user !== null;
  return true;
}
