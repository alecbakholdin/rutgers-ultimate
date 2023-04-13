"use client";
import React, { useState } from "react";
import { Product } from "types/product";
import { StoreEvent } from "types/storeEvent";
import {
  Box,
  BoxProps,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import StorageImage from "appComponents/StorageImage";
import { getFromIndex } from "util/array";
import ColorSwatch from "appComponents/ColorSwatch";
import { useRouter } from "next/navigation";
import FancyCurrency from "appComponents/textDisplay/FancyCurrency";

export default function ProductPage({
  product,
  event,
  initialColor,
}: {
  product: Product;
  event: StoreEvent;
  initialColor?: string;
}) {
  const router = useRouter();
  const { palette } = useTheme();
  const grey = palette.grey[300];

  const [colorField, setColorField] = useState(
    initialColor || getFromIndex(product.colors, 0)?.name || ""
  );

  const colorImages = product.productImages?.filter((p) =>
    p.colorNames?.includes(colorField)
  );
  const images = colorImages?.length ? colorImages : product.productImages;
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const activeImg =
    activeImgIndex < (images?.length || 0) ? images[activeImgIndex] : undefined;

  const imgBoxProps: BoxProps = {
    width: "100%",
    height: "auto",
    borderRadius: 1,
    border: "2px solid " + grey,
  };
  return (
    <Grid container justifyContent={"center"} spacing={3}>
      <Grid item container xs={10} md={5} spacing={1}>
        <Grid key={"main"} item xs={12}>
          <Box {...imgBoxProps} sx={{ aspectRatio: "1" }}>
            <StorageImage storagePath={activeImg?.storagePath} />
          </Box>
        </Grid>
        {(images?.length || 0) > 1 &&
          images.map((img, i) => (
            <Grid key={img.storagePath} item xs={3}>
              <Box
                {...imgBoxProps}
                borderColor={
                  i === activeImgIndex ? palette.primary.main : undefined
                }
                onClick={() => setActiveImgIndex(i)}
                sx={{
                  aspectRatio: "1",
                  cursor: "pointer",
                }}
              >
                <StorageImage storagePath={img.storagePath} />
              </Box>
            </Grid>
          ))}
      </Grid>
      <Grid item container xs={10} md={4} spacing={2} height={"min-content"}>
        <Grid item container xs={12} justifyContent={"end"}>
          <Typography variant={"h4"} width={"max-content"}>
            {product.name}
          </Typography>
        </Grid>
        <Grid item container xs={12} justifyContent={"end"}>
          <Grid item>
            <FancyCurrency amount={product.price} size={25} />
          </Grid>
        </Grid>
        {Boolean(product.colors?.length) && (
          <Grid item container xs={12} spacing={0.5} justifyContent={"end"}>
            {product.colors?.map(({ name, hex }) => (
              <Grid
                key={"name"}
                item
                onClick={() => {
                  setColorField(name);
                  setActiveImgIndex(0);
                  router.push(`/store/${event.id}/${product.id}?color=${name}`);
                }}
                sx={{ cursor: "pointer" }}
              >
                <ColorSwatch
                  hex={hex}
                  selected={name === colorField}
                  size={30}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {product.canHaveName && (
          <Grid item xs={12}>
            <TextField />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
