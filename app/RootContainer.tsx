"use client";
import React, { ReactNode } from "react";
import { Container } from "@mui/material";

export default function RootContainer({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <Container
      maxWidth={"lg"}
      sx={{
        paddingTop: 5,
        paddingBottom: 5,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {children}
    </Container>
  );
}
