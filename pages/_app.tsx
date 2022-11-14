import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import * as React from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
