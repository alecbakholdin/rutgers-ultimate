"use client";
import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "config/theme";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "components/AuthProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <AuthProvider>
          <CssBaseline />
          {children}
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
