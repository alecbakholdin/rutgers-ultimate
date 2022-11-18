import React, { ChangeEvent } from "react";
import { Product } from "types/product";
import {
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { CartItem, useCart } from "types/userData";
import { Add, Remove } from "@mui/icons-material";

export default function ProductCartSummary({
  product,
}: {
  product?: Product;
}): React.ReactElement {
  const { cart, updateCartQuantity } = useCart();
  const productCartItems = cart?.filter(
    (cartItem) => cartItem.variantRef.parent.parent!.id === product?.id
  );

  const handleSet =
    (cartItem: CartItem) => async (e: ChangeEvent<HTMLInputElement>) => {
      await updateCartQuantity(cartItem, parseInt(e.target.value));
    };
  const handleRemove = (cartItem: CartItem) => async () => {
    await updateCartQuantity(cartItem, cartItem.quantity - 1);
  };
  const handleAdd = (cartItem: CartItem) => async () => {
    await updateCartQuantity(cartItem, cartItem.quantity + 1);
  };

  return (
    <Grid container spacing={2} alignItems={"center"}>
      {productCartItems?.map((cartItem) => (
        <>
          <Grid key={`${cartItem} divider`} item xs={12}>
            <Divider />
          </Grid>
          <Grid key={cartItem.id} item xs={6}>
            <Typography variant={"h5"}>{cartItem.variantRef.id}</Typography>
          </Grid>
          <Grid
            key={`${cartItem}-quantity`}
            item
            xs={6}
            container
            wrap={"nowrap"}
            alignItems={"center"}
          >
            <Grid item>
              <IconButton onClick={handleRemove(cartItem)}>
                <Remove />
              </IconButton>
            </Grid>
            <Grid item flexGrow={1}>
              <TextField
                value={cartItem.quantity}
                onChange={handleSet(cartItem)}
                label={"Quantity"}
                type={"number"}
                fullWidth
              />
            </Grid>
            <Grid item>
              <IconButton onClick={handleAdd(cartItem)}>
                <Add />
              </IconButton>
            </Grid>
          </Grid>
        </>
      ))}
    </Grid>
  );
}
