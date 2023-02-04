import { CheckoutState } from "../types/checkout";
import { Box, Grid, useTheme } from "@mui/material";
import { CreditCard, SentimentSatisfiedAlt, Tune } from "@mui/icons-material";
import React from "react";

export function CheckoutStateIndicator({
  checkoutState,
}: {
  checkoutState: CheckoutState;
}) {
  const {
    palette: {
      primary,
      grey: { "400": grey },
    },
  } = useTheme();

  return (
    <Grid item xs={12} container alignItems={"center"}>
      <Grid item>
        <Tune color={"primary"} fontSize={"large"} />
      </Grid>
      <Grid item flexGrow={1}>
        <Box
          width={"80%"}
          height={5}
          bgcolor={checkoutState === "config" ? grey : primary.main}
          margin={"auto"}
        />
      </Grid>
      <Grid item>
        <CreditCard
          color={
            checkoutState === "payment" || checkoutState === "thank"
              ? "primary"
              : "disabled"
          }
          fontSize={"large"}
        />
      </Grid>
      <Grid item flexGrow={1}>
        <Box
          width={"80%"}
          height={5}
          bgcolor={checkoutState === "thank" ? primary.main : grey}
          margin={"auto"}
        />
      </Grid>
      <Grid item>
        <SentimentSatisfiedAlt
          color={checkoutState === "thank" ? "primary" : "disabled"}
          fontSize={"large"}
        />
      </Grid>
    </Grid>
  );
}
