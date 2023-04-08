"use client";
import React, { useState } from "react";
import { Autocomplete, Grid, Stack, TextField } from "@mui/material";
import { defaultProduct, Product, productCollection } from "types/product";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoadingButton from "components/LoadingButton";
import BetterTextField from "components/BetterTextField";
import { doc, updateDoc } from "@firebase/firestore";
import { isEmptyObject } from "util/object";
import { deleteObject, ref, uploadBytes } from "@firebase/storage";
import { storage } from "config/firebaseApp";
import { useMySnackbar } from "hooks/useMySnackbar";
import ProductFieldEditor from "app/(RegularApp)/admin/products/ProductFieldEditor";
import ProductImageEditor, {
  PendingUploads,
} from "app/(RegularApp)/admin/products/ProductImageEditor";

export default function ProductWizard() {
  const { showError } = useMySnackbar();
  const [products, loading] = useCollectionData(productCollection);

  const [product, setProduct] = useState<Product | null>(null);
  const [changes, setChanges] = useState<Partial<Product>>({});
  const [pendingUploads, setPendingUploads] = useState<PendingUploads>({});
  const [pendingDeletions, setPendingDeletions] = useState<string[]>([]);

  const [submitLoading, setSubmitLoading] = useState(false);

  const updatePending = !isEmptyObject(changes);
  const updatedProduct: Product = {
    ...defaultProduct(),
    ...product,
    ...changes,
  };

  const handleReset = () => {
    setChanges({});
    setPendingUploads({});
    setPendingDeletions([]);
  };

  const handleSubmit = async () => {
    if (!product || isEmptyObject(changes)) return;

    setSubmitLoading(true);
    try {
      for (const storagePath of pendingDeletions) {
        if (!storagePath) continue;
        await deleteObject(ref(storage, storagePath));
      }
      for (const storagePath of Object.keys(pendingUploads)) {
        const extension = storagePath.slice(storagePath.lastIndexOf(".") + 1);
        const contentType = ["jpeg", "jpg"].includes(extension)
          ? "image/jpeg"
          : "image/png";
        await uploadBytes(
          ref(storage, storagePath),
          pendingUploads[storagePath],
          { contentType }
        );
      }
      await updateDoc(doc(productCollection, product.id), changes);
    } catch (e: any) {
      console.error(e);
      showError(e.message);
    }
    setProduct({ ...product, ...changes });
    handleReset();
    setSubmitLoading(false);
  };
  const textFieldProps = (label: string, key: keyof Product) => ({
    label,
    value: updatedProduct[key] || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setChanges({ ...changes, [key]: e.target.value }),
    disabled: !product,
    fullWidth: true,
    handlePressControlEnter: handleSubmit,
  });

  return (
    <Stack>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Autocomplete
            options={products ?? []}
            getOptionLabel={(p: Product) => p.name}
            onChange={(e, newValue) => {
              handleReset();
              setProduct(newValue);
            }}
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
        <Grid item xs={12}>
          <ProductFieldEditor
            product={product}
            updatedProduct={updatedProduct}
            changes={changes}
            setChanges={setChanges}
          />
        </Grid>
        <Grid item xs={12}>
          <ProductImageEditor
            product={product}
            updatedProduct={updatedProduct}
            changes={changes}
            setChanges={setChanges}
            pendingUploads={pendingUploads}
            setPendingUploads={setPendingUploads}
            pendingDeletions={pendingDeletions}
            setPendingDeletions={setPendingDeletions}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ padding: 1 }}>
        <Grid item>
          <LoadingButton
            variant={"contained"}
            disabled={!updatePending || !product}
            onClick={handleSubmit}
            loading={submitLoading}
          >
            Submit Changes
          </LoadingButton>
        </Grid>
        <Grid item>
          <LoadingButton
            variant={"contained"}
            disabled={!updatePending || !product}
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
          <LoadingButton variant={"contained"} disabled={!product}>
            Delete
          </LoadingButton>
        </Grid>
      </Grid>
    </Stack>
  );
}
