import firebaseui from "firebaseui";
import { GoogleAuthProvider } from "@firebase/auth";

export const uiConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  tosUrl: "/terms-of-service",
  privacyPolicyUrl: "/privacy-policy",
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
};
