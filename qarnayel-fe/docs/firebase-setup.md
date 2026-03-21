# Firebase Setup Guide

## Overview

This project uses a **single Firebase project** for both local development and production. There is one Firestore database (the default). When you are ready to add a staging environment later, you can create a second named database inside the same project — no second project needed.

---

## Step 1: Create the Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**
3. Name it something general (e.g. `qarnayel` or `qarnayel-app`) — avoid environment names in the project name
4. Enable Google Analytics if desired (optional)

---

## Step 2: Register a web app

1. In the project, go to **Project settings** → **Your apps** → **Add app** → **Web**
2. Name the app `qarnayel-public-web`
3. Do **not** enable Firebase Hosting (the site is deployed on Vercel)
4. Copy the config object shown:

```js
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

Open `.env.local` and paste each value into the matching variable. See [environment-setup.md](./environment-setup.md).

---

## Step 3: Enable Firestore

1. **Firestore Database** → **Create database**
2. Region: `me-central1` (Middle East — Doha)
3. Started in **test mode** — replace rules with the production rules in Step 5 before going live

---

## Step 4: Enable Storage

1. **Storage** → **Get started**
2. Region: `me-central1` (same as Firestore)
3. Started in **test mode** — replace rules with the production rules in Step 6 before going live

---

## Step 5: Set Firestore security rules

These rules support **both** the public website (read-only, published content) and the admin dashboard (authenticated full access). Apply them in the Firebase Console under **Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isPublished() {
      return resource.data.status == 'published';
    }

    match /places/{id} {
      allow read: if isPublished() || isAuthenticated();
      allow write: if isAuthenticated();
    }

    match /pageContent/{id} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /siteSettings/{id} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

> **Public website** — only sees `published` content. Drafts and archived documents are never exposed to unauthenticated clients.
> **Admin dashboard** — authenticated Firebase Auth users have full read/write access.

---

## Step 6: Set Storage security rules

In **Storage → Rules**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;                        // public read for download URLs
      allow write: if request.auth != null        // authenticated admin writes only
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## Step 7: Create Firestore indexes

In **Firestore → Indexes → Composite**, add:

### `places` collection

| Fields | Order |
|---|---|
| `status` ASC + `featured` ASC | Homepage featured query |
| `status` ASC + `category` ASC | Category filter |
| `status` ASC + `placeType` ASC | Type filter |

---

## Step 8: Seed initial data

Instead of manually creating documents in the Firebase Console, run the seed script:

```powershell
# First, download a service account key (see below), then:
npm run seed
```

### Getting a service account key

1. Firebase Console → **Project settings** → **Service accounts**
2. Click **Generate new private key** → download the JSON file
3. Save it as `scripts/serviceAccountKey.json` (this file is gitignored)

The seed script populates: `siteSettings`, `pageContent` (history), and sample `places`.

> **Delete or disable the seed script** after seeding production — it should only run once per environment.

---

## Firestore collections summary

| Collection | Description |
|---|---|
| `places` | Place documents |
| `pageContent` | Static page content (history + admin-created pages) |
| `siteSettings` | Single document with ID `global` |

---

## Emulator (optional, for offline development)

```powershell
npm install -g firebase-tools
firebase init emulators   # enable Firestore + Storage
firebase emulators:start
```

Set in `.env.local`:
```
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

---

## Related docs

- [environment-setup.md](./environment-setup.md)
- [firebase-storage-guide.md](./firebase-storage-guide.md)
- [staging-vs-production.md](./staging-vs-production.md)
