import React, { useState } from "react";
import {
  Autocomplete,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { Add, Clear } from "@mui/icons-material";

export default function MultiSelectTextField({
  value,
  setValue,
  disableMultiEntry,
  ...textFieldProps
}: TextFieldProps & {
  value: string[];
  setValue: (values: string[]) => void;
  disableMultiEntry?: boolean;
}): React.ReactElement {
  const [textFieldValue, setTextFieldValue] = useState("");
  const handleUpdateValue = (newValue: string[]) => {
    setValue(
      newValue
        .flatMap((val) => (disableMultiEntry ? val : val.split(",")))
        .map((val) => val.trim())
        .filter((val) => val)
    );
    setTextFieldValue("");
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      value={value}
      getOptionLabel={(option) => option}
      onChange={(e, values) => handleUpdateValue(values)}
      inputValue={textFieldValue}
      onInputChange={(e, newValue) => setTextFieldValue(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          {...textFieldProps}
          InputProps={{
            ...params.InputProps,
            style: {
              paddingRight: "69px",
            },
            endAdornment: (
              <InputAdornment
                className={"MuiAutocomplete-endAdornment"}
                position={"end"}
                sx={{
                  position: "absolute",
                  right: "9px",
                  top: "calc(50%)",
                }}
              >
                {value.length > 0 && (
                  <IconButton size={"small"} onClick={() => setValue([])}>
                    <Clear fontSize={"small"} />
                  </IconButton>
                )}
                <IconButton
                  size={"small"}
                  onClick={() => handleUpdateValue([...value, textFieldValue])}
                >
                  <Add fontSize={"small"} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip label={option} {...getTagProps({ index })} key={index} />
        ))
      }
      options={[]}
    />
  );
}
