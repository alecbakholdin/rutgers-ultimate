import firebaseui from "firebaseui";
import { GoogleAuthProvider } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { UserData } from "types/userData";

export const uiConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  tosUrl: "/terms-of-service",
  privacyPolicyUrl: "/privacy-policy",
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult(
      authResult: any,
      redirectUrl?: string
    ): boolean {
      console.log(authResult);
      setDoc(doc(firestore, `userData/${authResult.user.uid}`), {
        isAdmin: false,
        email: authResult.user.email,
      } as UserData)
        .then(() => {
          console.log("User created successfully");
        })
        .catch((e) => console.error(e));
      return true;
    },
  },
};
