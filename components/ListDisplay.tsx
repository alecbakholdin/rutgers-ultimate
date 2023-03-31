"use client";
import { Chip, Grid } from "@mui/material";
import React from "react";

export default function ListDisplay({
  items,
  renderChipAvatar,
  handleDeleteItem,
}: {
  items?: string[];
  handleDeleteItem?: (toDelete: string) => void | Promise<void>;
  renderChipAvatar?: (item: string) => React.ReactElement | undefined;
}) {
  return (
    <Grid container spacing={1}>
      {items?.map((item) => (
        <Grid item key={item}>
          <Chip
            label={item}
            avatar={renderChipAvatar && renderChipAvatar(item)}
            onDelete={() => handleDeleteItem && handleDeleteItem(item)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
