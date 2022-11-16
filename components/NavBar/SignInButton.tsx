import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/firebaseApp";
import NavBarPageLink from "./NavBarPageLink";
import { Page } from "../../hooks/usePages";
import { Box } from "@mui/material";

export default function SignInButton(): React.ReactElement {
  const [user] = useAuthState(auth);
  const signInPage: Page = {
    name: "Sign In",
    href: "/signIn",
  };
  return (
    <Box sx={{ display: user ? "none" : "block" }}>
      <NavBarPageLink page={signInPage} />
    </Box>
  );
}
