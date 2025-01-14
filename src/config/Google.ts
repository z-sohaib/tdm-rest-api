import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "./CheckableEnv";

// Simplified OAuth client - only needs client ID for token verification
export const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);
