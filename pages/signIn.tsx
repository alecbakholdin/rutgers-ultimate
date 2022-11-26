import React from "react";
import { uiConfig } from "config/firebaseAuthUI";
import { auth } from "config/firebaseApp";
import StyledFirebaseAuth from "components/StyledFirebaseAuth";
import { useRouter } from "next/router";

export default function SignIn(): React.ReactElement {
  const router = useRouter();
  const redirect = router?.query.redirect as string;

  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={{
          ...uiConfig,
          ...(redirect ? { signInSuccessUrl: redirect } : {}),
        }}
        firebaseAuth={auth}
      />
    </div>
  );
}
