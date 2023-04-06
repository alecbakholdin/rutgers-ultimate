import {
  CheckoutConfig,
  CheckoutState,
  useCheckoutPaymentState,
} from "types/checkout";
import React, { useEffect } from "react";
import { useMySnackbar } from "hooks/useMySnackbar";
import { Grid, Paper } from "@mui/material";
import LoadingButton from "components/LoadingButton";

export function CheckoutNavigation({
  checkoutConfig,
  checkoutState,
  setCheckoutState,
}: {
  checkoutConfig: CheckoutConfig;
  checkoutState: CheckoutState;
  setCheckoutState: (val: CheckoutState) => void;
}): React.ReactElement {
  const {
    paymentState: { intentLoading, paymentStatus },
    updatePaymentState,
  } = useCheckoutPaymentState();

  const { showError } = useMySnackbar();
  useEffect(() => {
    if (paymentStatus === "complete") {
      setCheckoutState("thank");
    }
  }, [paymentStatus]);

  const handleMoveToPayment = () => {
    const { firstName, lastName, phoneNumber } = checkoutConfig;
    const { deliveryMethod, address, city, state, zipCode } = checkoutConfig;
    if (!firstName || !lastName || !phoneNumber) {
      showError("Please fill out all your personal details");
    } else if (
      deliveryMethod === "delivery" &&
      (!address || !city || !state || !zipCode)
    ) {
      showError("Please fill in all fields for your shipping address");
    } else {
      setCheckoutState("payment");
    }
  };
  const handleNext = () => {
    if (checkoutState === "config") {
      handleMoveToPayment();
    } else if (checkoutState === "payment") {
      updatePaymentState({ paymentStatus: "loading" });
    }
  };

  const handleBack = () => {
    if (checkoutState === "payment") {
      setCheckoutState("config");
    }
  };

  return (
    <Grid container justifyContent={"space-between"}>
      <Grid item>
        {checkoutState === "payment" && (
          <Paper>
            <LoadingButton onClick={handleBack}>Back</LoadingButton>
          </Paper>
        )}
      </Grid>
      <Grid item>
        {checkoutState !== "thank" && (
          <LoadingButton
            loading={paymentStatus === "loading" || intentLoading}
            onClick={handleNext}
            variant={"contained"}
          >
            {checkoutState === "payment" ? "Pay Now" : "Next"}
          </LoadingButton>
        )}
      </Grid>
    </Grid>
  );
}
