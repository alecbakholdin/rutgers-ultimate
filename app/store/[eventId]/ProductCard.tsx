"use client";
import React from "react";
import { Product } from "types/product";
import { useAuth } from "components/AuthProvider";
import { Box, Stack, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Image from "next/image";

export default function ProductCard({
  product,
}: {
  product: Product;
}): React.ReactElement {
  const { palette } = useTheme();
  const { isTeam } = useAuth();

  return (
    <Stack
      sx={{
        borderRadius: 4,
        padding: 4,
        width: 200,
        objectFit: "cover",
      }}
    >
      <Typography>{product.name}</Typography>
      {product.images?.length && (
        <Box
          width={200}
          height={200}
          sx={{
            position: "relative",
            height: "max-content",
          }}
        >
          <Image
            src={product.images[0]}
            alt={product.id}
            width={200}
            height={200}
            style={{ objectFit: "cover" }}
          />
        </Box>
      )}
    </Stack>
  );
}
