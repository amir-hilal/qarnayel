'use client';

import { auth } from '@/lib/firebase/client';
import type { AdminUser } from '@/types';
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type User,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

// =============================================================================
// Auth helpers — Firebase Authentication wrappers
// TODO: Wire role fetching from custom claims once role system is active
// =============================================================================

/**
 * Sign in with email and password.
 */
export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Convert a Firebase User to an AdminUser.
 * TODO: Read role from custom claims once role system is active.
 */
function toAdminUser(user: User): AdminUser {
  return {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? undefined,
    role: 'admin', // TODO: read from user.getIdTokenResult().claims.role
  };
}

/**
 * React hook — returns the current admin user and loading state.
 * Use in client components that need auth state.
 */
export function useAdminAuth(): {
  user: AdminUser | null;
  loading: boolean;
} {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? toAdminUser(firebaseUser) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}
