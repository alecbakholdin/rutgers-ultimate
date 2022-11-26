import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "config/firebaseApp";
import NavBarPageLink from "./NavBarPageLink";
import { Page } from "hooks/usePages";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

export default function SignInButton(): React.ReactElement {
  const router = useRouter();
  const pathname = router?.pathname;
  const query = pathname !== "/signIn" ? `?redirect=${router.pathname}` : "";
  const [user] = useAuthState(auth);
  const signInPage: Page = {
    name: "Sign In",
    href: `/signIn${query}`,
  };
  return (
    <Box sx={{ display: user ? "none" : "block" }}>
      <NavBarPageLink page={signInPage} />
    </Box>
  );
}
