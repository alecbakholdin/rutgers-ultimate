import React from "react";
import { styled, Switch } from "@mui/material";

const width = 56;
const height = 34;
const size = 18;
const margin = 8;
const borderWidth = 2;

export const LovelySwitch = styled(Switch)(({ theme }) => ({
  width,
  height,
  padding: 0,
  margin: 8,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: `translateX(${width - size - margin * 2}px)`,
      color: "#fff",
      "& + .MuiSwitch-track": {
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
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    width: size,
    height: size,
    boxShadow: "none",
    backgroundColor: theme.palette.grey[600],
    transition: theme.transitions.create(["background-color"]),
  },
  "& .MuiSwitch-track": {
    borderRadius: 40,
    border: `solid`,
    borderColor: theme.palette.grey[600],
    borderWidth,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border-color"]),
  },
}));
