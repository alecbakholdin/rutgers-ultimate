import { ProductField } from "types/product";
import {
  Autocomplete,
  Chip,
  createFilterOptions,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Color, colorCollection } from "types/color";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ColorSwatch from "appComponents/ColorSwatch";

const filterColors = createFilterOptions<Color>();

export default function ColorProductFieldEditor({
  field,
  updateField,
}: {
  field: ProductField;
  updateField: (update: Partial<ProductField>) => void;
}) {
  const [colorArr, loading] = useCollectionData(colorCollection);
  const colors = colorArr || [];

  return (
    <Stack>
      <Autocomplete
        loading={loading}
        multiple
        options={colors}
        getOptionLabel={(p: Color) => p.id}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={field.colors.map((c) => ({ id: c.name, hex: c.hex } as Color))}
        onChange={(e, colors) =>
          updateField({
            colors: colors.map((c: Color) => ({ name: c.id, hex: c.hex })),
          })
        }
        filterOptions={(options: Color[], params) => {
          const filtered = filterColors(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              id: "",
            } as Color);
          }

          return filtered;
        }}
        renderInput={(params) => (
          <TextField {...params} label={"Add a Color"} />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <ColorSwatch hex={option.hex} />
              <Typography textOverflow={"ellipsis"}>{option.id}</Typography>
            </Stack>
          </li>
        )}
        renderTags={(value: readonly Color[], getTagProps) =>
          value.map((option: Color, index: number) => (
            <Chip
              label={option.id}
              avatar={
                <ColorSwatch
                  hex={option.hex}
                  size={20}
                  sx={{ marginLeft: 0.75 }}
                />
              }
              {...getTagProps({ index })}
              key={index}
            />
          ))
        }
      />
    </Stack>
  );
}
