# Qarnayel Public Website — GitHub Copilot Instructions

This is the **public-facing website** for Qarnayel, Lebanon.
It is built with Next.js (App Router), TypeScript, Firebase (Firestore + Storage), and CSS.
The admin dashboard is a **separate project**. Never generate admin or editing logic here.

---

## Project identity

- **Framework**: Next.js with App Router (no Pages Router)
- **Language**: TypeScript strict mode — `any` is forbidden
- **Styling**: Plain CSS only — no Tailwind, no CSS-in-JS
- **Database**: Firebase Firestore (read-only from the public website)
- **Media**: Firebase Storage (public read URLs, no upload logic here)
- **i18n**: Arabic + English bilingual, RTL-ready
- **Environments**: `staging` and `production` (separate Firebase projects)

---

## Active instruction files

All detailed rules live in `.github/instructions/`. These files are active for every Copilot suggestion in this workspace:

| File                               | Scope                                                      |
| ---------------------------------- | ---------------------------------------------------------- |
| `architecture.instructions.md`     | Folder layout, module boundaries, composition rules        |
| `coding-standards.instructions.md` | TypeScript, naming, no-any, constants, zod                 |
| `firebase.instructions.md`         | SDK access rules, repositories, converters, env separation |
| `i18n.instructions.md`             | Bilingual content, LocalizedText, RTL, locale helpers      |
| `content-model.instructions.md`    | Domain types, Firestore schema, published-only reads       |
| `ui-accessibility.instructions.md` | Semantic HTML, ARIA, safe links, loading/error states      |
| `seo-routing.instructions.md`      | Metadata helpers, canonical, locale-aware SEO              |

---

## Non-negotiable rules

1. Never place Firebase SDK calls inside React components.
2. Never use `any`.
3. Never hard-code secrets, API keys, or Firebase credentials.
4. Never generate admin/edit/CMS logic in this project.
5. Never use Tailwind.
6. Never create flat, unorganised file structures.
7. Never invent historical facts — add `// TODO: verify` markers instead.
8. Always read the relevant instruction file before implementing a feature.
9. Always keep route files thin — route files delegate to feature view-models or server fetch functions.
10. Always use `LocalizedText` for any user-visible text that must appear in Arabic and English.
