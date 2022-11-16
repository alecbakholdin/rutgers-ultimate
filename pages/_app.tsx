import "../styles/globals.css";
import type { AppProps } from "next/app";
import "firebaseui/dist/firebaseui.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "../config/theme";
import NavBar from "../components/NavBar";
import NonSSRWrapper from "../components/NonSSRWrapper";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <NonSSRWrapper>
        <NavBar />
        <main>
          <Component {...pageProps} />
        </main>
      </NonSSRWrapper>
    </ThemeProvider>
  );
}
