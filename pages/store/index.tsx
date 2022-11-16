import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { productCollection } from "../../types/product";
import SearchBar from "../../components/SearchBar";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ProductCard from "../../components/ProductCard/ProductCard";

export default function Store(): React.ReactElement {
  const [products] = useCollectionData(productCollection);
  const [searchString, setSearchString] = useState<string>("");

  const handleSearch = (searchValue: string) => {
    setSearchString(searchValue);
  };

  return (
    <Container maxWidth={"lg"} sx={{ paddingTop: 5 }}>
      <Grid container>
        <Grid item xs={12}>
          <SearchBar label={"Type to Search"} onChange={handleSearch} />
        </Grid>
        <Grid item xs={12} container spacing={2}>
          {products
            ?.filter((product) =>
              product.name.toLowerCase().includes(searchString.toLowerCase())
            )
            .map((product) => (
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
