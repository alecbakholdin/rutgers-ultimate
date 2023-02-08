"use client";
import React from "react";
import { ThemeProvider } from "@mui/material";
import { theme } from "config/theme";
import { SnackbarProvider } from "notistack";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </ThemeProvider>
  );
}
