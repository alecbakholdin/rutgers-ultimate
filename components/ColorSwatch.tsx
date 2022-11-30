"use client";

import React from "react";
import { Box, SxProps, useTheme } from "@mui/material";
import { Check } from "@mui/icons-material";

export default function ColorSwatch({
  size = 25,
  hex,
  selected,
  sx,
}: {
  size?: number;
  hex: string;
  selected?: boolean;
  sx?: SxProps;
}): React.ReactElement {
  const { palette } = useTheme();
  const chooseContrastColor = () => {
    if (!hex?.match(/^#[\dA-F]{6}$/)) return "black";
    const [_, ...rgb] =
      hex.match(/^#([\dA-F]{2})([\dA-F]{2})([\dA-F]{2})$/) ?? [];
    const [r, g, b] = rgb.map((hex) => Number("0x" + hex));
    if (r * 0.299 + g * 0.587 + b * 0.114 > 186) return "black";
    return "white";
  };

  return (
    <Box
      width={size}
      height={size}
      minHeight={size}
      minWidth={size}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        backgroundColor: hex,
        borderRadius: "50%",
        border: `1px solid ${palette.grey[500]}`,
        ...sx,
      }}
    >
      {selected && (
        <Check
          sx={{
            color: chooseContrastColor(),
            maxHeight: "80%",
            maxWidth: "80%",
          }}
        />
      )}
    </Box>
  );
}
