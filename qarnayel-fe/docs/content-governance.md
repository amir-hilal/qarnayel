# Content Governance

## Overview

Content governance defines who can create, review, publish, and archive content on the Qarnayel website, and how quality standards are maintained.

---

## Roles

| Role | Responsibilities |
|---|---|
| **Content Author** | Creates drafts for places and pages |
| **Content Reviewer** | Reviews Arabic and English quality, fact-checks sources |
| **Publisher** | Sets `status: published` — has final authority to make content live |
| **Technical Admin** | Manages Firebase projects, deploys code, maintains environment |

---

## Content lifecycle

```
[Draft] → [Under Review] → [Published] → [Archived]
```

- **Draft**: Incomplete or unreviewed content. Not visible on the public website.
- **Under Review**: Content is complete but awaiting verification (managed in admin notes/workflow, not a Firestore status value).
- **Published**: Fully verified, bilingual, sourced content. Visible on the public website.
- **Archived**: Previously published, now removed from public display. Not deleted — kept for historical reference.

---

## Publishing criteria

A place can only be set to `status: published` when:

- [ ] `title.ar` and `title.en` are filled
- [ ] `subtitle.ar` and `subtitle.en` are filled
- [ ] `shortDescription.ar` and `shortDescription.en` are filled (max 150 chars)
- [ ] `description.ar` and `description.en` are filled
- [ ] `seo.ar.title` and `seo.en.title` are filled
- [ ] `seo.ar.description` and `seo.en.description` are filled
- [ ] At least one image is present and has alt text in both languages
- [ ] `placeType` and `category` are correctly set
- [ ] `contactMode` is set appropriately
- [ ] If `contactMode` is `owner`, contact info is present
- [ ] If `contactMode` is `guide`, appropriate guide contact info is documented
- [ ] `slug` is set and unique

---

## Quality standards

### Writing style guidelines

**Arabic:**
- Use Modern Standard Arabic (الفصحى) for formal descriptions
- Colloquial Lebanese Arabic may be used sparingly for local character
- Text should be clear, welcoming, and informative
- Avoid political content

**English:**
- Use clear, accessible English (not overly formal)
- Consistent with tourism/travel writing conventions
- Spell "Qarnayel" consistently (not Qurnayel, Kornayel, etc.)

### Content accuracy

- Description text must accurately represent the place
- Location data (map URLs, coordinates) must be verified
- Contact information must be current and tested

---

## Archiving policy

- Content is archived (not deleted) when a place permanently closes or is no longer relevant
- Archived content disappears from the public website immediately
- Archived documents are kept in Firestore for historical reference

---

## Duplicate prevention

Each place has a unique `slug`. The admin project must enforce slug uniqueness. The public website does not validate slugs — it trusts Firestore contains valid data.

---

## Translation policy

- Both Arabic and English must be written by a fluent speaker
- Do not use machine translation (Google Translate, DeepL) without human review
- Test Arabic text renders correctly in RTL layout before publishing

---

## Review cadence

- Review all published place content annually
- Check all external resource links quarterly (links break)
- Update contact information whenever notified of changes
