"use client";
import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { CheckoutConfig, CheckoutState } from "types/checkout";
import { CheckoutStateIndicator } from "app/checkout/_checkoutStateIndicator";
import { CheckoutConfigSection } from "app/checkout/_checkoutConfigSection";
import { CheckoutStripePaymentForm } from "app/checkout/_checkoutStripePaymentForm";
import { CheckoutNavigation } from "app/checkout/_checkoutNavigation";

export default function Index(): React.ReactElement {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("config");
  const [checkoutConfig, setCheckoutConfig] = useState<CheckoutConfig>({
    deliveryMethod: "pickup",
    pickupLocation: "bid",

    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",

    sendEmailReceipt: false,
  });

  return (
    <Grid container rowGap={2}>
      <CheckoutStateIndicator checkoutState={checkoutState} />
      {checkoutState === "config" && (
        <Grid item xs={12}>
          <CheckoutConfigSection
            checkoutConfig={checkoutConfig}
            setCheckoutConfig={setCheckoutConfig}
          />
        </Grid>
      )}
      {checkoutState === "payment" && (
        <Grid item xs={12}>
          <CheckoutStripePaymentForm checkoutConfig={checkoutConfig} />
        </Grid>
      )}
      {checkoutState === "thank" && (
        <Grid
          item
          xs={12}
          container
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ paddingTop: 10, paddingBottom: 10 }}
        >
          <Typography variant={"h4"} color={"primary"}>
            Thank you for your order!
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <CheckoutNavigation
          checkoutConfig={checkoutConfig}
          checkoutState={checkoutState}
          setCheckoutState={setCheckoutState}
        />
      </Grid>
    </Grid>
  );
}
