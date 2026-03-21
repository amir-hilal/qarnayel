# Qarnayel Admin Dashboard — GitHub Copilot Instructions

This is the **admin dashboard** for the Qarnayel website.
It is built with Next.js (App Router), TypeScript, Firebase (Firestore + Storage), and plain CSS.
The public website is a **separate project**. Never generate public-facing display logic here.
This is the ONLY interface allowed to create, edit, update, archive, and manage website content.

---

## Project identity

- **Framework**: Next.js with App Router (no Pages Router)
- **Language**: TypeScript strict mode — `any` is forbidden
- **Styling**: Plain CSS only — no Tailwind, no CSS-in-JS
- **Database**: Firebase Firestore (read + write — admin only)
- **Media**: Firebase Storage (upload and manage from here)
- **i18n**: Arabic + English bilingual content management, RTL-ready
- **Environments**: One shared Firebase project; `staging` named database for non-production; default database for production
- **Auth**: Firebase Auth (placeholder wiring for now — see `lib/auth/`)

---

## Active instruction files

All detailed rules live in `.github/instructions/`. These files are active for every Copilot suggestion in this workspace:

| File                                      | Scope                                                |
| ----------------------------------------- | ---------------------------------------------------- |
| `admin-architecture.instructions.md`      | Folder layout, module boundaries, domain structure   |
| `coding-standards.instructions.md`        | TypeScript, naming, no-any, constants, zod           |
| `firebase-admin-patterns.instructions.md` | Firebase init, named DB, repositories, Storage       |
| `i18n.instructions.md`                    | Bilingual content, LocalizedText, RTL, validation    |
| `content-schema.instructions.md`          | Domain types, Firestore schema, published-only reads |
| `form-patterns.instructions.md`           | Form architecture, field groups, validation          |
| `publishing-workflow.instructions.md`     | Publish/draft/archive, translation completeness      |
| `auth-and-permissions.instructions.md`    | Role placeholders, permission layers                 |
| `styling.instructions.md`                 | Plain CSS, design tokens, BEM, admin conventions     |

---

## Non-negotiable rules

1. Never place Firebase SDK calls inside React components.
2. Never use `any`.
3. Never hard-code secrets, API keys, or Firebase credentials.
4. Never generate public-website display logic in this project.
5. Never use Tailwind.
6. Never create flat, unorganised file structures.
7. Never invent historical facts — add `// TODO: verify` markers instead.
8. Always read the relevant instruction file before implementing a feature.
9. Always keep route files thin — route files delegate to feature view-models or server fetch functions.
10. Always use `LocalizedText` for any user-visible text that must appear in Arabic and English.
11. Always block publish if required Arabic or English fields are missing.
12. Always use the named Firestore database from `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` in non-production environments.
13. Never duplicate bilingual content into separate Firestore collections per language.
14. Always use the repository pattern for all Firestore and Storage operations.
15. Always update `docs/admin-architecture.md` **and** `.github/instructions/admin-architecture.instructions.md` in the same session whenever any file or folder is created, moved, renamed, or deleted.
