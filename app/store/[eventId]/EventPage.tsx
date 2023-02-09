"use client";
import React from "react";
import { ServerEvent } from "types/event";
import { Product } from "types/product";
import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import ProductCard from "./ProductCard";

export default function EventPage({
  event,
  products,
}: {
  event: ServerEvent;
  products: Product[];
}): React.ReactElement {
  const { palette } = useTheme();

  return (
    <Stack width={"100%"}>
      <Box
        borderRadius={10}
        border={"1px solid " + palette.info.main}
        padding={5}
      >
        <Typography variant={"h4"}>{event.name}</Typography>
      </Box>
      <Grid container justifyContent={"space-between"}>
        {products.map((product) => (
          <Grid key={product.id} item>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
