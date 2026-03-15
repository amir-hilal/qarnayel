# Staging vs Production

## Principle

Staging and production share a **single Firebase project**. Isolation between environments is achieved via:

- A separate Firestore **named database** for staging (within the same project)
- Separate domain/URLs
- Separate Vercel deployments
- `NEXT_PUBLIC_APP_ENV` flag to distinguish runtime behaviour

The same Firebase credentials (API key, project ID, etc.) are used across all environments.

---

## Environment comparison

| Aspect | Staging | Production |
|---|---|---|
| Firebase project | `qarnayel` (shared) | `qarnayel` (shared) |
| Firestore database | `staging` (named database) | `(default)` |
| Storage bucket | `qarnayel.appspot.com` (shared) | `qarnayel.appspot.com` (shared) |
| Domain | `staging.qarnayel.lb` or Vercel preview URL | `qarnayel.lb` |
| `NEXT_PUBLIC_APP_ENV` | `staging` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://staging.qarnayel.lb` | `https://qarnayel.lb` |
| `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` | `staging` | *(not set — uses default)* |
| Branch | `staging` | `main` |
| Vercel scope | Preview | Production |

---

## When to use staging

- Testing new features before going live
- Reviewing content changes with the team
- QA and regression testing
- Load testing (with appropriate Firebase quotas)

---

## Firebase setup checklist

- [ ] One Firebase project created (e.g. `qarnayel`)
- [ ] Web app registered in the project
- [ ] Firestore default database enabled (`me-central1`)
- [ ] Firestore named database `staging` created (when staging environment is needed)
- [ ] Storage enabled (single bucket, shared)
- [ ] Security rules deployed
- [ ] Firestore indexes created
- [ ] Correct `NEXT_PUBLIC_APP_ENV` and `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` set per environment in Vercel

---

## Testing on staging

Before deploying to production:

1. Push to the `staging` branch
2. Vercel auto-deploys to the staging URL
3. Test all pages and features with staging data
4. Verify content is correct and bilingual
5. Merge to `main` to deploy to production

---

## Content promotion

Content is managed through the admin dashboard. Staging uses a separate Firestore database (`staging`) within the same project:

1. The admin dashboard targets the `staging` database for test content
2. Production content is managed separately in the default database
3. There is no automatic sync between the two databases — content must be entered/approved in the production admin separately

---

## Canary and preview deployments

Every pull request on Vercel gets a unique preview URL. These preview deployments use `NEXT_PUBLIC_APP_ENV=staging` and `NEXT_PUBLIC_FIRESTORE_DATABASE_ID=staging`, pointing at the staging Firestore database within the shared project. This is set via Vercel's "Preview" environment scope.

---

## Environment detection in code

```ts
// src/lib/env/index.ts
export const isProduction = env.NEXT_PUBLIC_APP_ENV === 'production';
export const isStaging = env.NEXT_PUBLIC_APP_ENV === 'staging';
export const isDevelopment = env.NEXT_PUBLIC_APP_ENV === 'development';
```

Use these flags only for logging or non-critical behaviour differences. Never gate content on env flags.
