# Publishing Workflow

## Status values

| Status | Description |
|---|---|
| `draft` | In progress, not publicly visible |
| `published` | Visible on the public website |
| `archived` | Hidden from public, retained for records |

## Allowed transitions

| From | To | Condition |
|---|---|---|
| `draft` | `published` | Translation completeness check must pass |
| `draft` | `archived` | Always allowed |
| `published` | `draft` | Always allowed |
| `published` | `archived` | Confirm dialog required |
| `archived` | `draft` | Always allowed (restore) |
| `archived` | `published` | Translation completeness check must pass |

## Translation completeness requirement

A document cannot be published unless ALL required bilingual fields have content in BOTH Arabic and English.

**Required for places:**
- `title.ar` and `title.en`
- `shortDescription.ar` and `shortDescription.en`
- `description.ar` and `description.en`
- `seo.ar.title`, `seo.ar.description`
- `seo.en.title`, `seo.en.description`

The Publish button is disabled and a validation summary is shown when any required field is missing in either locale.

## Save as Draft

- Saving as draft does NOT require translation completeness
- Partial bilingual content is allowed in draft mode
- Always saves with `updatedAt: serverTimestamp()`

## Publish action

1. User fills in required fields
2. User clicks "Publish"
3. `checkTranslationCompleteness(values)` runs
4. If incomplete: validation summary shown, action blocked
5. If complete: status set to `published`, `updatedAt` updated in Firestore

## Archive action

1. User clicks "Archive"
2. Confirm dialog appears: "Are you sure you want to archive this place? It will no longer appear on the public website."
3. User confirms
4. Status set to `archived`, `updatedAt` updated

## Restore from archive

1. From the places list, click on an archived item
2. Edit the item or click "Restore to Draft"
3. Status set to `draft` — item is now editable again
4. Can be published again after passing translation completeness check

## Visual feedback

- Save Draft: success toast "Draft saved"
- Publish: success toast "Published successfully"
- Archive: success toast "Place archived"
- Restore: success toast "Restored to draft"
- Error: error toast with message

## Admin list view

The admin list shows all statuses. Use visual `StatusBadge` components:
- `draft` → grey badge
- `published` → green badge
- `archived` → muted orange badge

The public website only reads documents where `status === 'published'`.
