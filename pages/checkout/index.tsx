import React, { useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { CheckoutConfig, CheckoutState } from "../../types/checkout";
import { CheckoutStateIndicator } from "./_checkoutStateIndicator";
import { CheckoutConfigSection } from "./_checkoutConfigSection";
import { useUserData2 } from "../../types/userData";
import { CheckoutStripePaymentForm } from "./_checkoutStripePaymentForm";
import { CheckoutNavigation } from "./_checkoutNavigation";

export default function Index(): React.ReactElement {
  const { cart } = useUserData2();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("config");
  const [checkoutConfig, setCheckoutConfig] = useState<CheckoutConfig>({
    deliveryMethod: "pickup",
    pickupLocation: "bid",
  });

  return (
    <Container maxWidth={"md"} sx={{ paddingTop: 5 }}>
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
        {checkoutState === "payment" && cart?.length && (
          <Grid item xs={12}>
            <CheckoutStripePaymentForm
              checkoutConfig={checkoutConfig}
              cart={cart}
            />
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
    </Container>
  );
}
