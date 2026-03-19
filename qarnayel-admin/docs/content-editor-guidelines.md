# Content Editor Guidelines

## Overview

This guide is for content editors using the Qarnayel admin dashboard to add and manage website content.

## Getting started

1. Go to the admin dashboard URL
2. Sign in with your email and password
3. You will land on the Dashboard home

## Adding a new place

1. Click **Places** in the sidebar
2. Click **New Place**
3. Fill in all required fields (marked with *)
4. Both **Arabic** and **English** versions are required for most fields
5. Click **Save Draft** to save your progress
6. Click **Publish** when the content is complete and ready for the public website

## Required fields for publishing

Before you can publish a place, these fields must be filled in **both Arabic and English**:

- **Title** — the name of the place
- **Short Description** — a 1–2 sentence summary
- **Description** — the full description of the place
- **SEO Title** — used in browser tabs and search results
- **SEO Description** — used in search engine previews

If any of these are missing, the Publish button will be disabled and a summary of missing fields will appear.

## Bilingual content

Every text field has two boxes:
- **العربية** — Arabic content (text flows right-to-left)
- **English** — English content (text flows left-to-right)

Always fill in both before publishing.

## Place categories

| Category | Use for |
|---|---|
| Forest | Natural forest areas |
| Lake | Lakes and water bodies |
| Restaurant | Dining and food places |
| Shop | Retail shops |
| Pharmacy | Pharmacies |
| Salon | Hair and beauty salons |
| Landmark | Important landmarks and monuments |
| Other | Anything that doesn't fit the above |

## Contact mode

| Mode | Use for |
|---|---|
| Guide | Nature attractions where a guide is recommended |
| Owner | Business owners (restaurants, shops, etc.) |
| None | Places with no direct contact |

## Adding images

1. Scroll to the **Media** section in the place form
2. Click **Upload Image** or drag and drop a file
3. Supported formats: JPEG, PNG, WebP
4. Maximum size: 10 MB
5. Add alt text in both Arabic and English for accessibility

## Saving vs Publishing

| Action | What it does |
|---|---|
| Save Draft | Saves your work without making it public |
| Publish | Makes the content live on the public website |
| Archive | Removes from public website but keeps the record |

## Unsaved changes

If you try to leave a page with unsaved changes, you will see a confirmation dialog. Click **Stay** to go back and save, or **Leave** to discard your changes.

## Editing the History page

The history page on the public website is a single piece of content — there are no individual entries to add or delete.

1. Click **History** in the sidebar
2. The editor loads the current history page content directly
3. Fill in the **Title** and **Body** in both Arabic and English
4. Fill in the **SEO Title** and **SEO Description** for both languages
5. Click **Save Draft** to save without publishing, or **Publish** to make it live

The history page content is stored as `pageContent/history` in Firestore. If it does not exist yet when you first open the editor, it is created automatically as a draft. You can also manage or delete it from the **Pages** section.

## Managing pages

The **Pages** section lists all `pageContent` documents (e.g. History, Contact).

- Click **Edit** next to any page to open its editor
- Click **Delete** to permanently remove the document — a confirmation dialog will appear before deletion

> **Note:** Deleting `pageContent/history` means the history page on the public website will render with no content. The History section in the sidebar will re-create it as a blank draft the next time it is opened.

## Previewing

Click the **Preview** button to see how the content will look on the public website. This opens a new tab. Note: draft content will show a "not found" page on the public site until published.
