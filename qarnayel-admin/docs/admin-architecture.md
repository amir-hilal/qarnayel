# Admin Architecture

## Guiding principles

1. **Domain-driven structure** — code is organised by feature/domain, not by type
2. **Thin routes** — `app/**/page.tsx` files delegate to features immediately
3. **Repository pattern** — all Firestore and Storage access is encapsulated in repository functions
4. **Mapper pattern** — raw Firestore documents are converted to typed domain models before touching any component
5. **Strict TypeScript** — `any` is forbidden; every value has a known type
6. **Server-first** — components are Server Components by default; `'use client'` is the exception
7. **Write isolation** — all write operations live in repositories only; no Firestore SDK calls in components or forms
8. **Status-aware reads** — admin lists show all statuses; public website reads only `published`
9. **Nav auto-sync** — publishing or drafting a `pageContent` page automatically calls `syncNavItemForPage()`, which adds or removes the page from `siteSettings/global.navItems`. The admin can also manually reorder nav items via the `NavManager` (Admin → Pages).
9. **Aligned conventions** — this project follows the same architectural conventions as the public `qarnayel-fe` project

---

## Folder structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx               # Admin shell: sidebar + header
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── places/
│   │   │   ├── page.tsx             # Places list
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── pages/
│   │   │   ├── page.tsx             # Pages list + Navigation Order section
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Create new page
│   │   │   └── [slug]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── media/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── layout.tsx                   # Root layout
│   ├── not-found.tsx
│   └── error.tsx
├── config/
│   ├── constants.ts                 # All magic strings (enums, status values)
│   ├── routes.ts                    # ADMIN_ROUTES path helpers
│   ├── collections.ts               # Firestore collection name constants
│   └── locales.ts                   # Locale constants
├── features/
│   ├── places/
│   │   ├── forms/
│   │   │   ├── NewPlaceForm.tsx
│   │   │   └── EditPlaceForm.tsx
│   │   ├── repositories/
│   │   ├── mappers/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── constants/
│   │   └── utils/
│   ├── pages/
│   │   ├── components/
│   │   │   └── NavManager/
│   │   │       ├── NavManager.tsx  # DnD pages list: nav order + status changes
│   │   │       └── NavManager.css
│   │   ├── forms/
│   │   │   ├── NewPageContentForm.tsx
│   │   │   └── EditPageContentForm.tsx
│   │   ├── repositories/
│   │   ├── mappers/
│   │   ├── schemas/
│   │   └── types/
│   ├── media/
│   │   ├── repositories/
│   │   ├── mappers/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── utils/
│   ├── settings/
│   │   ├── forms/
│   │   │   └── SettingsForm.tsx
│   │   ├── repositories/
│   │   ├── mappers/
│   │   ├── schemas/
│   │   └── (no types/ — uses global types)
│   └── shared/
│       ├── components/
│       │   ├── AdminHeader/
│       │   │   ├── AdminHeader.tsx
│       │   │   └── AdminHeader.css
│       │   ├── Sidebar/
│       │   │   ├── Sidebar.tsx
│       │   │   └── Sidebar.css
│       │   ├── EmptyState/
│       │   │   ├── EmptyState.tsx
│       │   │   └── EmptyState.css
│       │   ├── StatusBadge/
│       │   │   ├── StatusBadge.tsx
│       │   │   └── StatusBadge.css
│       │   └── Toast/
│       │       ├── Toast.tsx
│       │       └── Toast.css
│       ├── forms/
│       │   ├── FormSection/
│       │   │   ├── FormSection.tsx
│       │   │   └── FormSection.css
│       │   ├── BilingualSection/
│       │   │   ├── BilingualSection.tsx
│       │   │   └── BilingualSection.css
│       │   ├── ConfirmDialog/
│       │   │   ├── ConfirmDialog.tsx
│       │   │   └── ConfirmDialog.css
│       │   ├── FormFieldError.tsx
│       │   ├── LocalizedTextField.tsx
│       │   ├── LocalizedTextareaField.tsx
│       │   ├── StatusSelect.tsx
│       │   └── ValidationSummary.tsx
│       └── validation/
│           └── translation-completeness.ts
├── lib/
│   ├── env/index.ts
│   ├── firebase/
│   │   ├── client.ts
│   │   ├── collections.ts
│   │   └── storage.ts
│   ├── i18n/
│   ├── auth/
│   ├── permissions/
│   ├── preview/
│   └── validation/
├── styles/
│   ├── tokens.css            # All CSS custom properties (:root)
│   ├── reset.css             # Browser reset + base HTML element styles
│   ├── buttons.css           # .btn and all variants
│   ├── forms.css             # .form-field, .form-actions
│   ├── feedback.css          # .alert and variants
│   ├── animations.css        # @keyframes skeleton-shimmer, .skeleton
│   ├── utilities.css         # .visually-hidden, .truncate
│   ├── admin-layout.css      # .admin-shell grid, .admin-content
│   ├── admin-patterns.css    # .admin-page-header, .admin-card, .admin-table, .stat-card
│   ├── globals.css           # (legacy placeholder — do not add styles here)
│   └── admin.css             # (legacy placeholder — do not add styles here)
└── types/
    └── index.ts
```

---

## Data flow

```
Admin Form
  ↓ submits PlaceFormValues
Repository (features/{domain}/repositories/)
  ↓ writes to Firestore
Firestore (places collection, staging or production DB)
  ↓
Repository (read)
  ↓ raw DocumentData
Mapper (features/{domain}/mappers/)
  ↓ via Zod schema
Domain model (features/{domain}/types/)
  ↓
Page / Component
```

---

## Module dependency rules

```
app/           → features/, lib/
features/      → lib/, shared/ (within features/)
lib/           → (no imports from features/)
config/        → (no imports — constants only)
types/         → (no imports — types only)
```

---

## Component responsibility matrix

| Layer | Fetches data | Writes data | Renders UI | Has state |
|---|---|---|---|---|
| `app/**/page.tsx` | ✅ (server read) | ❌ | ❌ | ❌ |
| `features/*/components/` | ❌ | ❌ | ✅ | Sometimes |
| `features/*/forms/` | ❌ | ❌ | ✅ | ✅ (form) |
| `features/*/repositories/` | ✅ | ✅ | ❌ | ❌ |
| `features/*/mappers/` | ❌ | ❌ | ❌ | ❌ |
