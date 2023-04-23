import { defaultField, ProductField, ProductFieldType } from "types/product";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import ColorProductFieldEditor from "app/(RegularApp)/admin/products/ColorProductFieldEditor";
import { LovelySwitchWrapper } from "appComponents/inputs/LovelySwitch";
import MultiSelectTextField from "app/(RegularApp)/admin/products/MultiSelectTextField";
import { ArrowDropDown, ArrowDropUp, Delete } from "@mui/icons-material";

export default function SingleProductFieldEditor({
  field,
  updateField,
  deleteField,
  moveUp,
  moveDown,
}: {
  field: ProductField;
  updateField: (field: Partial<ProductField>) => void;
  deleteField: () => void;
  moveUp: () => void;
  moveDown: () => void;
}) {
  const handlePresetChange = (e: SelectChangeEvent) => {
    const fieldPreset = getPresetFieldValues(e.target.value);
    updateField(fieldPreset);
  };
  return (
    <Stack direction={"row"} spacing={2}>
      <Stack spacing={2} minHeight={"100%"} justifyContent={"center"}>
        <IconButton size={"small"} onClick={moveUp}>
          <ArrowDropUp fontSize={"small"} />
        </IconButton>
        <IconButton size={"small"} onClick={deleteField}>
          <Delete fontSize={"small"} />
        </IconButton>
        <IconButton size={"small"} onClick={moveDown}>
          <ArrowDropDown fontSize={"small"} />
        </IconButton>
      </Stack>
      <Stack spacing={2} flexGrow={1}>
        <Box maxWidth={300}>
          <FormControl fullWidth>
            <InputLabel>Field</InputLabel>
            <Select
              label={"Field"}
              value={field.presetName || ""}
              onChange={handlePresetChange}
            >
              <MenuItem value={"name"}>Name</MenuItem>
              <MenuItem value={"number"}>Number</MenuItem>
              <MenuItem value={"size"}>Size</MenuItem>
              <MenuItem value={"color"}>Color</MenuItem>
              <MenuItem value={"custom"}>Custom</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {field.custom && (
          <>
            <TextField
              label={"Field Name"}
              value={field.name}
              onChange={(e) => updateField({ name: e.target.value })}
              fullWidth
            />
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
          </>
        )}
        {field.custom && (field.type === "text" || field.type === "number") && (
          <TextField
            label={"Maximum Length"}
            value={field.maxChars}
            onChange={(e) =>
              updateField({ maxChars: parseInt(e.target.value) })
            }
            type={"number"}
            fullWidth
          />
        )}
        {field.type === "options" && (
          <MultiSelectTextField
            label={"Add Option(s)"}
            value={field.options}
            setValue={(options) => updateField({ options })}
          />
        )}
        {field.type === "color" && (
          <ColorProductFieldEditor field={field} updateField={updateField} />
        )}
        <LovelySwitchWrapper
          checked={Boolean(field.required)}
          onChange={() => updateField({ required: !field.required })}
          label={"Required"}
        />
      </Stack>
    </Stack>
  );
}

function getPresetFieldValues(preset: string): ProductField {
  const overrides: Partial<ProductField> =
    preset === "number"
      ? {
          presetName: "number",
          type: "number",
          name: "Number",
          maxChars: 2,
        }
      : preset === "name"
      ? {
          presetName: "name",
          type: "text",
          name: "Name",
        }
      : preset === "color"
      ? {
          presetName: "color",
          type: "color",
          name: "Color",
          required: true,
        }
      : preset === "size"
      ? {
          presetName: "size",
          type: "options",
          name: "Size",
          required: true,
        }
      : { presetName: "custom", custom: true };
  return {
    ...defaultField(),
    ...overrides,
  };
}
