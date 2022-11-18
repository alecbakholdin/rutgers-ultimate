import React, { ChangeEvent } from "react";
import { Product } from "types/product";
import {
  Card,
  CardContent,
  CardHeader,
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
  const handleRemoveOne = (cartItem: CartItem) => async () => {
    await updateCartQuantity(cartItem, cartItem.quantity - 1);
  };
  const handleAddOne = (cartItem: CartItem) => async () => {
    await updateCartQuantity(cartItem, cartItem.quantity + 1);
  };

  return (
    <Card sx={{ ...(!productCartItems?.length && { display: "none" }) }}>
      <CardHeader title={"Product Quantities"} />
      <CardContent>
        <Grid container spacing={2} alignItems={"center"}>
          {productCartItems?.map((cartItem) => (
            <>
              <Grid key={`${cartItem.id} divider`} item xs={12}>
                <Divider />
              </Grid>
              <Grid key={cartItem.id} item xs={6}>
                <Typography variant={"h5"}>{cartItem.variantRef.id}</Typography>
              </Grid>
              <Grid
                key={`${cartItem.id}-quantity`}
                item
                xs={6}
                container
                wrap={"nowrap"}
                alignItems={"center"}
              >
                <Grid key={"remove-button"} item>
                  <IconButton onClick={handleRemoveOne(cartItem)}>
                    <Remove />
                  </IconButton>
                </Grid>
                <Grid key={"qty-field"} item flexGrow={1}>
                  <TextField
                    value={cartItem.quantity}
                    onChange={handleSet(cartItem)}
                    label={"Quantity"}
                    type={"number"}
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    fullWidth
                  />
                </Grid>
                <Grid key={"add-button"} item>
                  <IconButton onClick={handleAddOne(cartItem)}>
                    <Add />
                  </IconButton>
                </Grid>
              </Grid>
            </>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
