import React, { useMemo } from "react";
import { useCart } from "types/userData";
import { Product, productCollection } from "types/product";
import { DocumentReference, query, where } from "@firebase/firestore";
import { Container, Grid, Typography } from "@mui/material";
import ProductCartSummary from "components/ProductCartSummary";
import { distinctEntries } from "config/arrayUtils";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Cart(): React.ReactElement {
  const { cart } = useCart();

  const productRefs = distinctEntries<DocumentReference<Product>>(
    cart?.map(
      (item) => item.variantRef.parent.parent as DocumentReference<Product>
    ),
    (docRef) => docRef.id
  );
  const productIds: string[] = productRefs.map((product) => product.id);
  const productQuery = useMemo(
    () =>
      Boolean(productIds && productIds.length)
        ? query(productCollection, where("__name__", "in", productIds))
        : null,
    [productIds]
  );
  const [products, loading, error] = useCollectionData(productQuery);

  return (
    <Container maxWidth={"md"}>
      <Grid container spacing={2} sx={{ paddingTop: 2 }}>
        <Grid item>
          <Typography variant={"h4"}>Cart</Typography>
        </Grid>
        {products?.map((product) => (
          <Grid item key={product.id} xs={12}>
            <ProductCartSummary
              key={product.id}
              product={product}
              useProductName
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
