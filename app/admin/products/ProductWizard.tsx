"use client";
import React, { useState } from "react";
import {
  Autocomplete,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Product, productCollection } from "types/product";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoadingButton from "components/LoadingButton";
import BetterTextField from "components/BetterTextField";
import { LovelySwitch } from "components/LovelySwitch";
import ListEditor from "components/ListEditor";
import { Color, colorCollection } from "types/color";
import ColorSwatch from "components/ColorSwatch";
import ListDisplay from "components/ListDisplay";
import { extractKey } from "util/array";
import { doc, updateDoc } from "@firebase/firestore";
import { isEmptyObject } from "util/object";

export default function () {
  const [products, loading] = useCollectionData(productCollection);
  const [colors, colorsLoading] = useCollectionData(colorCollection);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [productUpdate, setProductUpdate] = useState<Partial<Product>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const updatePending = Boolean(Object.keys(productUpdate || {}).length);
  const colorMap = extractKey(colors, "id");
  const selectedColors = productUpdate.colors || activeProduct?.colors || [];

  const handleReset = () => setProductUpdate({});
  const handleSubmit = async () => {
    if (!activeProduct || isEmptyObject(productUpdate)) return;
    const productRef = doc(productCollection, activeProduct.id);

    setSubmitLoading(true);
    await updateDoc(productRef, productUpdate)
      .then(() => setActiveProduct({ ...activeProduct, ...productUpdate }))
      .then(handleReset)
      .finally(() => setSubmitLoading(false));
  };
  const textFieldProps = (label: string, key: keyof Product) => ({
    label,
    value: productUpdate[key] || (activeProduct && activeProduct[key]) || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      setProductUpdate({ ...productUpdate, [key]: e.target.value });
    },
    disabled: !activeProduct,
    fullWidth: true,
    handlePressControlEnter: handleSubmit,
  });

  const switchProps = (key: keyof Product) => {
    const checked = Boolean(
      productUpdate[key] ?? (activeProduct && activeProduct[key])
    );
    return {
      checked,
      onChange: () => setProductUpdate({ ...productUpdate, [key]: !checked }),
      disabled: !activeProduct,
    };
  };

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader title={"Products"} />

      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Autocomplete
              options={products ?? []}
              getOptionLabel={(p: Product) => p.name}
              onChange={(e, newValue) => setActiveProduct(newValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={loading}
              renderInput={(params) => {
                // @ts-ignore
                const { key, ...p } = params;
                return <TextField {...p} label={"Select Product"} />;
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <BetterTextField {...textFieldProps("Id", "id")} disabled />
          </Grid>
          <Grid item xs={12}>
            <BetterTextField {...textFieldProps("Name", "name")} />
          </Grid>
          <Grid item xs={12}>
            <BetterTextField
              {...textFieldProps("Description", "description")}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={<LovelySwitch {...switchProps("canHaveName")} />}
              label={"Can Have Name"}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={<LovelySwitch {...switchProps("canHaveNumber")} />}
              label={"Can Have Number"}
            />
          </Grid>
          <Grid item xs={12}>
            <ListEditor
              label={"Sizes"}
              items={productUpdate.sizes || activeProduct?.sizes}
              setItems={(sizes) =>
                setProductUpdate({ ...productUpdate, sizes })
              }
              disabled={!activeProduct}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disabled={!activeProduct}
              options={colors ?? []}
              getOptionLabel={(p: Color) => p.id}
              onChange={(e, newValue) => {
                if (
                  newValue &&
                  !selectedColors.map((c) => c.name).includes(newValue.id)
                ) {
                  setProductUpdate({
                    ...productUpdate,
                    colors: [
                      ...selectedColors,
                      { name: newValue.id, hex: newValue.hex },
                    ],
                  });
                }
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={colorsLoading}
              renderInput={(params) => {
                // @ts-ignore
                const { key, ...p } = params;
                return <TextField {...p} label={"Add a Color"} />;
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <ColorSwatch hex={option.hex} />
                    <Typography textOverflow={"ellipsis"}>
                      {option.id}
                    </Typography>
                  </Stack>
                </li>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <ListDisplay
              items={selectedColors.map((i) => i.name)}
              renderChipAvatar={(item) => (
                <ColorSwatch
                  hex={colorMap[item]?.hex}
                  sx={{ marginLeft: 0.7 }}
                />
              )}
              handleDeleteItem={(toDelete) =>
                setProductUpdate({
                  ...productUpdate,
                  colors: selectedColors.filter((c) => c.name !== toDelete),
                })
              }
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container spacing={1} sx={{ padding: 1 }}>
          <Grid item>
            <LoadingButton
              variant={"contained"}
              disabled={!updatePending || !activeProduct}
              onClick={handleSubmit}
              loading={submitLoading}
            >
              Submit Changes
            </LoadingButton>
          </Grid>
          <Grid item>
            <LoadingButton
              variant={"contained"}
              disabled={!updatePending || !activeProduct}
              onClick={handleReset}
              loading={submitLoading}
            >
              Reset
            </LoadingButton>
          </Grid>
          <Grid item flexGrow={1} />
          <Grid item>
            <LoadingButton variant={"contained"}>New</LoadingButton>
          </Grid>
          <Grid item>
            <LoadingButton variant={"contained"} disabled={!activeProduct}>
              Delete
            </LoadingButton>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
