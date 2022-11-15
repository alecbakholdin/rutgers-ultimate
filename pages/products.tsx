import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { Product, productRepo } from "types/product";
import ProductCard from "components/ProductCard";
import SearchBar from "../components/SearchBar";

export default function Products(): React.ReactElement {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    productRepo.getAll().then(setProducts);
  }, []);

  return (
    <Container maxWidth={"lg"} sx={{ paddingTop: 5 }}>
      <Grid container>
        <Grid item xs={12}>
          <SearchBar />
        </Grid>
        <Grid
          item
          xs={12}
          container
          spacing={2}
          justifyContent={"space-between"}
        >
          {products
            .flatMap((product) => [product, product, product, product])
            .map((product) => (
              <Grid item key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Container>
  );
}
