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
  TextField,
} from "@mui/material";
import { Product, productCollection } from "types/product";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoadingButton from "components/LoadingButton";
import BetterTextField from "components/BetterTextField";
import { sleep } from "util/sleep";
import { LovelySwitch } from "components/LovelySwitch";

export default function () {
  const [products, loading] = useCollectionData(productCollection);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [productUpdate, setProductUpdate] = useState<Partial<Product>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const updatePending = Boolean(Object.keys(productUpdate || {}).length);

  const handleReset = () => setProductUpdate({});
  const handleSubmit = async () => {
    console.log(productUpdate);
    setSubmitLoading(true);
    await sleep(1000)
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
