import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Box, Grid, useTheme } from "@mui/material";
import { useMySnackbar } from "../../hooks/useMySnackbar";
import { useUserData2 } from "../../types/userData";
import React, { useEffect } from "react";
import CheckoutCostSummary from "./_checkoutCostSummary";
import { useCheckoutPaymentState } from "../../types/checkout";

export function CheckoutCardForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();
  const { showError } = useMySnackbar();
  const { cart, clearCart } = useUserData2();

  const { paymentState, updatePaymentState } = useCheckoutPaymentState();

  const handleSubmit = async () => {
    const cardElement = elements?.getElement(CardElement);
    if (!stripe || !cardElement) return;

    try {
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      if (error) {
        showError(
          error.message || "Unexpected error occurred. Try refreshing the page"
        );
        updatePaymentState({ paymentStatus: "error" });
      } else {
        clearCart();
        updatePaymentState({ paymentStatus: "complete" });
      }
    } catch (e) {
      showError("Unexpected error occurred. Try refreshing the page");
      updatePaymentState({ paymentStatus: "error" });
    }
  };

  useEffect(() => {
    if (paymentState.paymentStatus === "loading") {
      handleSubmit();
    }
  }, [paymentState.paymentStatus]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {cart?.length && paymentState.paymentInfo && (
          <CheckoutCostSummary
            items={cart}
            paymentInfo={paymentState.paymentInfo}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            width: "100%",
            padding: 2,
            border: `1px solid ${theme.palette.grey["400"]}`,
            borderRadius: `${theme.shape.borderRadius}px`,
          }}
        >
          <CardElement id={"card-element"} />
        </Box>
      </Grid>
    </Grid>
  );
}
