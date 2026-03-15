---
applyTo: 'src/features/*/forms/**,src/features/shared/forms/**'
---

# Form Patterns Instructions

## Architecture

- Form components live in `features/{domain}/forms/`
- Shared field group primitives live in `features/shared/forms/`
- Never put form submission logic (Firebase writes) inside form components
- Form components receive `onSubmit(values: FormValues)` as a prop and are agnostic to persistence
- All forms use React Hook Form with `zodResolver`

## Form section pattern

Large forms (like the place form) must be split into named sections:

```
features/places/forms/
  PlaceForm.tsx              # Root form — assembles sections, handles submit
  sections/
    BasicInfoSection.tsx     # slug, placeType, category, contactMode, featured
    LocalizedContentSection.tsx  # title, subtitle, shortDescription, description (bilingual)
    ContactSection.tsx       # phone, email, whatsapp, website
    LocationSection.tsx      # mapUrl, lat, lng, address
    MediaSection.tsx         # image picker/uploader
    ResourcesSection.tsx     # resource links (label, url)
    SeoSection.tsx           # seo.ar, seo.en
    PublishSection.tsx       # status, submit/save actions
```

## Shared form primitives

```
features/shared/forms/
  LocalizedTextField.tsx        # Single-line bilingual field (ar + en)
  LocalizedTextareaField.tsx    # Multi-line bilingual field
  BilingualSection.tsx          # Wrapper that renders ar/en field pairs side by side
  FormFieldError.tsx            # Displays a field error message
  FormSection.tsx               # Section wrapper with heading and divider
  ValidationSummary.tsx         # Shows all form errors in one list
  ConfirmDialog.tsx             # Destructive action confirmation pattern
  StatusSelect.tsx              # Publish status selector
```

## Bilingual field rules

- Bilingual fields always render both `ar` and `en` inputs together
- `ar` input has `dir="rtl"` and uses `--font-arabic`
- `en` input has `dir="ltr"` and uses `--font-latin`
- Label pattern: use a locale-aware label prefix (e.g. `العربية — Title` / `English — Title`)
- Field names follow dot notation: `title.ar`, `title.en`, `seo.ar.title`, etc.

## Validation rules

- Zod form schema lives in `features/{domain}/schemas/{domain}Form.schema.ts`
- Use `zodResolver(schema)` from `@hookform/resolvers/zod`
- For publish, run `checkTranslationCompleteness(values)` BEFORE allowing status change
- Show validation errors inline below each field via `FormFieldError`
- Show a `ValidationSummary` near the submit button

## Unsaved changes

- Warn the user before navigating away with unsaved changes
- Use React Hook Form's `formState.isDirty` for detecting unsaved changes
- Show a browser-native `beforeunload` confirmation or a custom confirm dialog

## Destructive actions

- Archive, delete, and status-change-to-archived must show a `ConfirmDialog` before executing
- Confirm dialogs must describe the action clearly and label the confirm button with the action name (not just "OK")

## Feedback

- All async form submissions must show a loading state (disable submit button, show spinner)
- On success, show a success toast
- On error, show an error toast with a human-readable message
- Never silently fail on form submission errors

## Field registration

- Every form field must be registered with React Hook Form — no uncontrolled inputs mixed with RHF
- Use `Controller` for custom or complex field components
- Use `register()` for simple native inputs

## Form values vs domain model

- Forms work with `PlaceFormValues` (no `id`, `createdAt`, `updatedAt`)
- The repository layer converts `PlaceFormValues` to the Firestore write object
- Never pass the raw domain `Place` model directly to the form without stripping system fields
