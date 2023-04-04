import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Box, Grid, useTheme } from "@mui/material";
import { useMySnackbar } from "hooks/useMySnackbar";
import { CartItem } from "types/userData";
import React, { useEffect } from "react";
import CheckoutCostSummary from "app/checkout/_checkoutCostSummary";
import { CheckoutConfig, useCheckoutPaymentState } from "types/checkout";
import { Order, orderCollection } from "types/order";
import { distinctEntries } from "util/array";
import { addDoc, doc } from "@firebase/firestore";
import { useAuth } from "components/AuthProvider";

const unexpectedErrorMsg = "Unexpected error occurred. Try refreshing the page";

export function CheckoutCardForm({
  checkoutConfig,
  clientSecret,
  cart,
}: {
  checkoutConfig: CheckoutConfig;
  clientSecret: string;
  cart: CartItem[];
}) {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();
  const { showError } = useMySnackbar();
  const { userData } = useAuth();

  const { paymentState, updatePaymentState } = useCheckoutPaymentState();

  const handleSubmit = async () => {
    const cardElement = elements?.getElement(CardElement);
    if (!stripe || !cardElement || !userData || !paymentState.paymentInfo)
      return;

    try {
      const newOrder: Order = {
        id: "",
        ref: doc(orderCollection),
        uid: userData.id,
        email: checkoutConfig.email,
        phoneNumber: checkoutConfig.phoneNumber,
        firstName: checkoutConfig.firstName,
        lastName: checkoutConfig.lastName,
        totalCost: paymentState.paymentInfo.total,
        isTeam: Boolean(userData.isTeam),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        cart,
        eventIds: distinctEntries(cart.map((i) => i.event)),

        requested: true,
        paid: true,
        delivered: false,

        deliveryMethod: checkoutConfig.deliveryMethod,
        ...(checkoutConfig.deliveryMethod === "pickup"
          ? { pickupLocation: checkoutConfig.deliveryMethod }
          : checkoutConfig.deliveryMethod === "delivery"
          ? {
              address: {
                address: checkoutConfig.address || "",
                city: checkoutConfig.city || "",
                state: checkoutConfig.state || "",
                zipCode: checkoutConfig.zipCode || "",
              },
            }
          : {}),
      };
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      if (error) {
        showError(error.message || unexpectedErrorMsg);
        updatePaymentState({ paymentStatus: "error" });
      } else {
        await addDoc(orderCollection, newOrder);
        //await clearCart();
        updatePaymentState({ paymentStatus: "complete" });
      }
    } catch (e) {
      showError(unexpectedErrorMsg);
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
