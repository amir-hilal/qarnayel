---
applyTo: 'src/lib/auth/**,src/lib/permissions/**,src/app/**'
---

# Auth and Permissions Instructions

## Current state

Auth is **placeholder-wired** using Firebase Authentication. The structure is in place for future role enforcement, but full role-based access control is not yet implemented.

## Firebase Auth setup

- Firebase Auth client is initialized in `lib/firebase/client.ts`
- Auth state is managed in `lib/auth/index.ts`
- Admin users must be authenticated Firebase users
- TODO: Set up Firebase Auth in the Firebase Console (Email/Password or Google provider)

## Role model (planned)

Three roles are planned for the future:

| Role       | Capabilities                                                  |
| ---------- | ------------------------------------------------------------- |
| `admin`    | Full access — create, edit, publish, archive, manage settings |
| `editor`   | Create and edit content; cannot publish or manage settings    |
| `reviewer` | Read-only access; can leave review notes                      |

## Permission placeholders

- `lib/permissions/index.ts` exports placeholder permission helpers
- All permission checks return `true` for now (assume admin access)
- TODO: Wire role claims from Firebase custom claims or a Firestore `users` collection
- Pattern:

```ts
// Placeholder - always returns true until real auth is wired
export function canPublish(_user: AdminUser | null): boolean {
  return true; // TODO: check role === 'admin' || role === 'editor'
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

## Auth guard

- The admin layout (`app/(admin)/layout.tsx`) must check auth state
- Unauthenticated users are redirected to `/login`
- The `useAdminAuth()` hook from `lib/auth/index.ts` provides auth state to client components
- TODO: Implement real redirect guard when auth is fully wired

## Security principle

- Client-side permission checks are UI guardrails only
- Server-side Firestore security rules are the real enforcement layer
- Never rely on client-side role checks for write operations without server-side validation
- See `docs/security-rules-plan.md` for Firestore rule design

## Login page

- `app/login/page.tsx` is a minimal login form using Firebase Auth
- After login, redirect to `/(admin)/dashboard`
- No public content is accessible via the admin app — everything requires auth
