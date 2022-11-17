import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export default function BetterTextField(
  props: TextFieldProps & { handlePressEnter?: () => void }
): React.ReactElement {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Enter" && props.handlePressEnter) {
      props.handlePressEnter();
    }
  };

  return <TextField onKeyDown={handleKeyDown} {...props} />;
}
