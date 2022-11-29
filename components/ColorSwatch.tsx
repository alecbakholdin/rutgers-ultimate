"use client";

import React from "react";
import { Box } from "@mui/material";

export default function ColorSwatch({
  size = 25,
  hex,
}: {
  size?: number;
  hex: string;
}): React.ReactElement {
  return (
    <Box
      width={size}
      height={size}
      minHeight={size}
      minWidth={size}
      sx={[
        { backgroundColor: hex, borderRadius: "50%", border: "1px solid" },
        (theme) => ({
          borderColor: theme.palette.grey[500],
        }),
      ]}
    />
  );
}
