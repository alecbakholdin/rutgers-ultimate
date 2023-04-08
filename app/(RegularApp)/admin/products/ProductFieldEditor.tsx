import { Button, Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import { defaultField, Product, ProductField } from "types/product";
import { remove, replace } from "util/array";
import SingleProductFieldEditor from "app/(RegularApp)/admin/products/SingleProductFieldEditor";
import FieldSection from "appComponents/FieldSection";

export default function ProductFieldEditor({
  product,
  updatedProduct,
  changes,
  setChanges,
}: {
  product: Product | null;
  updatedProduct: Product;
  changes: Partial<Product>;
  setChanges: (update: Partial<Product>) => void;
}) {
  const { palette } = useTheme();
  const fields = updatedProduct.fields;
  const updateFields = (fields: ProductField[]) =>
    setChanges({ ...changes, fields });
  const handleNewField = () => updateFields([...fields, defaultField()]);

  return (
    <FieldSection>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography color={"lightslategrey"} variant={"body1"}>
            Product Fields
          </Typography>
        </Grid>
        {fields.length === 0 && (
          <Grid item xs={12}>
            <Typography variant={"body2"} color={palette.action.disabled}>
              This product has no fields
            </Typography>
          </Grid>
        )}
        {fields.map((field, i) => (
          <Grid item xs={12} key={i} paddingTop={6}>
            <SingleProductFieldEditor
              field={field}
              updateField={(fieldUpdate) =>
                updateFields(replace(fields, { ...field, ...fieldUpdate }, i))
              }
              deleteField={() => updateFields(remove(fields, i))}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            disabled={!product}
            size={"small"}
            variant={"outlined"}
            onClick={handleNewField}
            sx={{ fontSize: 12, paddingLeft: 1, paddingRight: 1 }}
          >
            New Field
          </Button>
        </Grid>
      </Grid>
    </FieldSection>
  );
}
