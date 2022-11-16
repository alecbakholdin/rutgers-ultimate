import React, { useEffect, useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { Product, productRepo } from "types/product";
import ProductCard from "components/ProductCard";
import SearchBar from "../components/SearchBar";

export default function Products(): React.ReactElement {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  useEffect(() => {
    productRepo.getAll().then((products) => {
      setProducts(products);
      setFilteredProducts(products);
    });
  }, []);

  const handleSearch = (searchValue: string) => {
    if (!searchValue) {
      setFilteredProducts(products);
      return;
    }
    setFilteredProducts(
      products.filter((product) =>
        product.id.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  return (
    <Container maxWidth={"lg"} sx={{ paddingTop: 5 }}>
      <Grid container>
        <Grid item xs={12}>
          <SearchBar label={"Type to Search"} onChange={handleSearch} />
        </Grid>
        <Grid item xs={12} container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid xs={12} sm={6} md={4} item key={product.id}>
              <Box display={"flex"} justifyContent={"center"}>
                <ProductCard product={product} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
