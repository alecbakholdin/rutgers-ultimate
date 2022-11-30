import React from "react";
import {
  Button,
  ButtonProps,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { Check, Error, PendingOutlined as Pending } from "@mui/icons-material";

export type LoadingStatus =
  | "pending"
  | "loading"
  | "success"
  | "error"
  | undefined;

export default function LoadingButton(
  props: ButtonProps & { status?: LoadingStatus | null }
): React.ReactElement {
  const { status } = props;

  return (
    <Grid container alignItems={"center"}>
      <Grid item sx={props.sx}>
        <Button {...props}>{props.children}</Button>
      </Grid>
      <Grid item>
        <Typography color={"primary"} textAlign={"center"}>
          {status === "loading" && (
            <CircularProgress size={15} sx={{ verticalAlign: "middle" }} />
          )}
          {status === "pending" && <Pending sx={{ verticalAlign: "middle" }} />}
          {status === "success" && <Check sx={{ verticalAlign: "middle" }} />}
          {status === "error" && <Error sx={{ verticalAlign: "middle" }} />}
        </Typography>
      </Grid>
    </Grid>
  );
}
