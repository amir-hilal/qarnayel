---
applyTo: 'src/features/places/**,src/features/shared/validation/**'
---

# Publishing Workflow Instructions

## Status values

```ts
type PublishStatus = 'draft' | 'published' | 'archived';
```

## Allowed transitions

| From        | To          | Conditions                               |
| ----------- | ----------- | ---------------------------------------- |
| `draft`     | `published` | Translation completeness check must pass |
| `draft`     | `archived`  | Always allowed                           |
| `published` | `draft`     | Always allowed                           |
| `published` | `archived`  | Always allowed                           |
| `archived`  | `draft`     | Always allowed (restore)                 |
| `archived`  | `published` | Translation completeness check must pass |

## Translation completeness check

Before any document can transition to `published`, the following must all be non-empty:

**Place required fields:**

- `title.ar` and `title.en`
- `shortDescription.ar` and `shortDescription.en`
- `description.ar` and `description.en`
- `seo.ar.title` and `seo.ar.description`
- `seo.en.title` and `seo.en.description`

**History entry required fields:**

- `title.ar` and `title.en`
- `body.ar` and `body.en`

**Page content required fields:**

- `title.ar` and `title.en`
- `body.ar` and `body.en`
- `seo.ar.title` and `seo.ar.description`
- `seo.en.title` and `seo.en.description`

## Publish gate

- `checkTranslationCompleteness(values): TranslationCompletenessResult` lives in `features/shared/validation/translation-completeness.ts`
- The Publish button must be disabled when the check returns missing fields
- Surface missing localized fields as a grouped validation summary: "Arabic fields: title, description missing"
- The `PublishSection` form component handles this logic

## Repository publish pattern

```ts
// In places.repository.ts
export async function publishPlace(id: string): Promise<void> {
  // 1. Fetch current document
  // 2. Run translation completeness check on server side
  // 3. If check fails, throw with field list
  // 4. setDoc with status: 'published', updatedAt: serverTimestamp()
}
```

## Draft save

- Saving as draft does NOT require translation completeness
- Draft saves allow partial bilingual content
- Always save with `updatedAt: serverTimestamp()`

## Preview workflow

- Preview URL is built by `buildPreviewUrl(slug, locale)` from `lib/preview/index.ts`
- Preview opens the public website's place detail page in a new tab
- Preview button is available in the `PublishSection` form component
- Preview links to the staging public website in non-production environments

## Archive workflow

- Archiving must show a `ConfirmDialog`
- Archiving sets `status: 'archived'` only — never deletes the document
- Archived documents are hidden from the public website automatically (it filters by `status === 'published'`)
- Admin lists show all statuses with visual status badges

## Status badges

Use the `StatusBadge` shared component with these visual conventions:

- `draft` → grey / neutral badge
- `published` → green badge
- `archived` → orange / muted badge
