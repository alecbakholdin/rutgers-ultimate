import React from "react";
import { Grid, IconButton, SxProps, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

export default function QuantitySelect({
  quantity,
  setQuantity,
  sx,
}: {
  quantity: number;
  setQuantity: (qty: number) => void;
  sx?: SxProps;
}): React.ReactElement {
  return (
    <Grid
      item
      container
      wrap={"nowrap"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Grid item>
        <IconButton onClick={() => setQuantity(quantity - 1)}>
          <Remove />
        </IconButton>
      </Grid>
      <Grid
        item
        sx={{
          backgroundColor: "#F8F8F8",
          margin: 1,
          padding: 1.5,
          paddingRight: 3,
          paddingLeft: 3,
          borderRadius: 10,
        }}
      >
        <Typography variant={"h6"}>{quantity}</Typography>
      </Grid>
      <Grid item>
        <IconButton onClick={() => setQuantity(quantity + 1)}>
          <Add />
        </IconButton>
      </Grid>
    </Grid>
  );
}
