"use client";
import React from "react";
import { uiConfig } from "config/firebaseAuthUI";
import { auth } from "config/firebaseApp";
import StyledFirebaseAuth from "components/StyledFirebaseAuth";
import { useRouter } from "next/router";
import { EmailAuthProvider, sendEmailVerification } from "@firebase/auth";

export default function SignIn(): React.ReactElement {
  const router = useRouter();
  const redirect = router?.query.redirect as string;

  return (
    <div style={{ paddingTop: 40 }}>
      <StyledFirebaseAuth
        uiConfig={{
          ...uiConfig,
          ...(redirect ? { signInSuccessUrl: redirect } : {}),
          callbacks: {
            signInSuccessWithAuthResult(authResult: any): boolean {
              console.log(JSON.stringify(authResult));
              const {
                emailVerified,
                additionalUserInfo: { providerId },
              } = authResult;
              if (
                !emailVerified &&
                providerId === EmailAuthProvider.PROVIDER_ID
              ) {
                sendEmailVerification(authResult.user, {
                  url: "https://rutgersultimate.com",
                });
              }
              return true;
            },
          },
        }}
        firebaseAuth={auth}
      />
    </div>
  );
}
