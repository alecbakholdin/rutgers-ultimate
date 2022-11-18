import React, { ChangeEvent, useState } from "react";
import { ProductVariant } from "types/product";
import { Chip, Grid, Stack, Typography } from "@mui/material";
import BetterTextField from "components/BetterTextField";
import IconButton from "@mui/material/IconButton";
import { Add } from "@mui/icons-material";

export default function EditProductVariants({
  variants,
  setVariants,
  disabled,
}: {
  variants: ProductVariant[];
  setVariants: (variants: ProductVariant[]) => void;
  disabled: boolean;
}): React.ReactElement {
  const [newVariantId, setNewVariantId] = useState<string>("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewVariantId(e.target.value);
  };
  const variantIds = variants.map((v) => v.id);
  const handleCreateNewVariant = () => {
    if (newVariantId) {
      if (!variantIds.includes(newVariantId)) {
        setVariants([
          ...variants,
          { id: newVariantId, order: variants.length } as ProductVariant,
        ]);
      }
      setNewVariantId("");
    }
  };
  const handleDeleteVariant = (oldVariant: ProductVariant) => {
    setVariants(variants.filter((v) => v != oldVariant));
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant={"h5"}>Product Variants</Typography>
      </Grid>
      <Grid item xs={12}>
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <BetterTextField
            value={newVariantId}
            onChange={handleChange}
            handlePressEnter={handleCreateNewVariant}
            label={"New Variant"}
            disabled={disabled}
          />
          <IconButton
            onClick={handleCreateNewVariant}
            sx={{ width: 40, height: 40, border: "1px solid", opacity: 0.75 }}
          >
            <Add />
          </IconButton>
        </Stack>
      </Grid>
      <Grid item container xs={12} spacing={1}>
        {variants
          .sort((a, b) => a.order - b.order)
          .map((variant) => (
            <Grid item key={variant.id}>
              <Chip
                label={variant.id}
                onDelete={() => handleDeleteVariant(variant)}
              />
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
}
