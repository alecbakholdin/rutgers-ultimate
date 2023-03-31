"use client";

import React from "react";
import { Product } from "types/product";
import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { distinctEntries } from "util/array";

export default function EditColorImages({
  edits,
  handleEdit,
}: {
  edits: Product | null;
  handleEdit: (edit: Partial<Product>) => void;
}): React.ReactElement {
  const handleImageToggle =
    (colorName: string, imageURL: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = edits?.colorMap?.[colorName];
      if (color) {
        const images = e.target.checked
          ? distinctEntries([...(color?.images ?? []), imageURL]) // add image
          : color.images?.filter((image) => image !== imageURL) ?? []; // remove image
        handleEdit({
          colorMap: { [colorName]: { ...color, images } },
        });
      }
    };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant={"h5"}>Image Management</Typography>
      </Grid>
      {edits?.images?.map((image, i) => (
        <Grid key={i} item container width={"min-content"} flexWrap={"nowrap"}>
          <Grid item>
            <img
              src={image}
              alt={image}
              style={{ maxHeight: 200, width: "auto", objectFit: "contain" }}
            />
          </Grid>
          <Grid
            item
            container
            flexDirection={"column"}
            justifyContent={"center"}
          >
            {edits?.colors?.map((color) => (
              <Grid key={color.name} item>
                <FormControlLabel
                  label={color.name}
                  control={
                    <Checkbox
                      checked={Boolean(
                        edits?.colorMap &&
                          edits.colorMap[color.name]?.images?.includes(image)
                      )}
                      onChange={handleImageToggle(color.name, image)}
                    />
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}
