// Import the functions you need from the SDKs you nee
// https://firebase.google.com/docs/web/setup#available-libraries

import {initializeApp} from "firebase/app";

const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
}
const app = initializeApp(config);
export default app;