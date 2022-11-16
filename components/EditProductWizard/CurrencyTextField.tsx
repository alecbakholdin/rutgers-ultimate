import React, { useEffect, useState } from "react";
import { InputAdornment, TextField, TextFieldProps } from "@mui/material";

export default function CurrencyTextField(
  props: TextFieldProps & {
    value: number;
  }
): React.ReactElement {
  const [textValue, setTextValue] = useState<string>(
    props.value?.toString() || ""
  );
  useEffect(() => {
    if (props.value !== parseFloat(textValue)) {
      setTextValue(props.value?.toString());
    }
  }, [props.value]);

  return (
    <TextField
      {...props}
      value={textValue}
      onChange={(e) => {
        e.target.value = e.target.value.replace(/[^\d.]/, "");
        setTextValue(e.target.value);
        if (props.onChange) {
          props.onChange(e);
        }
      }}
      InputProps={{
        startAdornment: <InputAdornment position={"start"}>$</InputAdornment>,
        ...props.InputProps,
      }}
    />
  );
}
