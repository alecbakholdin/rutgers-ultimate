import React from "react";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { productCollection } from "types/product";
import { doc } from "@firebase/firestore";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { currencyFormat } from "config/currencyUtils";
import ProductAddToCart from "components/ProductAddToCart";
import ProductCartSummary from "components/ProductCartSummary";
import { useCart } from "types/userData";

export default function ProductPage(): React.ReactElement {
  const { getItemPrice } = useCart();
  const router = useRouter();
  const { productId } = router.query;
  const [product] = useDocumentData(doc(productCollection, `${productId}`));

  return (
    <Container maxWidth={"md"} sx={{ paddingTop: 5 }}>
      <Grid container justifyContent={"center"} spacing={3}>
        <Grid item xs={8} sm={4}>
          <img src={product?.image} width={"100%"} alt={product?.name} />
        </Grid>
        <Grid item xs={8}>
          <Stack>
            <Typography variant={"h4"}>{product?.name}</Typography>
            <Typography variant={"h6"}>
              {currencyFormat(product && getItemPrice(product))}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          {product && <ProductAddToCart product={product} />}
        </Grid>
        <Grid item xs={12}>
          {product && <ProductCartSummary product={product} />}
        </Grid>
      </Grid>
    </Container>
  );
}
