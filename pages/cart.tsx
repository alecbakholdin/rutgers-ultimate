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

export default function Cart(): React.ReactElement {
  const { cart, getItemPrice, productsInCart, totalCost } = useUserData2();

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
