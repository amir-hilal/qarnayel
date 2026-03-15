---
applyTo: 'src/lib/firebase/**,src/features/*/repositories/**,src/features/*/mappers/**'
---

# Firebase Admin Patterns Instructions

## One Firebase project, multi-environment strategy

- There is **one** Firebase project shared across all environments
- All environments (`development`, `staging`, `production`) use the same Firebase credentials
- Environment isolation is achieved via **named Firestore databases**:
  - `production` → uses the **default** Firestore database (omit database ID)
  - `staging` → uses the Firestore named database `staging`
  - `development` → may use `staging` database or the emulator
- `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` controls which database is selected at runtime
- Firebase Storage bucket is shared across environments

## Firebase initialization

- Firebase app is a singleton — initialized once and reused
- Firestore DB instance is created via `getFirestore(app, databaseId)` where `databaseId` comes from the env
- If `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` is empty or unset, the default database is used
- Never hardcode `'staging'` or `'(default)'` — read from env only

```ts
// Correct pattern:
const databaseId = env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID || undefined;
export const db: Firestore = databaseId
  ? getFirestore(app, databaseId)
  : getFirestore(app);
```

## Repository pattern

- All Firestore read and write operations must live in `features/{domain}/repositories/`
- Never call `getDocs`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `addDoc` inside components or forms
- Repository functions are async and return typed domain models (via mappers)
- Pattern for all repositories:

```ts
// Read
export async function fetchAllPlaces(): Promise<Place[]> { ... }
export async function fetchPlaceById(id: string): Promise<Place | null> { ... }

// Write
export async function createPlace(data: PlaceFormValues): Promise<string> { ... }
export async function updatePlace(id: string, data: Partial<PlaceFormValues>): Promise<void> { ... }
export async function archivePlace(id: string): Promise<void> { ... }
```

## Mappers

- Mappers convert raw Firestore documents (`Record<string, unknown>`) to typed domain models
- Always run the raw data through a zod schema in the mapper using `safeParse`
- Return `null` on parse failure (log error in development only)
- Coerce Firestore Timestamps to ISO strings using `coerceTimestampToString`
- Never return raw `DocumentData` or unvalidated objects

## Collection references

- All `collection()` and `doc()` calls must live in `lib/firebase/collections.ts`
- Use the exported reference helpers in repositories — never call `collection(db, 'collectionName')` inline
- Collection names come from `config/collections.ts` constants

## Storage operations

- All Firebase Storage operations live in `features/media/repositories/` or `lib/firebase/storage.ts`
- Never call `uploadBytes`, `getDownloadURL`, `deleteObject` inside form or UI components
- Upload paths follow the convention: `{collection}/{documentId}/{filename}`
- Store the `downloadURL` and `storagePath` in Firestore via a `MediaReference` object
- Never store the raw `File` object in Firestore

## Write operations — admin only

- All write operations (`setDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `uploadBytes`) are admin-only
- The public website never writes to Firestore or Storage
- Admin repositories must use `serverTimestamp()` for `createdAt` / `updatedAt` fields
- Use `FieldValue.serverTimestamp()` not `new Date().toISOString()` for timestamps in writes

## Security

- Firestore security rules must enforce auth and role checks server-side
- Never trust client-side role checks alone for destructive operations
- Never hardcode credentials or service account keys in code files
- Use `.env.local` for local secrets — never commit `.env.local`
- Admin SDK (service account) must only run in server-side code, never in client bundles
