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
    <Grid container spacing={0.1} alignItems={"start"} flexWrap={"nowrap"}>
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
              $
              {`${Math.floor(amount)}`
                .split("")
                .reverse()
                .reduce(
                  (prev, curr) =>
                    prev.length % 4 === 3 ? curr + "," + prev : curr + prev,
                  ""
                )}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant={"body1"}
              color={"primary"}
              fontSize={smallSize}
              lineHeight={lineHeight}
            >
              {Math.floor((amount * 100) % 100)
                .toString()
                .padStart(2, "0")}
            </Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
}
