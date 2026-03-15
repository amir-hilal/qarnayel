# Deployment

## Overview

The admin dashboard is deployed as a Next.js application. It should be deployed separately from the public website.

## Recommended hosting: Vercel

### Setup

1. Create a new Vercel project pointing at the `qarnayel-admin` directory (monorepo root, set the root directory to `qarnayel-admin`)
2. Configure all environment variables in Vercel project settings (see `docs/environment-setup.md`)
3. Set up separate deployments for `staging` and `production` environments

### Environment configuration on Vercel

**Production deployment**:
```
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_FIRESTORE_DATABASE_ID=   (leave empty)
NEXT_PUBLIC_ADMIN_SITE_URL=https://admin.qarnayel.com
NEXT_PUBLIC_PUBLIC_SITE_URL=https://qarnayel.com
```

**Staging / preview deployment**:
```
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_FIRESTORE_DATABASE_ID=staging
NEXT_PUBLIC_ADMIN_SITE_URL=https://admin-staging.qarnayel.com
NEXT_PUBLIC_PUBLIC_SITE_URL=https://staging.qarnayel.com
```

### Branch strategy

| Branch | Environment | Firestore database |
|---|---|---|
| `main` | Production | default |
| `staging` (or preview) | Staging | `staging` |
| Feature branches | Preview (staging env) | `staging` |

## Build command

```bash
npm run build
```

## Recommended security settings (Vercel)

- Enable **password protection** on staging deployments
- Restrict admin app domain to internal access if possible
- Never expose the admin app URL in the public website
- Add `robots.txt` with `Disallow: /` to prevent search indexing of the admin app

## Post-deployment checklist

- [ ] Verify Firebase credentials are correctly set in environment variables
- [ ] Confirm `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` is correct for the environment
- [ ] Test login with a real admin Firebase Auth account
- [ ] Verify Firestore read and write operations work in the target database
- [ ] Verify image upload to Firebase Storage works
- [ ] Check that preview URLs point to the correct public website environment
- [ ] Verify no secrets are visible in the browser console or network tab
