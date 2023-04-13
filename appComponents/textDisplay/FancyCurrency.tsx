"use client";
import { CircularProgress, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

export default function FancyCurrency({
  amount,
  size = 14,
  loading,
}: {
  amount: number;
  size: number;
  loading?: boolean;
}) {
  const smallSize = (size * 5) / 9;
  const lineHeightPercent = 70;
  const lineHeight = lineHeightPercent + "%";

  return (
    <Grid
      item
      container
      xs={6}
      spacing={0.1}
      alignItems={"start"}
      flexWrap={"nowrap"}
    >
      {loading ? (
        <Grid item>
          <CircularProgress size={10} />
        </Grid>
      ) : (
        <>
          <Grid item>
            <Typography
              variant={"body1"}
              color={"primary"}
              width={"fit-content"}
              fontSize={size}
              lineHeight={lineHeight}
            >
              ${Math.floor(amount)}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant={"body1"}
              color={"primary"}
              fontSize={smallSize}
              lineHeight={lineHeight}
            >
              {Math.floor(amount % 1)
                .toPrecision(3)
                .slice(-2)}
            </Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
}
