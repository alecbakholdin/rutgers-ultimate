import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Product, ProductVariant, useVariantCollection } from "types/product";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useCart } from "types/userData";
import LoadingButton, { LoadingStatus } from "LoadingButton";
import ProductCartSummary from "./ProductCartSummary";

export default function ProductAddToCart({
  product,
}: {
  product: Product;
}): React.ReactElement {
  const [addToCartStatus, setAddToCartStatus] = useState<LoadingStatus | null>(
    null
  );
  const [variants, variantsLoading] = useCollectionData(
    useVariantCollection(product)
  );
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >();
  const handleChangeVariant = (e: SelectChangeEvent) => {
    setAddToCartStatus(null);
    if (variants && !variantsLoading) {
      setSelectedVariant(variants.find((v) => v.id === e.target.value));
    }
  };
  const [quantity, setQuantity] = useState<number>(0);
  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddToCartStatus(null);
    setQuantity(parseInt(e.target.value));
  };
  const handleSubmit = () => {
    if (selectedVariant && quantity > 0) {
      setAddToCartStatus("loading");
      addToCart(selectedVariant.ref, quantity).then(() => {
        setAddToCartStatus("success");
      });
    }
  };

  return (
    <Card>
      <CardHeader title={"Product Cart"} />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Variant</InputLabel>
              <Select
                label={"Variant"}
                value={selectedVariant?.id}
                onChange={handleChangeVariant}
              >
                {variants
                  ?.sort((a, b) => a.order - b.order)
                  .map(({ id }) => (
                    <MenuItem key={id} value={id}>
                      {id}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              value={quantity}
              onChange={handleChangeQuantity}
              label={"Quantity"}
              fullWidth
              type={"number"}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton status={addToCartStatus} onClick={handleSubmit}>
              ADD TO CART
            </LoadingButton>
          </Grid>
          <Grid item xs={12}>
            <ProductCartSummary product={product} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
