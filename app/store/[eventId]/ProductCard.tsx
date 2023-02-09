"use client";
import React from "react";
import { Product } from "types/product";
import { useAuth } from "components/AuthProvider";
import { Box, useTheme } from "@mui/material";
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
    <Box
      borderRadius={4}
      padding={4}
      width={400}
      sx={{ position: "relative", objectFit: "contain" }}
    >
      <Typography></Typography>
      {product.images?.length && (
        <Image src={product.images[0]} alt={product.id} fill />
      )}
    </Box>
  );
}
