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
import LoadingButton, { LoadingStatus } from "components/LoadingButton";
import { useSnackbar } from "notistack";

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
  const handleChangeQuantity = (e: SelectChangeEvent) => {
    setAddToCartStatus(null);
    setQuantity(parseInt(e.target.value));
  };
  const [name, setName] = useState<string | undefined>(undefined);
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddToCartStatus(null);
    if (e.target.value.trim().length === 0) {
      setName(undefined);
    } else {
      setName(e.target.value);
    }
  };
  const [number, setNumber] = useState<number | undefined>(undefined);
  const handleChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddToCartStatus(null);
    if (e.target.value.trim().length === 0 || isNaN(parseInt(e.target.value))) {
      setNumber(undefined);
    } else {
      const val = parseInt(e.target.value.slice(0, 2));
      setNumber(Math.min(99, Math.max(0, val)));
    }
  };

  const { enqueueSnackbar } = useSnackbar();
  const handleSubmit = async () => {
    if (!selectedVariant) {
      enqueueSnackbar("Please select a variant", {
        autoHideDuration: 1500,
        variant: "error",
      });
      return;
    }
    if (quantity === 0) {
      enqueueSnackbar("Please select a quantity greater than 0", {
        autoHideDuration: 1500,
        variant: "error",
      });
      return;
    }

    setAddToCartStatus("loading");
    await addToCart(selectedVariant.ref, quantity, name, number);

    setAddToCartStatus("success");
  };
  const { canHaveName, canHaveNumber } = product;

  return (
    <Card>
      <CardHeader title={"Add to Cart"} />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Variant</InputLabel>
              <Select
                label={"Variant"}
                value={selectedVariant?.id ?? ""}
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
            <FormControl fullWidth>
              <InputLabel>Quantity</InputLabel>
              <Select
                label={"Quantity"}
                value={quantity.toString()}
                onChange={handleChangeQuantity}
              >
                {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
                  <MenuItem key={num - 1} value={(num - 1).toString()}>
                    {num - 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {canHaveName && (
            <Grid item xs={12} md={canHaveName && canHaveNumber ? 6 : 12}>
              <TextField
                fullWidth
                label={"Name (case-sensitive)"}
                value={name}
                onChange={handleChangeName}
              />
            </Grid>
          )}
          {canHaveNumber && (
            <Grid item xs={12} md={canHaveName && canHaveNumber ? 6 : 12}>
              <TextField
                fullWidth
                label={"Number"}
                type={"tel"}
                value={number === undefined ? "" : number}
                onChange={handleChangeNumber}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <LoadingButton status={addToCartStatus} onClick={handleSubmit}>
              ADD TO CART
            </LoadingButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
