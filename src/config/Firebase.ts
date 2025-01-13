import admin from "firebase-admin";
import { serviceAccountKey } from "./ServiceAccountKey";

// Convert the service account key object to the required format
const serviceAccount = JSON.parse(JSON.stringify(serviceAccountKey));

// Initialize Firebase Admin if it hasn't been initialized yet
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export the initialized admin instance
export const firebaseAdmin = admin;
export default admin;
