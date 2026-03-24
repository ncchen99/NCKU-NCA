import {
  initializeApp,
  getApps,
  cert,
  type ServiceAccount,
  type App,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getServiceAccount(): ServiceAccount | undefined {
  const base64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;
  if (!base64) return undefined;
  try {
    return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  } catch {
    console.error("Failed to parse Firebase Admin service account");
    return undefined;
  }
}

let _app: App | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;

function getAdminApp(): App {
  if (_app) return _app;

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Firebase Admin SDK not configured. Set FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 env var."
    );
  }

  _app =
    getApps().length === 0
      ? initializeApp({ credential: cert(serviceAccount) })
      : getApps()[0];

  return _app;
}

export function getAdminAuth(): Auth {
  if (!_auth) _auth = getAuth(getAdminApp());
  return _auth;
}

export function getAdminDb(): Firestore {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}
