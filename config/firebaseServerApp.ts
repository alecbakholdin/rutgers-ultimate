import * as admin from "firebase-admin";

if (!admin.apps.length) {
  console.log(process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"));
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

export const serverDb = admin.firestore();
export const serverAuth = admin.auth();