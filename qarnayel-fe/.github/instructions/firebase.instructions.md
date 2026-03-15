---
applyTo: 'src/lib/firebase/**,src/features/**/repositories/**,src/features/**/mappers/**'
---

# Firebase Integration Rules

## SDK access boundary

Firebase SDK calls are **only allowed** in:

```
src/lib/firebase/          ← SDK initialization
src/features/*/repositories/  ← Firestore queries
src/features/*/mappers/       ← Document-to-domain conversion
```

Firebase SDK calls are **forbidden** in:

```
src/app/**                 ← route files
src/features/*/components/ ← UI components
src/features/*/view-models/
src/lib/seo/
src/lib/i18n/
src/config/
```

## Environments — single Firebase project

There is **one Firebase project** shared across all environments. All environments use the same Firebase credentials.

Environment isolation is achieved via:

- A separate Firestore **named database** (`staging`) for non-production environments
- `NEXT_PUBLIC_APP_ENV` to distinguish runtime behaviour (`development`, `staging`, `production`)
- `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` set to `staging` in preview/staging deployments; unset in production (uses the default database)

Never commit actual credentials — use `.env.example` as the template.

## Firebase client initialization

```ts
// src/lib/firebase/client.ts
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { env } from '@/lib/env';

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
```

## Firestore collection names

Always use constants. Never hard-code collection name strings in repository files.

```ts
// src/config/constants.ts
export const COLLECTIONS = {
  PLACES: 'places',
  HISTORY: 'history',
  PAGE_CONTENT: 'pageContent',
  SITE_SETTINGS: 'siteSettings',
} as const;
```

## Repository pattern

Each repository file exports **pure async functions**. No classes required.

```ts
// src/features/places/repositories/places.repository.ts
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/config/constants';
import { toPlace } from '@/features/places/mappers/place.mapper';
import type { Place } from '@/features/places/types';

export async function fetchPublishedPlaces(): Promise<Place[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PLACES),
      where('status', '==', 'published'),
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => toPlace(d.id, d.data()))
      .filter(Boolean) as Place[];
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[places.repository] fetchPublishedPlaces failed', err);
    }
    return [];
  }
}
```

## Mapper pattern

Mappers receive raw Firestore document data (`DocumentData`) and return a typed domain model or `null`.

```ts
// src/features/places/mappers/place.mapper.ts
import { placeSchema } from '@/features/places/schemas/place.schema';
import type { Place } from '@/features/places/types';

export function toPlace(
  id: string,
  raw: Record<string, unknown>,
): Place | null {
  const result = placeSchema.safeParse({ id, ...raw });
  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[place.mapper] parse failed', result.error);
    }
    return null;
  }
  return result.data;
}
```

## Firebase Storage

- Images are **uploaded by the admin project** — this project only reads public URLs
- Storage paths follow the convention: `places/{placeId}/{filename}`
- Media references are stored in Firestore as `{ path: string; url: string; alt: { ar: string; en: string } }`
- Never call `uploadBytes` or any write operation in this project

## Read-only access

The public website has **read-only** access to Firestore. The deployed rules enforce this while also allowing the admin dashboard (authenticated users) full access:

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

    match /history/{id} {
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

    match /media/{id} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Published-only reads

Every public repository query **must** include `where('status', '==', 'published')`.
This is not optional — draft and archived content must never reach the public website.
