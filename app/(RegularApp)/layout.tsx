import "/styles/globals.css";

import React, { ReactNode } from "react";
import Providers from "app/(RegularApp)/Providers";
import DesktopNavBar from "app/(RegularApp)/NavBar";
import { cookies } from "next/headers";
import { FIREBASE_AUTH_COOKIE } from "types/serverAuth";
import { serverAuth } from "config/firebaseServerApp";
import { DecodedIdToken } from "firebase-admin/lib/auth";
import RootContainer from "app/(RegularApp)/RootContainer";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authToken = cookies().get(FIREBASE_AUTH_COOKIE)?.value;
  const existingUser: DecodedIdToken | undefined = authToken
    ? await serverAuth.verifyIdToken(authToken).catch((e) => {
        console.error(e);
        redirect("/reAuth");
        return undefined;
      })
    : undefined;

  return (
    <html>
      <body>
        <Providers>
          <DesktopNavBar existingUser={existingUser} />
          <RootContainer>{children}</RootContainer>
        </Providers>
      </body>
    </html>
  );
}
