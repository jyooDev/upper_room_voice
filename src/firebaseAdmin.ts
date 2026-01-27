import 'dotenv/config';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

const serviceAccountPath = process.env.FIREBASE_ADMIN_KEY;
if (!serviceAccountPath) throw new Error('Missing FIREBASE_ADMIN_KEY env var');

const resolvePath = path.resolve(serviceAccountPath);
const serviceAccountRaw = fs.readFileSync(resolvePath, 'utf-8');
const serviceAccount = JSON.parse(serviceAccountRaw);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
