import { initializeApp, getApps, getApp, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import dotenv from "dotenv";

dotenv.config();

let adminApp: App | undefined;
let adminAuth: Auth | undefined;

export const initFirebaseAdmin = () => {
  if (adminApp && adminAuth) {
    return { app: adminApp, auth: adminAuth };
  }

  const clean = (val?: string) => (val ? val.replace(/^["']|["']$/g, "").trim() : "");

  const projectId = clean(process.env.FIREBASE_PROJECT_ID);
  const clientEmail = clean(process.env.FIREBASE_CLIENT_EMAIL);
  let privateKey = clean(process.env.FIREBASE_PRIVATE_KEY);

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "[Firebase Admin] Missing required credentials in .env: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are required."
    );
  }

  try {
    adminApp = !getApps().length
      ? initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        })
      : getApp();

    adminAuth = getAuth(adminApp);
    console.log(`[Firebase Admin] Authenticated with project: ${projectId}`);
    return { app: adminApp, auth: adminAuth };
  } catch (error: any) {
    console.error("[Firebase Admin] Initialization failed:", error.message);
    throw error;
  }
};

export const verifyFirebaseToken = async (
  idToken: string
): Promise<{ uid: string; email: string; email_verified?: boolean }> => {
  const { auth } = initFirebaseAdmin();

  if (!idToken || typeof idToken !== "string") {
    throw new Error("Invalid or empty ID token supplied");
  }

  const decodedToken = await auth.verifyIdToken(idToken);
  return {
    uid: decodedToken.uid,
    email: decodedToken.email || "",
    email_verified: decodedToken.email_verified,
  };
};
