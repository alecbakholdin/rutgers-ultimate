import React from "react";
import { useRouter } from "next/router";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { productCollection } from "types/product";
import { doc } from "@firebase/firestore";
import { Alert, Container, Grid, Stack, Typography } from "@mui/material";
import { currencyFormat } from "config/currencyUtils";
import ProductAddToCart from "components/ProductAddToCart";
import ProductCartSummary from "components/ProductCartSummary";
import { useUserData, useUserData2 } from "types/userData";
import ImageGallery from "components/ImageGallery";

export default function ProductPage(): React.ReactElement {
  const { getItemPrice } = useUserData2();
  useUserData();
  const router = useRouter();
  const { productId } = router.query;
  const [product] = useDocumentDataOnce(doc(productCollection, `${productId}`));

  return (
    <Container maxWidth={"md"} sx={{ paddingTop: 5 }}>
      <Grid container justifyContent={"center"} spacing={3}>
        <Grid item xs={8} sm={4}>
          <ImageGallery imageLinks={product?.images} />
        </Grid>
        <Grid item xs={8}>
          <Stack>
            <Typography variant={"h4"}>{product?.name}</Typography>
            <Typography variant={"h6"}>
              {currencyFormat(product && getItemPrice(product))}
            </Typography>
            <Alert severity={"warning"}>
              Inventory will be shipped out in late February.
            </Alert>
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
