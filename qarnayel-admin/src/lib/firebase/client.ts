import { env } from '@/lib/env';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from 'firebase/firestore';
import {
  connectStorageEmulator,
  getStorage,
  type FirebaseStorage,
} from 'firebase/storage';

// =============================================================================
// Firebase app singleton — safe for client and server side usage in Next.js
// Named-database aware: reads NEXT_PUBLIC_FIRESTORE_DATABASE_ID from env.
// =============================================================================

function createFirebaseApp(): FirebaseApp {
  const firebaseConfig = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0] as FirebaseApp;
}

const app: FirebaseApp = createFirebaseApp();

// ---------------------------------------------------------------------------
// Firestore — named database selection
// If NEXT_PUBLIC_FIRESTORE_DATABASE_ID is set and non-empty, use that named
// database. Otherwise, use the default Firestore database (production).
// ---------------------------------------------------------------------------
const databaseId = env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID;

export const db: Firestore = databaseId
  ? getFirestore(app, databaseId)
  : getFirestore(app);

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------
export const storage: FirebaseStorage = getStorage(app);

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const auth: Auth = getAuth(app);

// ---------------------------------------------------------------------------
// Connect to emulators in development when flag is set
// ---------------------------------------------------------------------------
if (env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR && typeof window !== 'undefined') {
  const win = window as typeof window & { __emulatorConnected?: boolean };
  if (!win.__emulatorConnected) {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectAuthEmulator(auth, 'http://localhost:9099');
    win.__emulatorConnected = true;
    if (process.env.NODE_ENV === 'development') {
      console.info('[firebase/client] Connected to Firebase emulators');
    }
  }
}
