import "styles/globals.css";
import type { AppProps } from "next/app";
import "firebaseui/dist/firebaseui.css";
import { Box, ThemeProvider } from "@mui/material";
import { theme } from "config/theme";
import NavBar from "components/NavBar";
import NonSSRWrapper from "components/NonSSRWrapper";
import { SnackbarProvider } from "notistack";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "config/firebaseApp";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [user, userLoading] = useAuthState(auth);
  useEffect(() => {
    if (!user && !userLoading && router.pathname !== "/signIn") {
      router.push("/signIn");
    }
  }, [user, userLoading, router.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <NonSSRWrapper>
          <NavBar />
          <main>
            <Component {...pageProps} />
          </main>
          <Box height={50} />
        </NonSSRWrapper>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
