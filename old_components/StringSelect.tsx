import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function StringSelect({
  label,
  value,
  values,
  onChange,
}: {
  label?: string;
  value?: string;
  values?: string[];
  onChange: (newValue: string) => void;
}): React.ReactElement {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {values?.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
