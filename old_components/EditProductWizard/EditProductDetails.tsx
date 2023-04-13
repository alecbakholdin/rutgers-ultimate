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
import ListEditor from "components/ListEditor";
import NumberSelect from "appComponents/inputs/NumberSelect";
import ColorSwatch from "appComponents/ColorSwatch";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { colorCollection } from "types/color";

export default function EditProductDetails({
  edits,
  handleEdit,
}: {
  edits: Product | null;
  handleEdit: (edit: Partial<Product>) => void;
}): React.ReactElement {
  const [colors] = useCollectionData(colorCollection, { initialValue: [] });
  const disabled = !Boolean(edits);
  const colorMap = Object.fromEntries(colors!.map(({ id, hex }) => [id, hex]));
  const renderChipAvatar = (item: string) => {
    if (!colorMap[item]) {
      return undefined;
    }
    return (
      <ColorSwatch hex={colorMap[item]} size={20} sx={{ marginLeft: 0.5 }} />
    );
  };

  const handleImageCountChange = (qty: number) => {
    if (!edits) return;
    const images = Array.from(
      { length: qty },
      (_, i) => `https://bakholdin.com/machine-pics/${edits.id}/${i}.jpg`
    );
    handleEdit({ images });
  };

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Typography variant={"h5"}>Product Details</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField value={edits?.id || ""} label={"ID"} disabled fullWidth />
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
          value={edits?.description || ""}
          onChange={(e) => handleEdit({ name: e.target.value })}
          disabled={disabled}
          label={"Description"}
          multiline
          maxRows={3}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <CurrencyTextField
          label={"Price"}
          disabled={disabled}
          fullWidth
          value={edits?.price || 0}
          onChange={(e) => handleEdit({ price: parseFloat(e.target.value) })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
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
      <Grid item xs={12} md={4}>
        <NumberSelect
          label={"Image Count"}
          value={edits?.images?.length ?? 0}
          onChange={handleImageCountChange}
          selectProps={{ disabled }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ListEditor
          items={edits?.sizes}
          label={"Sizes"}
          disabled={disabled}
          setItems={(sizes: string[]) => handleEdit({ sizes })}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ListEditor
          items={edits?.colors?.map((color) => color.name)}
          label={"Colors"}
          disabled={disabled}
          renderChipAvatar={renderChipAvatar}
          setItems={(colors: string[]) =>
            handleEdit({ colors: colors.map((name) => ({ name })) })
          }
        />
      </Grid>
      <Grid item xs={12} md={4}>
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
