
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load .env.local from the web directory
const envPath = path.resolve(__dirname, 'web/.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

async function checkPosts() {
  try {
    const base64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;
    if (!base64) {
      console.error('FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 not found in .env.local');
      return;
    }
    const serviceAccount = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
    
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    const db = admin.firestore();
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
