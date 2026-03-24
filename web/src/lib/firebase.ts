import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp(): FirebaseApp {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

let _auth: Auth | undefined;
let _db: Firestore | undefined;
let _storage: FirebaseStorage | undefined;

export async function getClientAuth(): Promise<Auth> {
  if (!_auth) {
    const { getAuth } = await import("firebase/auth");
    _auth = getAuth(getFirebaseApp());
  }
  return _auth;
}

export async function getClientDb(): Promise<Firestore> {
  if (!_db) {
    const { getFirestore } = await import("firebase/firestore");
    _db = getFirestore(getFirebaseApp());
  }
  return _db;
}

export async function getClientStorage(): Promise<FirebaseStorage> {
  if (!_storage) {
    const { getStorage } = await import("firebase/storage");
    _storage = getStorage(getFirebaseApp());
  }
  return _storage;
}
