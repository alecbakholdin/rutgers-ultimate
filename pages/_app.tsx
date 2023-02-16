import "/styles/globals.css";
import type { AppProps } from "next/app";
import "firebaseui/dist/firebaseui.css";
import { Box, ThemeProvider } from "@mui/material";
import { theme } from "config/theme";
import NavBar from "components/NavBar";
import NonSSRWrapper from "components/NonSSRWrapper";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider } from "jotai";
import { AuthProvider } from "components/AuthProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SnackbarProvider>
            <NonSSRWrapper>
              <Provider>
                <NavBar />
                <main>
                  <Component {...pageProps} />
                </main>
                <Box height={50} />
              </Provider>
            </NonSSRWrapper>
          </SnackbarProvider>
        </LocalizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
