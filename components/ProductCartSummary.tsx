import React, { ChangeEvent } from "react";
import { Product, useVariants } from "types/product";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CartItem, useCart } from "types/userData";
import { Add, Remove } from "@mui/icons-material";
import { currencyFormat } from "config/currencyUtils";

export default function ProductCartSummary({
  product,
  useProductName,
}: {
  product: Product;
  useProductName?: boolean;
}): React.ReactElement {
  const { cart, updateCartQuantity, getItemPrice } = useCart();
  const [variants] = useVariants(product);

  const productCartItems = cart?.filter(
    (cartItem) => cartItem.variantRef.parent.parent!.id === product.id
  );
  const variantOrder: { [id: string]: number } = Object.fromEntries(
    variants?.map((v) => [v.id, v.order]) ?? []
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
  const totalQty =
    productCartItems?.reduce((t, item) => t + item.quantity, 0) ?? 0;
  const totalPrice = getItemPrice(product) * totalQty;

  const sizeCol = {
    xs: 2,
  };
  const qtyCol = {
    xs: 6,
    sm: 5,
    md: 4,
    lg: 3,
  };
  const priceCol = {
    xs: 2,
  };
  console.log(cart);
  return (
    <Card sx={{ ...(!productCartItems?.length && { display: "none" }) }}>
      <CardHeader
        title={
          useProductName ? (
            <Link href={`/product/${product.id}`}>{product.name}</Link>
          ) : (
            "Product Quantities"
          )
        }
      />
      <CardContent>
        <Grid
          container
          spacing={2}
          alignItems={"center"}
          justifyContent={"space-around"}
        >
          {productCartItems
            ?.sort((a, b) => {
              if (!variantOrder) return 0;
              const aOrder = variantOrder[a.variantRef.id] ?? 0;
              const bOrder = variantOrder[b.variantRef.id] ?? 0;
              return aOrder - bOrder;
            })
            .map((cartItem) => (
              <>
                <Grid key={`${cartItem.id} divider`} item xs={12}>
                  <Divider />
                </Grid>
                <Grid key={cartItem.id} item {...sizeCol}>
                  <Stack>
                    <Typography key={"id"} variant={"h5"}>
                      {cartItem.variantRef.id}
                    </Typography>
                    {cartItem.name !== undefined && (
                      <Typography
                        key={"item-name"}
                        color={"neutral"}
                        variant={"caption"}
                      >
                        -Name: {cartItem.name}
                      </Typography>
                    )}
                    {cartItem.number !== undefined && (
                      <Typography
                        key={"item-number"}
                        color={"neutral"}
                        variant={"caption"}
                      >
                        -Number: {cartItem.number}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid
                  key={`${cartItem.id}-quantity`}
                  item
                  {...qtyCol}
                  container
                  wrap={"nowrap"}
                  alignItems={"center"}
                >
                  <Grid key={"remove-button"} item>
                    <IconButton onClick={handleRemoveOne(cartItem)}>
                      <Remove />
                    </IconButton>
                  </Grid>
                  <Grid key={"qty-field"} item xs={8} flexGrow={1}>
                    <TextField
                      value={cartItem.quantity}
                      onChange={handleSet(cartItem)}
                      label={"Quantity"}
                      type={"tel"}
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
                <Grid item container justifyContent={"right"} {...priceCol}>
                  <Typography>
                    {currencyFormat(getItemPrice(product) * cartItem.quantity)}
                  </Typography>
                </Grid>
              </>
            ))}

          {(productCartItems?.length ?? 0) > 1 && (
            <>
              <Grid item key={"total-divider"} xs={12}>
                <Divider />
              </Grid>
              <Grid item key={"total-whitespace"} {...sizeCol} />
              <Grid item key={"total-qty"} {...qtyCol}>
                <TextField
                  value={totalQty}
                  label="Total"
                  type={"tel"}
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
                  sx={{ marginLeft: 5, marginRight: 5 }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid
                item
                key={"total-price"}
                container
                justifyContent={"right"}
                {...priceCol}
              >
                <Typography>{currencyFormat(totalPrice)}</Typography>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
