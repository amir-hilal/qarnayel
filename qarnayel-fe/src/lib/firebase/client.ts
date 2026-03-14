import { env } from '@/lib/env';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
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

// ---------------------------------------------------------------------------
// Firebase app singleton — safe for client and server side usage in Next.js
// ---------------------------------------------------------------------------

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
// Firestore
// ---------------------------------------------------------------------------
export const db: Firestore = getFirestore(app);

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------
export const storage: FirebaseStorage = getStorage(app);

// ---------------------------------------------------------------------------
// Connect to emulators in development when flag is set
// This block only runs once due to the singleton pattern above
// ---------------------------------------------------------------------------
if (env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR && typeof window !== 'undefined') {
  // Guards against hot-reload re-connecting
  const win = window as typeof window & { __emulatorConnected?: boolean };
  if (!win.__emulatorConnected) {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    win.__emulatorConnected = true;
    if (process.env.NODE_ENV === 'development') {
      console.info('[firebase/client] Connected to Firebase emulators');
    }
  }
}
