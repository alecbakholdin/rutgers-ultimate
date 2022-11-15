import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { Product, productRepo } from "types/product";
import ProductCard from "components/ProductCard";

export default function Products(): React.ReactElement {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    productRepo.getAll().then(setProducts);
  }, []);

  return (
    <Container maxWidth={"lg"}>
      <Grid container>
        {products.map((product) => (
          <Grid item key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
