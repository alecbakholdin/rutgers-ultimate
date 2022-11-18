import React from "react";
import {
  Button,
  ButtonProps,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { Check, Error } from "@mui/icons-material";

export type LoadingStatus = "loading" | "success" | "error";

export default function LoadingButton(
  props: ButtonProps & { status?: LoadingStatus | null }
): React.ReactElement {
  const { status } = props;
  return (
    <Grid container alignItems={"center"}>
      <Grid item>
        <Button {...props}>{props.children}</Button>
      </Grid>
      <Grid item>
        <Typography color={"primary"} textAlign={"center"}>
          {status === "loading" && (
            <CircularProgress size={15} sx={{ verticalAlign: "middle" }} />
          )}
          {status === "success" && <Check sx={{ verticalAlign: "middle" }} />}
          {status === "error" && <Error sx={{ verticalAlign: "middle" }} />}
        </Typography>
      </Grid>
    </Grid>
  );
}
