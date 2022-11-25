import React from "react";
import { useUserData2 } from "types/userData";
import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import ProductCartSummary from "components/ProductCartSummary";
import { currencyFormat } from "config/currencyUtils";
import { distinctEntries } from "config/arrayUtils";
import { useProductData } from "types/product";

export default function Cart(): React.ReactElement {
  const { cart, getItemPrice } = useUserData2();
  const productIdsInCart = distinctEntries(cart.map((item) => item.productId));
  const [productsInCart] = useProductData(productIdsInCart);
  const priceMap = Object.fromEntries(
    productsInCart.map((p) => [p.id, getItemPrice(p)])
  );
  const totalCost = cart.reduce(
    (total, item) => total + item.quantity * priceMap[item.productId],
    0
  );
  console.log(cart, productIdsInCart, productsInCart, priceMap);

  return (
    <Container maxWidth={"md"}>
      <Grid container spacing={2} sx={{ paddingTop: 2 }}>
        <Grid item xs={12}>
          <Typography variant={"h4"}>Cart</Typography>
        </Grid>
        {productsInCart?.map((product) => (
          <Grid item key={product.id} xs={12}>
            <ProductCartSummary product={product} useProductName />
          </Grid>
        ))}
        <Grid item xs={6} container alignItems={"center"}>
          <Button>
            <Link href={"/checkout"} sx={{ textDecoration: "none" }}>
              <Typography variant={"h6"}>Checkout</Typography>
            </Link>
          </Button>
        </Grid>
        <Grid item xs={6} container justifyContent={"right"}>
          <TextField
            value={currencyFormat(totalCost)}
            label={"Total"}
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
