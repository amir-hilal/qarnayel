# Qarnayel Admin Dashboard — Project Overview

## Purpose

This is the **admin dashboard** for the Qarnayel public website. It is the **only** interface authorised to create, edit, publish, archive, and manage all website content. The public website is a separate read-only project.

## Tech stack

| Concern | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript (strict mode) |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Auth | Firebase Authentication |
| Styling | Plain CSS (no Tailwind) |
| Validation | Zod |
| Forms | React Hook Form + Zod resolver |
| i18n | Arabic + English bilingual content management |

## Content domains managed

- **Places** — forests, lakes, restaurants, shops, pharmacies, salons, landmarks, and other types
- **History** — single-page content for the Qarnayel history page (title, body, SEO)
- **Page Content** — static page documents: History, Contact
- **Media** — image upload and metadata management
- **Site Settings** — global CTAs, contact details

## Bilingual content model

All user-visible content fields are stored in both Arabic and English using the `LocalizedText` type:

```ts
type LocalizedText = { ar: string; en: string };
```

Both languages are mandatory before a document can be published.

## Environment strategy

One Firebase project is used across all environments. See `docs/environment-setup.md` and `docs/staging-vs-production.md` for details.

## Related project

The **public website** lives in the `qarnayel-fe` directory. It reads published content from the same Firebase project. The admin app writes content; the public app reads it. They are intentionally separate projects.
