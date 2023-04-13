"use client";
import React from "react";
import { uiConfig } from "config/firebaseAuthUI";
import { auth } from "config/firebaseApp";
import { useSearchParams } from "next/navigation";
import StyledFirebaseAuth from "app/(RegularApp)/signIn/StyledFirebaseAuth";

export default function SignIn(): React.ReactElement {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "";

  return (
    <div style={{ paddingTop: 40 }}>
      <StyledFirebaseAuth
        uiConfig={{
          ...uiConfig,
          ...(redirect ? { signInSuccessUrl: redirect } : {}),
          callbacks: {
            signInSuccessWithAuthResult(authResult: any): boolean {
              /*const {
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
              }*/
              return true;
            },
          },
        }}
        firebaseAuth={auth}
      />
    </div>
  );
}
