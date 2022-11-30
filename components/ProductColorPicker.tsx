"use client";

import React from "react";
import { Grid, SxProps } from "@mui/material";
import ColorSwatch from "components/ColorSwatch";
import { ProductColor } from "types/product";
import { useColors } from "types/color";

export default function ProductColorPicker({
  swatchSize,
  productColors,
  setSelectedColor,
  selectedColor,
  sx,
}: {
  swatchSize?: number;
  productColors?: ProductColor[];
  setSelectedColor: (color: string) => void;
  selectedColor?: string;
  sx?: SxProps;
}): React.ReactElement {
  const { colorMap } = useColors();
  const handleSelectColor =
    (colorName: string) => (e: React.MouseEvent<HTMLDivElement>) => {
      setSelectedColor(colorName);
      e.stopPropagation();
      e.preventDefault();
    };

  return (
    <Grid container spacing={1} sx={sx}>
      {productColors?.map((color) => (
        <Grid key={color.name} item onClick={handleSelectColor(color.name)}>
          <ColorSwatch
            size={swatchSize}
            hex={colorMap[color.name]}
            selected={selectedColor === color.name}
            sx={{
              cursor: "pointer",
              ":hover": {
                borderColor: "black",
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
