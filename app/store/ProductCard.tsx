"use client";
import React, { useState } from "react";
import { Product, ProductField } from "types/product";
import { useAuth } from "components/AuthProvider";
import {
  Box,
  Button,
  FormGroup,
  FormLabel,
  Grid,
  Popover,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import StorageImage from "appComponents/StorageImage";
import LoadingButton from "components/LoadingButton";
import ColorSwatch from "components/ColorSwatch";
import { getFromIndex } from "util/array";
import { useRouter } from "next/navigation";
import FancyCurrency from "appComponents/FancyCurrency";
import StringChipList from "appComponents/StringChipList";
import { useMySnackbar } from "hooks/useMySnackbar";

const productCardSize = 275;

export default function ProductCard({
  product,
  eventId,
}: {
  product: Product;
  eventId: string;
}): React.ReactElement {
  const { palette } = useTheme();
  const { userData, isTeam, loading } = useAuth();
  const { showError } = useMySnackbar();
  const router = useRouter();
  const productFields: ProductField[] = product.fields || [];

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const colorField = productFields.find((f) => f.type === "color");
  const defaultFieldValues: { [fieldName: string]: any } = colorField
    ? { [colorField.name]: colorField.colors?.[0]?.name }
    : {};
  const [fieldValues, setFieldValues] = useState(defaultFieldValues);
  const setFieldValue = (field: ProductField, value: any) =>
    setFieldValues({ ...fieldValues, [field.name]: value });
  const getFieldValue = (field: ProductField): any => fieldValues[field.name];

  const cardImage =
    product.productImages?.find(
      (i) => !colorField || i.colorNames.includes(fieldValues[colorField.name])
    ) || getFromIndex(product.productImages, 0);
  const price = isTeam ? product.teamPrice : product.price;

  const handleReset = () => {
    setAnchorEl(null);
    setFieldValues(defaultFieldValues);
  };

  const handleNavigation = () =>
    router.push(
      `/store/${eventId}/${product.id}${
        Boolean(colorField && getFieldValue(colorField)) &&
        `?color=${getFieldValue(colorField!)}`
      }`
    );

  const handleAddToCart = () => {
    const missingFields = productFields
      .filter((f) => f.required && !getFieldValue(f))
      .map((f) => f.name);
    if (missingFields.length) {
      showError(
        `Missing required field${
          missingFields.length > 0 && "s"
        } ${missingFields.join(", ")}`
      );
      return;
    }
  };

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
            loading={!userData || loading}
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
            {productFields.map((field) =>
              field.type === "text" ? (
                <TextField
                  label={field.name + (!field.required && " (optional)")}
                  value={getFieldValue(field) || ""}
                  onChange={(e) => setFieldValue(field, e.target.value)}
                  required={field.required}
                />
              ) : field.type === "options" ? (
                <FormGroup>
                  <FormLabel>
                    {field.name}
                    {field.required ? "*" : " (optional)"}
                  </FormLabel>
                  <StringChipList
                    options={field.options}
                    selected={getFieldValue(field) && [getFieldValue(field)]}
                    setSelected={(v) =>
                      setFieldValue(field, v.length ? v[0] : undefined)
                    }
                  />
                </FormGroup>
              ) : field.type === "number" ? (
                <TextField
                  label={field.name + (!field.required && " (optional)")}
                  value={getFieldValue(field) || ""}
                  onChange={(e) =>
                    setFieldValue(
                      field,
                      e.target.value
                        .replace(/\D/, "")
                        .slice(0, field.maxChars || undefined)
                    )
                  }
                  required={field.required}
                />
              ) : (
                <></>
              )
            )}
            <LoadingButton onClick={handleAddToCart}>Confirm</LoadingButton>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
