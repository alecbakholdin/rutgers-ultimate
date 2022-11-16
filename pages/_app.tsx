import "../styles/globals.css";
import type { AppProps } from "next/app";
import "firebaseui/dist/firebaseui.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "../config/theme";
import NavBar from "../components/NavBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <main>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
