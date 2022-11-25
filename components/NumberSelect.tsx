import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";

export default function NumberSelect({
  label,
  value,
  onChange,
  min = 0,
  max = 5,
  selectProps,
}: {
  label?: string;
  value?: number;
  onChange: (newVal: number) => void;
  min?: number;
  max?: number;
  selectProps?: SelectProps;
}): React.ReactElement {
  return (
    <FormControl fullWidth>
      <InputLabel>Quantity</InputLabel>
      <Select
        label={label}
        value={value === undefined ? "" : value.toString()}
        onChange={(e) => onChange(parseInt(e.target.value as string))}
        {...selectProps}
      >
        {Array.from({ length: max + 1 }, (_, i) => i + 1).map((num) => (
          <MenuItem key={num - 1 + min} value={(num - 1 + min).toString()}>
            {num - 1 + min}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
