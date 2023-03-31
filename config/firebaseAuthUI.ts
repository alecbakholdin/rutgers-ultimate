import firebaseui from "firebaseui";
import { EmailAuthProvider, GoogleAuthProvider } from "@firebase/auth";

export const uiConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  tosUrl: "/terms-of-service",
  privacyPolicyUrl: "/privacy-policy",
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
    {
      provider: GoogleAuthProvider.PROVIDER_ID,
      scopes: ["https://www.googleapis.com/auth/gmail.labels"],
    },
  ],
};
