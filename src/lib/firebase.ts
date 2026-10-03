import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAxdGeMMgQlO01W1tyXTQTqAljUusIanvM",
  authDomain: "mmn-app.firebaseapp.com",
  projectId: "mmn-app",
  storageBucket: "mmn-app.firebasestorage.app",
  messagingSenderId: "607236344251",
  appId: "1:607236344251:web:7dbf6f01efb8d2ffd11c9e"
};

const isConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.length > 0,
)

export const firebaseReady = isConfigured

let app: FirebaseApp | null = null
let db: Firestore | null = null

if (isConfigured) {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
}

export { app, db }

export function requireDb(): Firestore {
  if (!db) {
    throw new Error(
      'Firebase is not configured. Add your keys to .env and restart the dev server.',
    )
  }
  return db
}
