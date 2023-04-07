import React, { useMemo, useRef } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const width = useMemo(
    () => (loading ? ref.current?.offsetWidth : undefined),
    [loading]
  );

  return (
    <div ref={ref} style={{ width: "fit-content" }}>
      <Button sx={{ width }} {...buttonProps}>
        {loading ? (
          <CircularProgress color={"inherit"} size={loadingIndicatorSize} />
        ) : (
          children
        )}
      </Button>
    </div>
  );
}
