import {
  Box,
  Button,
  FormGroup,
  FormLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import FieldSection from "appComponents/FieldSection";
import React from "react";
import { defaultProductImage, Product, ProductImage } from "types/product";
import { remove, replace } from "util/array";
import { randomString } from "util/random";
import { useMySnackbar } from "hooks/useMySnackbar";
import { Delete } from "@mui/icons-material";
import StorageImage from "appComponents/StorageImage";
import StringChipList from "appComponents/StringChipList";

export type PendingUploads = { [storagePath: string]: ArrayBuffer };
export default function ProductImageEditor({
  product,
  updatedProduct,
  changes,
  setChanges,
  pendingUploads,
  setPendingUploads,
  pendingDeletions,
  setPendingDeletions,
}: {
  product: Product | null;
  updatedProduct: Product;
  changes: Partial<Product>;
  setChanges: (update: Partial<Product>) => void;
  pendingUploads: PendingUploads;
  setPendingUploads: (newValue: PendingUploads) => void;
  pendingDeletions: string[];
  setPendingDeletions: (newValue: string[]) => void;
}) {
  const { showError } = useMySnackbar();

  const images = updatedProduct.productImages || [];
  const updateChanges = (update: Partial<Product>) =>
    setChanges({ ...changes, ...update });

  const updateImage = (index: number, update: Partial<ProductImage>) => {
    const oldImage = images[index];
    const newImage = { ...oldImage, ...update };
    setChanges({
      ...changes,
      productImages: replace(images, newImage, index),
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
  const handleNewImage = () => {
    updateChanges({
      productImages: [...images, defaultProductImage()],
    });
  };

  return (
    <FieldSection>
      <Stack spacing={2}>
        <Typography color={"lightslategrey"} variant={"body1"}>
          Product Images
        </Typography>
        {images.map(({ storagePath, colorNames }, i) => (
          <Stack
            key={storagePath + "_" + i}
            direction={"row"}
            alignItems={"center"}
            spacing={2}
          >
            <IconButton
              onClick={() => {
                if (!pendingUploads[storagePath]) {
                  setPendingDeletions([...pendingDeletions, storagePath]);
                } else {
                  const { ...newUploads } = pendingUploads;
                  delete newUploads[storagePath];
                  setPendingUploads(newUploads);
                }
                setChanges({
                  ...changes,
                  productImages: remove(images, i),
                });
              }}
            >
              <Delete />
            </IconButton>

            <Box
              justifyContent={"center"}
              alignItems={"center"}
              display={"flex"}
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
            </Box>
            {product?.fields
              ?.filter((f) => f.type === "color")
              .map(({ name, colors }) => (
                <FormGroup key={name}>
                  <FormLabel>{name}</FormLabel>
                  <StringChipList
                    options={colors?.map((c) => c.name)}
                    selected={colorNames}
                    setSelected={(items) =>
                      updateImage(i, { colorNames: items })
                    }
                    multiSelect
                  />
                </FormGroup>
              ))}
          </Stack>
        ))}
        <Box>
          <Button
            disabled={!product}
            size={"small"}
            variant={"outlined"}
            onClick={handleNewImage}
            sx={{ fontSize: 12, paddingLeft: 1, paddingRight: 1 }}
          >
            New Image
          </Button>
        </Box>
      </Stack>
    </FieldSection>
  );
}
