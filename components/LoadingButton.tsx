import React from "react";
import { Button, ButtonProps, CircularProgress } from "@mui/material";

export default function LoadingButton({
  loading,
  loadingIndicatorSize = 25,
  children,
  ...buttonProps
}: {
  loadingIndicatorSize?: number;
  loading?: boolean;
} & ButtonProps): React.ReactElement {
  return (
    <Button {...buttonProps}>
      {loading ? (
        <CircularProgress color={"inherit"} size={loadingIndicatorSize} />
      ) : (
        children
      )}
    </Button>
  );
}
