import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export default function BetterTextField(
  props: TextFieldProps & { handlePressEnter?: () => void }
): React.ReactElement {
  const { handlePressEnter, ...textFieldProps } = props;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Enter" && handlePressEnter) {
      handlePressEnter();
    }
  };

  return <TextField onKeyDown={handleKeyDown} {...textFieldProps} />;
}
