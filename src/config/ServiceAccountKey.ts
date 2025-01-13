import { FIREBASE_PRIVATE_KEY, FIREBASE_PRIVATE_KEY_ID } from "./CheckableEnv";

export const serviceAccountKey = {
  type: "service_account",
  project_id: "tdm-api-2ce37",
  private_key_id: FIREBASE_PRIVATE_KEY_ID,
  private_key: FIREBASE_PRIVATE_KEY,
  client_email: "firebase-adminsdk-ujg72@tdm-api-2ce37.iam.gserviceaccount.com",
  client_id: "113146846793199925871",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ujg72%40tdm-api-2ce37.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
