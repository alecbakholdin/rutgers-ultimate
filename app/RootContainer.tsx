"use client";
import React, { ReactNode } from "react";
import { Container } from "@mui/material";

export default function RootContainer({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <Container maxWidth={"md"} sx={{ paddingTop: 5 }}>
      {children}
    </Container>
  );
}
