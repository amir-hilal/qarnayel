# Qarnayel Public Website — Project Overview

## What is this project?

This is the **public-facing website** for Qarnayel (قرنايل), a mountain village in Lebanon. The website presents the town's attractions, services, history, and local character to visitors and residents in both Arabic and English.

This is **not** the admin dashboard. The admin dashboard is a separate project. No content editing, authentication, or admin logic belongs here.

---

## Purpose

- Showcase Qarnayel's forests, lakes, landmarks, restaurants, shops, pharmacies, salons, and other places
- Present the town's history and heritage
- Provide practical contact and location information for places
- Serve visitors with accurate, accessible, bilingual content
- Be the primary digital presence for the town

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| Styling | Plain CSS |
| Database | Firebase Firestore (read-only) |
| Media storage | Firebase Storage (read-only) |
| Hosting | TBD (Vercel recommended) |
| Environments | Staging + Production |

---

## Supported locales

| Code | Language | Direction |
|---|---|---|
| `ar` | Arabic | RTL |
| `en` | English | LTR |

Both locales are supported from day one. Arabic is the primary locale.

---

## Pages

| URL | Description |
|---|---|
| `/[locale]/` | Homepage with hero, CTAs, featured places, town intro |
| `/[locale]/places` | All published places, filterable by category and type |
| `/[locale]/places/[slug]` | Individual place detail page |
| `/[locale]/history` | Town history and heritage |
| `/[locale]/contact` | Contact page |

---

## Domain model summary

- **Place**: Central content entity. Supports placeType (attraction/service), category (forest, lake, restaurant, etc.), bilingual content, images, contact info, and resource links
- **PageContent**: CMS-managed content for static pages (History, Contact)
- **SiteSettings**: Global site configuration (hero text, CTAs, contact info)

---

## Key architectural decisions

1. **Firebase SDK only in repositories** — components never call Firestore directly
2. **Published-only reads** — all public queries filter by `status == 'published'`
3. **No admin code** — no authentication, no write operations, no edit UI
4. **Bilingual data model** — content fields are `{ ar: string; en: string }` objects, not separate collections
5. **One Firebase project, two environments** — staging uses a named Firestore database (`staging`); production uses the default database
6. **Server Components by default** — `'use client'` is used sparingly

---

## Project structure reference

See [architecture.md](./architecture.md) for the full folder structure.

## Related documentation

- [architecture.md](./architecture.md)
- [routing-plan.md](./routing-plan.md)
- [content-model.md](./content-model.md)
- [firebase-setup.md](./firebase-setup.md)
- [environment-setup.md](./environment-setup.md)
- [i18n-setup.md](./i18n-setup.md)
- [deployment.md](./deployment.md)
- [manual-setup-checklist.md](./manual-setup-checklist.md)
