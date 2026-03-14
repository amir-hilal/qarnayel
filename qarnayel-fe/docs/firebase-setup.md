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
2. Choose **Production mode** (rules are set in Step 5)
3. Region: `europe-west1` (closest to Lebanon)

---

## Step 4: Enable Storage

1. **Storage** → **Get started**
2. Choose **Production mode**
3. Use the same region as Firestore

---

## Step 5: Set Firestore security rules

The public website is **read-only**. Apply these rules in the Firebase Console under **Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /places/{id} {
      allow read: if resource.data.status == 'published';
      allow write: if false;
    }

    match /history/{id} {
      allow read: if resource.data.status == 'published';
      allow write: if false;
    }

    match /pageContent/{id} {
      allow read: if true;
      allow write: if false;
    }

    match /siteSettings/{id} {
      allow read: if true;
      allow write: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Step 6: Set Storage security rules

In **Storage → Rules**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /places/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
    match /{allPaths=**} {
      allow read, write: if false;
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

### `history` collection

| Fields | Order |
|---|---|
| `status` ASC + `order` ASC | History list |

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

The seed script populates: `siteSettings`, `pageContent` (about + contact), sample `places`, and sample `history` entries.

> **Delete or disable the seed script** after seeding production — it should only run once per environment.

---

## Firestore collections summary

| Collection | Description |
|---|---|
| `places` | Place documents |
| `history` | History entry documents |
| `pageContent` | Static page content (about, contact) |
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
