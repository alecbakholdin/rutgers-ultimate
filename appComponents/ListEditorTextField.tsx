import { IconButton, Stack } from "@mui/material";
import BetterTextField from "components/BetterTextField";
import { Add } from "@mui/icons-material";
import React, { useState } from "react";

export default function ListEditorTextField({
  label,
  onAdd,
  disableMultiAdd,
  multiAddDelimiter = ",",
}: {
  label?: string;
  onAdd?: (addValue: string[]) => void | Promise<void>;
  disableMultiAdd?: boolean;
  multiAddDelimiter?: string;
}) {
  const [value, setValue] = useState("");
  const handleAdd = async () => {
    const valuesToAdd = disableMultiAdd
      ? [value]
      : value.split(multiAddDelimiter).map((val) => val.trim());
    onAdd && onAdd(valuesToAdd);
    setValue("");
  };
  return (
    <Stack direction={"row"}>
      <BetterTextField
        fullWidth
        label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        handlePressEnter={handleAdd}
        InputProps={{
          endAdornment: (
            <IconButton size={"small"} onClick={handleAdd}>
              <Add />
            </IconButton>
          ),
        }}
      />
    </Stack>
  );
}
