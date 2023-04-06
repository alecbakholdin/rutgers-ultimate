"use client";
import React, { useState } from "react";
import { Product, ProductField } from "types/product";
import { useAuth } from "components/AuthProvider";
import { Box, Button, Grid, Popover, Stack, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import StorageImage from "appComponents/StorageImage";
import LoadingButton from "components/LoadingButton";
import ColorSwatch from "components/ColorSwatch";
import { getFromIndex } from "util/array";
import { useRouter } from "next/navigation";
import FancyCurrency from "appComponents/FancyCurrency";
import ProductFieldInput from "appComponents/ProductFieldInput";
import { getDefaultColorField, useFieldValuesState } from "appUtil/cartItem";
import { ServerEvent } from "types/event";

const productCardSize = 275;

export default function ProductCard({
  product,
  event,
}: {
  product: Product;
  event: ServerEvent;
}): React.ReactElement {
  const { palette } = useTheme();
  const { userData, isTeam, loading } = useAuth();
  const router = useRouter();
  const productFields: ProductField[] = product.fields || [];
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const colorField = getDefaultColorField(product);
  const {
    fieldValues,
    resetFieldValues,
    getFieldValue,
    setFieldValue,

    handleAddToCart,
    loading: addToCartLoading,
  } = useFieldValuesState(event, product);

  const cardImage =
    product.productImages?.find(
      (i) => !colorField || i.colorNames.includes(fieldValues[colorField.name])
    ) || getFromIndex(product.productImages, 0);
  const price = isTeam ? product.teamPrice : product.price;

  const handleReset = () => {
    setAnchorEl(null);
    resetFieldValues();
  };

  const handleNavigation = () =>
    router.push(
      `/store/${event.id}/${product.id}${
        Boolean(colorField && getFieldValue(colorField)) &&
        `?color=${getFieldValue(colorField!)}`
      }`
    );

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          border: "1px solid " + palette.divider,
          padding: 2,
        }}
      >
        <Grid
          container
          spacing={1}
          alignItems={"center"}
          sx={{
            width: productCardSize,
          }}
        >
          <Grid
            item
            xs={12}
            onClick={handleNavigation}
            sx={{
              width: productCardSize,
              height: productCardSize,
              cursor: "pointer",
            }}
          >
            <StorageImage storagePath={cardImage?.storagePath} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"body2"} fontSize={18}>
              {product.name}
            </Typography>
          </Grid>
          {colorField && (
            <Grid item xs={12} container flexWrap={"nowrap"}>
              {colorField.colors?.map(({ name, hex }) => (
                <Grid
                  key={name}
                  item
                  onClick={() => setFieldValue(colorField, name)}
                  sx={{ cursor: "pointer" }}
                >
                  <ColorSwatch
                    hex={hex}
                    selected={name === getFieldValue(colorField)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          <FancyCurrency
            amount={price}
            size={18}
            loading={(loading && !userData) || loading}
          />
          <Grid item xs={6} container justifyContent={"end"}>
            <Button
              variant={"contained"}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ fontSize: 10, paddingLeft: 1, paddingRight: 1 }}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleReset}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box width={250} padding={2}>
          <Stack spacing={2}>
            {productFields.map((field) => (
              <ProductFieldInput
                key={field.name}
                field={field}
                fieldValue={getFieldValue(field)}
                setFieldValue={(v) => setFieldValue(field, v)}
              />
            ))}
            <LoadingButton
              loading={addToCartLoading}
              onClick={() => handleAddToCart(1)}
            >
              Confirm
            </LoadingButton>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
