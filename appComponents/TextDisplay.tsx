"use client";
import React from "react";
import { Typography } from "@mui/material";

export default function TextDisplay({
  text,
}: {
  text: string;
}): React.ReactElement {
  return (
    <Typography variant={"h4"} textAlign={"center"} color={"primary"}>
      {text}
    </Typography>
  );
}
