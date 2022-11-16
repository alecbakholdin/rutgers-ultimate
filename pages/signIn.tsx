import * as React from "react";
import { useRouter } from "next/router";
import { useUser } from "../auth/useUser";
import { StyledFirebaseAuth } from "react-firebaseui";
import { auth } from "utils/firebase.config";
import { GoogleAuthProvider } from "firebase/auth";
import firebaseui from "firebaseui";

export default function SignIn() {
  const { user } = useUser();
  let router = useRouter();
  const uiConfig: firebaseui.auth.Config = {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    signInOptions: [
      {
        provider: GoogleAuthProvider.PROVIDER_ID,
      },
    ],
  };

  return (
    <div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
}
