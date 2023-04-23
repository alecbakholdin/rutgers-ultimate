import React from "react";
import { FormControlLabel, FormGroup, styled, Switch } from "@mui/material";

const width = 54;
const height = 30;
const size = (height + 2) / 2;
const margin = (height - size) / 2;
const borderWidth = 2;

export const LovelySwitch = styled(Switch)(({ theme }) => ({
  width,
  height,
  padding: 0,
  margin,
  marginLeft: margin + 4,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: `translateX(${width - size - margin * 2}px)`,
      color: "#fff",
      "& + .MuiSwitch-track": {
        borderWidth: 1,
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        borderColor: theme.palette.primary.main,
      },
      "& .MuiSwitch-thumb": {
        backgroundColor: "#fff",
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
      opacity: theme.palette.mode === "light" ? 0.5 : 0.3,
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.5 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    width: size,
    height: size,
    boxShadow: "none",
    backgroundColor: theme.palette.grey[500],
    transition: theme.transitions.create(["background-color"]),
  },
  "& .MuiSwitch-track": {
    borderRadius: 40,
    border: `solid`,
    borderColor: theme.palette.grey[400],
    borderWidth,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border-color"]),
  },
}));

export function LovelySwitchWrapper({
  checked,
  onChange,
  label,
}: {
  checked?: boolean;
  onChange?: () => void;
  label?: string;
}): React.ReactElement {
  return (
    <FormGroup>
      <FormControlLabel
        control={<LovelySwitch checked={checked} onChange={onChange} />}
        label={label}
      />
    </FormGroup>
  );
}
