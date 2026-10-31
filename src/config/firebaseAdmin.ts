import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

let isInitialized = false;

export const initFirebaseAdmin = () => {
  if (isInitialized) return admin;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Unescape literal \n if stored in .env string
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "[Firebase Admin] Missing required credentials in .env: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are required."
    );
  }

  try {
    (admin as any).initializeApp({
      credential: (admin as any).credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    isInitialized = true;
    console.log(`[Firebase Admin] Authenticated with project: ${projectId}`);
    return admin;
  } catch (error: any) {
    console.error("[Firebase Admin] Initialization failed:", error.message);
    throw error;
  }
};

export const verifyFirebaseToken = async (
  idToken: string
): Promise<{ uid: string; email: string; email_verified?: boolean }> => {
  initFirebaseAdmin();

  if (!idToken || typeof idToken !== "string") {
    throw new Error("Invalid or empty ID token supplied");
  }

  const decodedToken = await (admin as any).auth().verifyIdToken(idToken);
  return {
    uid: decodedToken.uid,
    email: decodedToken.email || "",
    email_verified: decodedToken.email_verified,
  };
};

export { admin };
