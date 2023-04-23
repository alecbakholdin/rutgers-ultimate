import {
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { defaultField, Product, ProductField } from "types/product";
import { remove, replace, swap } from "util/array";
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
      <Stack spacing={2}>
        <Typography color={"lightslategrey"} variant={"body1"}>
          Product Fields
        </Typography>
        {fields.length === 0 ? (
          <Typography variant={"body2"} color={palette.action.disabled}>
            This product has no fields
          </Typography>
        ) : (
          <Divider />
        )}
        {fields.map((field, i) => (
          <React.Fragment key={i}>
            <SingleProductFieldEditor
              key={i}
              field={field}
              updateField={(fieldUpdate) =>
                updateFields(replace(fields, { ...field, ...fieldUpdate }, i))
              }
              deleteField={() => updateFields(remove(fields, i))}
              moveUp={() => updateFields(swap(fields, i, i - 1))}
              moveDown={() => updateFields(swap(fields, i, i + 1))}
            />
            <Divider />
          </React.Fragment>
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
      </Stack>
    </FieldSection>
  );
}
