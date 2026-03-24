
const { getAdminDb } = require('./web/src/lib/firebase-admin');
const { getApps, initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local from the web directory
dotenv.config({ path: path.resolve(__dirname, 'web/.env.local') });

async function checkPosts() {
  try {
    const base64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;
    if (!base64) {
      console.error('FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 not found in .env.local');
      return;
    }
    const serviceAccount = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
    
    if (getApps().length === 0) {
      initializeApp({ credential: cert(serviceAccount) });
    }
    const db = getFirestore();
    const snapshot = await db.collection('posts').get();
    
    console.log(`Total posts: ${snapshot.size}`);
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- ID: ${doc.id}, Title: ${data.title}, Category: ${data.category}, Status: ${data.status}`);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

checkPosts();
