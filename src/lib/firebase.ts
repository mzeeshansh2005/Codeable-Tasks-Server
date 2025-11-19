import admin from 'firebase-admin';
import config from '../config/config.js';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey?.replace(/\\n/g, '\n'),
      }),
      storageBucket: config.firebase.storageBucket,
    });
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error);
  }
}

export const auth = admin.auth();
export const storage = admin.storage();
export default admin;

