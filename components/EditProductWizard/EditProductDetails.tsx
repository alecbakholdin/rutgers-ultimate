import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import CurrencyTextField from "./CurrencyTextField";
import { Product } from "../../types/product";

export default function EditProductDetails(props: {
  edits: Product | null;
  handleEdit: (edit: Partial<Product>) => void;
}): React.ReactElement {
  const { edits, handleEdit } = props;
  return (
    <Grid container spacing={1}>
      <Grid item>
        <Typography variant={"h5"}>Product Details</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={edits?.name || ""}
          onChange={(e) => handleEdit({ name: e.target.value })}
          disabled={!Boolean(edits)}
          label={"Name"}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={"Image URL"}
          disabled={!Boolean(edits)}
          fullWidth
          value={edits?.image || ""}
          onChange={(e) => handleEdit({ image: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <CurrencyTextField
          label={"Price"}
          disabled={!Boolean(edits)}
          fullWidth
          value={edits?.price || 0}
          onChange={(e) => handleEdit({ price: parseFloat(e.target.value) })}
        />
      </Grid>
      <Grid item xs={6}>
        <CurrencyTextField
          label={"Team Price"}
          disabled={!Boolean(edits)}
          fullWidth
          value={edits?.teamPrice || 0}
          onChange={(e) =>
            handleEdit({ teamPrice: parseFloat(e.target.value) })
          }
        />
      </Grid>
    </Grid>
  );
}
