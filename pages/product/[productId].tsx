import React from "react";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { productCollection } from "types/product";
import { doc } from "@firebase/firestore";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { currencyFormat } from "config/currencyUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "config/firebaseApp";
import ProductAddToCart from "components/ProductAddToCart";

export default function ProductPage(): React.ReactElement {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { productId } = router.query;
  const [product, loading, error] = useDocumentData(
    doc(productCollection, `${productId}`)
  );

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
              {currencyFormat(product?.price ?? 0)}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          {product && <ProductAddToCart product={product} />}
        </Grid>
      </Grid>
    </Container>
  );
}
