# Staging vs Production

## Principle

Staging and production are **completely separate environments**. They use:

- Separate Firebase projects
- Separate Firestore databases
- Separate Storage buckets
- Separate domain/URLs
- Separate Vercel deployments

Data from staging never reaches production and vice versa.

---

## Environment comparison

| Aspect | Staging | Production |
|---|---|---|
| Firebase project | `qarnayel-staging` | `qarnayel-production` |
| Firestore data | Test content | Live published content |
| Storage bucket | `qarnayel-staging.appspot.com` | `qarnayel-production.appspot.com` |
| Domain | `staging.qarnayel.lb` or Vercel preview URL | `qarnayel.lb` |
| `NEXT_PUBLIC_APP_ENV` | `staging` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://staging.qarnayel.lb` | `https://qarnayel.lb` |
| Branch | `staging` | `main` |
| Vercel scope | Preview | Production |

---

## When to use staging

- Testing new features before going live
- Reviewing content changes with the team
- QA and regression testing
- Load testing (with appropriate Firebase quotas)

---

## Firebase project separation checklist

- [ ] Two Firebase projects created (`qarnayel-staging`, `qarnayel-production`)
- [ ] Each project has its own web app registered
- [ ] Firestore enabled in both (separate databases)
- [ ] Storage enabled in both (separate buckets)
- [ ] Security rules deployed to both
- [ ] Firestore indexes created in both
- [ ] Correct env vars set for each environment in Vercel

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

Content is managed through the admin dashboard. To promote content from staging to production:

1. The admin dashboard for production (separate admin deployment) manages production content
2. There is no automatic sync between staging and production Firestore
3. Content must be entered/approved in the production admin separately

---

## Canary and preview deployments

Every pull request on Vercel gets a unique preview URL. These preview deployments use the **staging** Firebase project by default. This is set via Vercel's "Preview" environment scope.

---

## Environment detection in code

```ts
// src/lib/env/index.ts
export const isProduction = env.NEXT_PUBLIC_APP_ENV === 'production';
export const isStaging = env.NEXT_PUBLIC_APP_ENV === 'staging';
export const isDevelopment = env.NEXT_PUBLIC_APP_ENV === 'development';
```

Use these flags only for logging or non-critical behaviour differences. Never gate content on env flags.
