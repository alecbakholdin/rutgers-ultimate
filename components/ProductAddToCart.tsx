import React, { useState } from "react";
import { Card, CardContent, CardHeader, Grid, GridProps } from "@mui/material";
import { Product } from "types/product";
import { UserCartItem, useUserData2 } from "types/userData";
import LoadingButton, { LoadingStatus } from "components/LoadingButton";
import NumberSelect from "components/NumberSelect";
import StringSelect from "components/StringSelect";
import BetterTextField from "components/BetterTextField";
import { useMySnackbar } from "hooks/useMySnackbar";

export default function ProductAddToCart({
  product,
}: {
  product: Product;
}): React.ReactElement {
  const { addToCartItem, signedIn } = useUserData2();
  const [cartItem, setCartItem] = useState<UserCartItem>({
    productId: product.id,
    quantity: 1,
  });
  const handleStringUpdate = (key: keyof UserCartItem) => (val: string) =>
    setCartItem({ ...cartItem, [key]: val });
  const handleIntUpdate = (key: keyof UserCartItem) => (val: number) => {
    setCartItem({ ...cartItem, [key]: val });
  };
  const handleNumberChange = (val: string) => {
    val = val.replace(/\D/, "").slice(0, 2);
    if (val === "") {
      const newItem = { ...cartItem };
      delete newItem.number;
      setCartItem(newItem);
    } else {
      setCartItem({ ...cartItem, number: parseInt(val) });
    }
  };

  const { showError } = useMySnackbar();
  const [status, setStatus] = useState<LoadingStatus>();
  const handleSubmit = async () => {
    if (!signedIn) {
      showError("Please log in first");
    } else if (cartItem.quantity === 0) {
      showError("Please select a quantity greater than 0");
    } else if (!cartItem.size && product.sizes?.length) {
      showError("Please select a size");
    } else if (!cartItem.color && product.colors?.length) {
      showError("Please select a color");
    } else {
      setStatus("loading");
      try {
        await addToCartItem(cartItem, cartItem.quantity);
        setStatus("success");
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }
  };

  const productHasField = (key: keyof Product): boolean =>
    Array.isArray(product[key])
      ? (product[key] as any[]).length > 0
      : Boolean(product[key]);

  const gridPropsForField = (key: keyof Product): GridProps => ({
    item: true,
    xs: 12,
    md: 6,
    sx: { display: productHasField(key) ? "block" : "none" },
  });

  const mdSizeForQuantity = (): number => {
    const fields: (keyof Product)[] = [
      "colors",
      "sizes",
      "canHaveName",
      "canHaveNumber",
    ];
    // if odd number of fields, take up the remaining half space
    // if even number of fields, take up the entire last row
    return fields.filter(productHasField).length % 2 === 0 ? 12 : 6;
  };

  return (
    <Card>
      <CardHeader title={"Add to Cart"} />
      <CardContent>
        <Grid container spacing={1}>
          <Grid {...gridPropsForField("colors")}>
            <StringSelect
              label={"Color"}
              value={cartItem.color}
              values={product.colors?.map((color) => color.name)}
              onChange={handleStringUpdate("color")}
            />
          </Grid>
          <Grid {...gridPropsForField("sizes")}>
            <StringSelect
              label={"Size"}
              value={cartItem.size}
              values={product.sizes}
              onChange={handleStringUpdate("size")}
            />
          </Grid>
          <Grid {...gridPropsForField("canHaveName")}>
            <BetterTextField
              label={"Name"}
              value={cartItem.name}
              onChange={(e) => handleStringUpdate("name")(e.target.value)}
            />
          </Grid>
          <Grid {...gridPropsForField("canHaveNumber")}>
            <BetterTextField
              label={"Number"}
              value={cartItem.number ?? ""}
              onChange={(e) => handleNumberChange(e.target.value)}
              handlePressEnter={handleSubmit}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={mdSizeForQuantity()}>
            <NumberSelect
              label={"Quantity"}
              value={cartItem.quantity}
              onChange={handleIntUpdate("quantity")}
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton status={status} onClick={handleSubmit}>
              Add to Cart
            </LoadingButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
