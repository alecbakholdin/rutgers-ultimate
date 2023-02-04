import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Box, Grid, useTheme } from "@mui/material";
import { useMySnackbar } from "../../hooks/useMySnackbar";
import { CartItem, useUserData2 } from "../../types/userData";
import React, { useEffect } from "react";
import CheckoutCostSummary from "./_checkoutCostSummary";
import { CheckoutConfig, useCheckoutPaymentState } from "../../types/checkout";
import { Order, orderCollection } from "../../types/order";
import { distinctEntries } from "../../config/arrayUtils";
import { addDoc, doc, updateDoc } from "@firebase/firestore";

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
  const { clearCart, user } = useUserData2();

  const { paymentState, updatePaymentState } = useCheckoutPaymentState();

  const handleSubmit = async () => {
    const cardElement = elements?.getElement(CardElement);
    if (!stripe || !cardElement || !user || !paymentState.paymentInfo) return;

    try {
      const newOrder: Order = {
        id: "",
        ref: doc(orderCollection),
        uid: user.id,
        email: checkoutConfig.email,
        phoneNumber: checkoutConfig.phoneNumber,
        firstName: checkoutConfig.firstName,
        lastName: checkoutConfig.lastName,
        totalCost: paymentState.paymentInfo.total,
        isTeam: Boolean(user.isTeam),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        cart,
        eventIds: distinctEntries(cart.map((i) => i.event)),

        requested: true,
        paid: false,
        delivered: false,
        stripePaymentId: clientSecret,

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
      const { id } = await addDoc(orderCollection, newOrder);
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      if (error) {
        showError(error.message || unexpectedErrorMsg);
        updatePaymentState({ paymentStatus: "error" });
      } else {
        await updateDoc(doc(orderCollection, id), { paid: true });
        await clearCart();
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
