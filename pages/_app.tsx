import "/styles/globals.css";
import type { AppProps } from "next/app";
import "firebaseui/dist/firebaseui.css";
import { Box, Button, IconButton, Stack, ThemeProvider } from "@mui/material";
import { theme } from "config/theme";
import NavBar from "components/NavBar";
import NonSSRWrapper from "components/NonSSRWrapper";
import { SnackbarProvider } from "notistack";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "config/firebaseApp";
import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  sendEmailVerification,
  UserInfo,
} from "@firebase/auth";
import { Close } from "@mui/icons-material";
import { useMySnackbar } from "hooks/useMySnackbar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider } from "jotai";

const EmailAuthReminder = () => {
  const { enqueueSnackbar, closeSnackbar, showSuccess } = useMySnackbar();
  const [user, userLoading] = useAuthState(auth);
  const isEmailProvider = (providerInfo: UserInfo) =>
    providerInfo.providerId === EmailAuthProvider.PROVIDER_ID;
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (
      !notified &&
      !userLoading &&
      user &&
      user.providerData.find(isEmailProvider) &&
      !user.emailVerified
    ) {
      setNotified(true);
      enqueueSnackbar(
        "Please check your email to verify your account. Make sure to also check your spam folder.",
        {
          variant: "warning",
          autoHideDuration: null,
          action: (key) => {
            const closeThisBar = () => closeSnackbar(key);
            const sendConfirmationEmail = async () => {
              closeThisBar();
              await sendEmailVerification(user, {
                url: "https://rutgersultimate.com",
              });
              showSuccess("Email sent. Please check your spam.");
            };
            return (
              <Stack direction={"row"}>
                <Button onClick={sendConfirmationEmail} sx={{ color: "white" }}>
                  Resend
                </Button>
                <IconButton onClick={closeThisBar}>
                  <Close />
                </IconButton>
              </Stack>
            );
          },
        }
      );
    }
  }, [user, userLoading]);

  return <></>;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider>
          <NonSSRWrapper>
            <Provider>
              <EmailAuthReminder />
              <NavBar />
              <main>
                <Component {...pageProps} />
              </main>
              <Box height={50} />
            </Provider>
          </NonSSRWrapper>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
