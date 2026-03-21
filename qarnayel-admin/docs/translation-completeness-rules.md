# Translation Completeness Rules

## Principle

Every content document that serves the public website must have content in **both Arabic and English** before it can be published. The admin dashboard enforces this rule at the point of publishing.

## Required bilingual fields

### Places

| Field | Arabic required | English required |
|---|---|---|
| `title` | ✅ | ✅ |
| `shortDescription` | ✅ | ✅ |
| `description` | ✅ | ✅ |
| `seo.title` | ✅ | ✅ |
| `seo.description` | ✅ | ✅ |
| `subtitle` | Optional | Optional |
| `contact.address` | Optional | Optional |
| `resources[].label` | Optional | Optional |
| `images[].altText` | Optional | Optional |

### Page content (History, About, Contact)

| Field | Arabic required | English required |
|---|---|---|
| `title` | ✅ | ✅ |
| `body` | ✅ | ✅ |
| `seo.title` | ✅ | ✅ |
| `seo.description` | ✅ | ✅ |

## Validation implementation

The `checkTranslationCompleteness` function in `features/shared/validation/translation-completeness.ts` returns:

```ts
type TranslationCompletenessResult = {
  isComplete: boolean;
  missingFields: {
    locale: 'ar' | 'en';
    fieldPath: string;
    label: string;
  }[];
};
```

This is called:
1. Before the Publish button becomes active (form validation)
2. In the repository before writing `status: 'published'` to Firestore

## UI enforcement

- The **Publish** button is disabled when `isComplete === false`
- A `ValidationSummary` component shows the list of missing fields grouped by locale
- Example message: "Arabic fields are incomplete: title, description"
- Per-field inline error messages highlight the empty fields in the form

## Repository enforcement

The `publishPlace()` repository function also runs the completeness check server-side:

```ts
export async function publishPlace(id: string): Promise<void> {
  const place = await fetchPlaceById(id);
  if (!place) throw new Error('Place not found');
  const check = checkTranslationCompleteness(place);
  if (!check.isComplete) {
    throw new Error(`Cannot publish: missing fields in ${check.missingFields.map(f => f.fieldPath).join(', ')}`);
  }
  // proceed with publish
}
```

## Draft save exception

Saving as `draft` bypasses the translation completeness check. Partial bilingual content is allowed in drafts. This enables content editors to save work-in-progress content without being blocked.
