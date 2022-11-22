import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import CurrencyTextField from "./CurrencyTextField";
import { Product } from "types/product";

export default function EditProductDetails(props: {
  edits: Product | null;
  handleEdit: (edit: Partial<Product>) => void;
}): React.ReactElement {
  const { edits, handleEdit } = props;
  const disabled = !Boolean(edits);

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Typography variant={"h5"}>Product Details</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={edits?.name || ""}
          onChange={(e) => handleEdit({ name: e.target.value })}
          disabled={disabled}
          label={"Name"}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={"Image URL"}
          disabled={disabled}
          fullWidth
          value={edits?.image || ""}
          onChange={(e) => handleEdit({ image: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <CurrencyTextField
          label={"Price"}
          disabled={disabled}
          fullWidth
          value={edits?.price || 0}
          onChange={(e) => handleEdit({ price: parseFloat(e.target.value) })}
        />
      </Grid>
      <Grid item xs={6}>
        <CurrencyTextField
          label={"Team Price"}
          disabled={disabled}
          fullWidth
          value={edits?.teamPrice || 0}
          onChange={(e) =>
            handleEdit({ teamPrice: parseFloat(e.target.value) })
          }
        />
      </Grid>
      <Grid item xs={12}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(edits?.canHaveName)}
                disabled={disabled}
                onChange={() =>
                  handleEdit({ canHaveName: !edits?.canHaveName })
                }
              />
            }
            label={"Name"}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(edits?.canHaveNumber)}
                disabled={disabled}
                onChange={() =>
                  handleEdit({ canHaveNumber: !edits?.canHaveNumber })
                }
              />
            }
            label={"Number"}
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
}
