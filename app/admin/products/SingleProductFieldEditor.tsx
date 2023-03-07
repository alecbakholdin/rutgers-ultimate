import { ProductField, ProductFieldType } from "types/product";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import React from "react";
import { remove } from "util/array";
import StringChipList from "appComponents/StringChipList";
import ListEditorTextField from "appComponents/ListEditorTextField";
import ColorProductFieldEditor from "app/admin/products/ColorProductFieldEditor";
import { LovelySwitch } from "components/LovelySwitch";

export default function SingleProductFieldEditor({
  field,
  updateField,
  deleteField,
}: {
  field: ProductField;
  updateField: (field: Partial<ProductField>) => void;
  deleteField: () => void;
}) {
  return (
    <Grid item xs={12} container alignItems={"center"} flexWrap={"nowrap"}>
      <Grid item>
        <IconButton onClick={deleteField}>
          <Delete />
        </IconButton>
      </Grid>
      <Grid item container spacing={1}>
        <Grid
          item
          container
          spacing={1}
          flexGrow={1}
          flexBasis={"150px"}
          flexDirection={"column"}
          maxWidth={"400px"}
        >
          <Grid item>
            <TextField
              label={"Field Name"}
              value={field.name}
              onChange={(e) => updateField({ name: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel>Field Type</InputLabel>
              <Select
                label={"Field Type"}
                value={field.type}
                onChange={(e) =>
                  updateField({ type: e.target.value as ProductFieldType })
                }
              >
                <MenuItem value={"text"}>Text</MenuItem>
                <MenuItem value={"number"}>Number</MenuItem>
                <MenuItem value={"options"}>Options</MenuItem>
                <MenuItem value={"color"}>Color</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {(field.type === "text" || field.type === "number") && (
            <Grid item maxWidth={"400px"}>
              <TextField
                label={"Maximum Length"}
                value={field.maxChars}
                onChange={(e) =>
                  updateField({ maxChars: parseInt(e.target.value) })
                }
                type={"number"}
                fullWidth
              />
            </Grid>
          )}
        </Grid>
        {field.type === "options" && (
          <Grid item flexGrow={1} flexBasis={"200px"}>
            <Stack spacing={1}>
              <ListEditorTextField
                label={"Add Option(s)"}
                onAdd={(addValues) =>
                  updateField({ options: [...field.options, ...addValues] })
                }
              />
              <StringChipList
                options={field.options}
                onDeleteChip={(i) =>
                  updateField({ options: remove(field.options, i) })
                }
              />
            </Stack>
          </Grid>
        )}
        {field.type === "color" && (
          <Grid item flexGrow={1} flexBasis={"200px"}>
            <ColorProductFieldEditor field={field} updateField={updateField} />
          </Grid>
        )}
        <Grid item>
          <FormGroup>
            <FormControlLabel
              control={
                <LovelySwitch
                  checked={Boolean(field.required)}
                  onChange={() => updateField({ required: !field.required })}
                />
              }
              label={"Required"}
            />
          </FormGroup>
        </Grid>
      </Grid>
    </Grid>
  );
}
