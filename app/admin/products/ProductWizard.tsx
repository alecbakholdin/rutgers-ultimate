"use client";
import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Product, productCollection, ProductImage } from "types/product";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoadingButton from "components/LoadingButton";
import BetterTextField from "components/BetterTextField";
import { LovelySwitch } from "components/LovelySwitch";
import ListEditor from "components/ListEditor";
import { Color, colorCollection } from "types/color";
import ColorSwatch from "components/ColorSwatch";
import ListDisplay from "components/ListDisplay";
import { extractKey, insert, remove } from "util/array";
import { doc, updateDoc } from "@firebase/firestore";
import { isEmptyObject } from "util/object";
import StorageImage from "appComponents/StorageImage";
import { randomString } from "util/random";
import { Delete } from "@mui/icons-material";
import { deleteObject, ref, uploadBytes } from "@firebase/storage";
import { storage } from "config/firebaseApp";
import { useMySnackbar } from "hooks/useMySnackbar";

type PendingUploads = { [storagePath: string]: ArrayBuffer };

export default function ProductWizard() {
  const { showError } = useMySnackbar();
  const [products, loading] = useCollectionData(productCollection);
  const [colors, colorsLoading] = useCollectionData(colorCollection);

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [productUpdate, setProductUpdate] = useState<Partial<Product>>({});
  const [pendingUploads, setPendingUploads] = useState<PendingUploads>({});
  const [pendingDeletions, setPendingDeletions] = useState<string[]>([]);

  const [submitLoading, setSubmitLoading] = useState(false);

  const updatePending = !isEmptyObject(productUpdate);
  const colorMap = extractKey(colors, "id");
  const selectedColors = productUpdate.colors || activeProduct?.colors || [];
  const selectedColorNames = selectedColors.map((c) => c.name);
  const currentImages =
    productUpdate.productImages || activeProduct?.productImages || [];

  const handleReset = () => {
    setProductUpdate({});
    setPendingUploads({});
    setPendingDeletions([]);
  };

  const handleSubmit = async () => {
    if (!activeProduct || isEmptyObject(productUpdate)) return;

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
      await updateDoc(doc(productCollection, activeProduct.id), productUpdate);
    } catch (e: any) {
      console.error(e);
      showError(e.message);
    }
    setActiveProduct({ ...activeProduct, ...productUpdate });
    handleReset();
    setSubmitLoading(false);
  };
  const textFieldProps = (label: string, key: keyof Product) => ({
    label,
    value: productUpdate[key] || (activeProduct && activeProduct[key]) || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setProductUpdate({ ...productUpdate, [key]: e.target.value }),
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

  const updateImage = (index: number, update: Partial<ProductImage>) => {
    const oldImage = currentImages[index];
    const newImage = { ...oldImage, ...update };
    setProductUpdate({
      ...productUpdate,
      productImages: insert(currentImages, newImage, index),
    });
  };

  const handleImageUpload = (index: number) => {
    return async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      const file = e.target.files[0];
      if (file.name.lastIndexOf(".") < 0) {
        showError("File has no extension");
        return;
      }
      const extension = file.name.slice(file.name.lastIndexOf("."));
      const binaryData = await file.arrayBuffer();
      const storagePath = `product-images/${randomString(12)}${extension}`;

      updateImage(index, { storagePath });
      setPendingUploads({ ...pendingUploads, [storagePath]: binaryData });
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
              onChange={(e, newValue) => {
                handleReset();
                setActiveProduct(newValue);
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
              options={
                colors?.filter((c) => !selectedColorNames.includes(c.id)) ?? []
              }
              getOptionLabel={(p: Color) => p.id}
              onChange={(e, newValue) => {
                if (newValue) {
                  const newColor = { name: newValue.id, hex: newValue.hex };
                  setProductUpdate({
                    ...productUpdate,
                    colors: [...selectedColors, newColor],
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
          <Grid item container xs={12}>
            {currentImages.map(({ storagePath, colorNames }, i) => (
              <Grid
                key={storagePath + "_" + i}
                item
                container
                alignItems={"center"}
                spacing={2}
              >
                <Grid item>
                  <IconButton
                    onClick={() => {
                      if (!pendingUploads[storagePath]) {
                        setPendingDeletions([...pendingDeletions, storagePath]);
                      } else {
                        const { ...newUploads } = pendingUploads;
                        delete newUploads[storagePath];
                        setPendingUploads(newUploads);
                      }
                      setProductUpdate({
                        ...productUpdate,
                        productImages: remove(currentImages, i),
                      });
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
                <Grid
                  item
                  container
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexWrap={"nowrap"}
                  sx={{
                    height: 150,
                    width: 150,
                  }}
                >
                  {storagePath ? (
                    <StorageImage
                      storagePath={storagePath}
                      binary={pendingUploads[storagePath]}
                    />
                  ) : (
                    <Button component={"label"}>
                      Upload File
                      <input
                        accept={".png,.jpg,.jpeg"}
                        type={"file"}
                        hidden
                        onChange={handleImageUpload(i)}
                      />
                    </Button>
                  )}
                </Grid>

                <Grid item>
                  {selectedColors?.length ? (
                    <FormGroup>
                      <FormLabel>Colors</FormLabel>
                      <Stack flexWrap={"wrap"} sx={{ height: 126 }}>
                        {selectedColors?.map(({ name }) => {
                          const checked = colorNames?.includes(name);
                          return (
                            <FormControlLabel
                              key={name}
                              control={
                                <Checkbox
                                  checked={checked}
                                  onChange={() => {
                                    const newColorNames = checked
                                      ? colorNames?.filter((c) => c !== name)
                                      : [...colorNames, name];
                                    updateImage(i, {
                                      colorNames: newColorNames,
                                    });
                                  }}
                                />
                              }
                              label={name}
                            />
                          );
                        })}
                      </Stack>
                    </FormGroup>
                  ) : (
                    <></>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant={"contained"}
              disabled={!activeProduct}
              onClick={() =>
                setProductUpdate({
                  ...productUpdate,
                  productImages: [
                    ...currentImages,
                    { storagePath: "", colorNames: [] },
                  ],
                })
              }
            >
              Add Image
            </Button>
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
