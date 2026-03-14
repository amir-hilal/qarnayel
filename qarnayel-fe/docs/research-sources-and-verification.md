# Research Sources and Verification

## Overview

The history section and resource lists on place pages must be based on verifiable, credible sources. This document defines the verification workflow for research content.

---

## ⚠️ Critical notice

> **Historical and factual content must never be invented, assumed, or generated without human verification.**
>
> All history entries and place resource links must reference real, attributable sources. If a fact cannot be sourced, it must not be published.
>
> In code, unverified placeholder facts are marked with `// TODO: verify` comments. These must be resolved before the content is published.

---

## Source types

| Type | Examples | Reliability |
|---|---|---|
| Academic | University papers, academic journals (JSTOR, Google Scholar) | High |
| Government | Lebanese municipalities, Ministry of Culture | High |
| Books | Published Lebanese history books, encyclopaedias | High |
| News archives | An-Nahar, L'Orient Le Jour archives | Medium |
| Local knowledge | Community input, oral history (must be attributed) | Medium, requires cross-check |
| Websites | Wikipedia, travel sites | Low — use as a starting point only |

---

## Verification workflow for history entries

1. **Draft** — Write the history entry with source links
2. **Verify** — Each factual claim must be traceable to a primary or secondary source
3. **Review** — A second person reviews sources and confirms accuracy
4. **Approve** — Mark entry as `status: published` in the admin dashboard
5. **Publish** — Entry appears on the public history page

Do not publish history entries with unverified claims.

---

## Verification workflow for place resources

1. Add resource links in the admin dashboard when creating a place
2. Verify that each linked URL:
   - Is accessible
   - Accurately represents the place
   - Does not contain harmful or misleading content
3. Update resources periodically as URLs can break

---

## TODO markers in code

During development, placeholder content includes `// TODO: verify` markers:

```ts
// History entry title example
const historyEntry = {
  title: { ar: 'العصر البيزنطي', en: 'Byzantine Era' },
  body: {
    ar: '...',
    en: '...',
    // TODO: verify — Byzantine presence in Qarnayel region needs primary source confirmation
  },
};
```

**All TODO markers must be resolved before deploying to production.**

---

## Searching for sources

Recommended starting points for researching Qarnayel and the Metn region:

- Lebanese Municipality of Qarnayel official records
- Lebanese National Heritage Ministry publications
- Encyclopaedia Phoeniciana (if accessible)
- Metn caza historical records
- An-Nahar newspaper digital archive (nahar.com)
- L'Orient Le Jour archive (lorientlejour.com)
- American University of Beirut library resources
- CNRS Lebanon publications

---

## Attribution in the UI

Place resource items and history sources are displayed with their label and a link. Attribution text should be:

- Accurate: reflect the actual source name
- Concise: keep labels short
- Bilingual: provide both Arabic and English labels

Example:
```json
{
  "label": {
    "ar": "موسوعة الفينيقية",
    "en": "Encyclopaedia Phoeniciana"
  },
  "url": "https://..."
}
```

---

## Responsibility

Content accuracy is the responsibility of the content team managing the admin dashboard. The public website displays content as-is from Firestore. Source verification happens before publishing, not at render time.
