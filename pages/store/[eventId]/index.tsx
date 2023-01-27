import React, { useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { productCollection } from "types/product";
import SearchBar from "components/SearchBar";
import {
  useCollectionDataOnce,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import ProductCard from "components/ProductCard/ProductCard";
import { extractKey } from "../../../config/arrayUtils";
import { useRouter } from "next/router";
import { eventCollection } from "../../../types/event";
import { doc } from "@firebase/firestore";

export default function Store(): React.ReactElement {
  const router = useRouter();
  const { eventId } = router.query;
  const [event] = useDocumentDataOnce(doc(eventCollection, `${eventId}`));
  //const eventProductIds = event?.productStatuses?.map((s) => s.productId) || [];
  const eventProductIds = event?.productIds || [];
  const [products] = useCollectionDataOnce(productCollection);
  const productMap = extractKey(products, "id");
  const eventProducts = eventProductIds.map((id) => productMap[id]);
  const [searchString, setSearchString] = useState<string>("");
  console.log(eventProductIds, eventProducts);

  const handleSearch = (searchValue: string) => {
    setSearchString(searchValue);
  };

  return (
    <Container maxWidth={"lg"} sx={{ paddingTop: 5 }}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant={"h4"}>{event?.name}</Typography>
        </Grid>
        <Grid item xs={12}>
          <SearchBar label={"Type to Search"} onChange={handleSearch} />
        </Grid>
        <Grid item xs={12} container spacing={2}>
          {eventProducts
            ?.filter(
              (p) =>
                p && p.name.toLowerCase().includes(searchString.toLowerCase())
            )
            .map((product) => (
              <Grid xs={12} sm={6} md={4} item key={product.id}>
                <Box display={"flex"} justifyContent={"center"}>
                  <ProductCard eventId={eventId as string} product={product} />
                </Box>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Container>
  );
}
