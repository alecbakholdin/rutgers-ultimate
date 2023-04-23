import React from "react";
import { Button, ButtonProps, styled } from "@mui/material";

const StyledTinyButton = styled(Button)(() => ({
  paddingLeft: 1,
  paddingRight: 1,
  fontSize: 12,
  height: "min-content",
  width: "min-content",
}));

export default function TinyButton({
  size = "small",
  variant = "outlined",
  ...buttonProps
}: ButtonProps) {
  return <StyledTinyButton variant={variant} size={size} {...buttonProps} />;
}
