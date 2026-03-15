# Auth and Roles Plan

## Current state

Firebase Authentication is wired for login/logout. Role-based access control is **planned** but not yet fully implemented. All authenticated users currently have admin-level access.

## Authentication

- Provider: Firebase Auth
- Methods: Email/Password (and optionally Google sign-in)
- Admin users are created manually in the Firebase Console
- Only authenticated users can access the admin dashboard

## Login flow

1. User navigates to `/login`
2. User enters email and password
3. Firebase Auth validates credentials
4. On success: user is redirected to `/dashboard`
5. On failure: error message shown

## Planned role model

| Role | Access |
|---|---|
| `admin` | Full access: create, edit, publish, archive, manage settings, manage media, manage users |
| `editor` | Create and edit content; save drafts; cannot publish, archive, or manage settings |
| `reviewer` | Read-only access to content; can add review comments (future feature) |

## Role storage

Roles will be stored as Firebase Auth custom claims:

```ts
// Custom claim structure
{ role: 'admin' | 'editor' | 'reviewer' }
```

Setting custom claims requires the Firebase Admin SDK and must be done server-side (e.g., via a Cloud Function or a secure admin script).

## Permission helper pattern

```ts
// lib/permissions/index.ts
export function canPublish(user: AdminUser | null): boolean {
  // TODO: return user?.role === 'admin' || user?.role === 'editor';
  return true; // placeholder
}

export function canManageSettings(user: AdminUser | null): boolean {
  // TODO: return user?.role === 'admin';
  return true; // placeholder
}
```

## AdminUser type

```ts
type AdminRole = 'admin' | 'editor' | 'reviewer';

type AdminUser = {
  uid: string;
  email: string;
  displayName?: string;
  role: AdminRole;
};
```

## Manual setup steps

1. Create admin users in Firebase Console → Authentication → Users
2. (Future) Set custom claims using Admin SDK:
   ```js
   // scripts/set-admin-role.mjs
   await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
   ```
3. Users must sign out and back in for custom claims to take effect

## Security principle

- Client-side permission checks are **UI guardrails only**
- Firestore security rules are the **real enforcement layer**
- Never rely on client-side role checks for write operations
- See `docs/security-rules-plan.md` for Firestore security rule design
