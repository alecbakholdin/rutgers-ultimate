import React from "react";
import { Container, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { LovelySwitch } from "../components/LovelySwitch";

export default function Test(): React.ReactElement {
  return (
    <Container
      maxWidth={"md"}
      sx={{ display: "flex", justifyContent: "center", paddingTop: 5 }}
    >
      <FormGroup>
        <FormControlLabel control={<LovelySwitch />} label={"Test"} />
        <FormControlLabel control={<Switch />} label={"testing"} />
      </FormGroup>
    </Container>
  );
}
