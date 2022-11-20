import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export default function BetterTextField(
  props: TextFieldProps & {
    handlePressEnter?: () => void;
    handlePressControlEnter?: () => void;
  }
): React.ReactElement {
  const { handlePressEnter, handlePressControlEnter, ...textFieldProps } =
    props;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Enter") {
      if (e.getModifierState("Control") && handlePressControlEnter) {
        handlePressControlEnter();
      } else if (handlePressEnter) {
        handlePressEnter();
      }
    }
  };

  return <TextField onKeyDown={handleKeyDown} {...textFieldProps} />;
}
