import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Box, Grid, useTheme } from "@mui/material";
import { useMySnackbar } from "hooks/useMySnackbar";
import React, { useEffect } from "react";
import CheckoutCostSummary from "app/checkout/_checkoutCostSummary";
import { CheckoutConfig, useCheckoutPaymentState } from "types/checkout";
import { addDoc, doc, updateDoc } from "@firebase/firestore";
import { useAuth } from "components/AuthProvider";
import { NewCartItem } from "types/newCartItem";
import { NewOrder } from "types/newOrder";
import { newOrderCollection } from "config/clientCollections";
import { userDataCollection } from "types/userData";

const unexpectedErrorMsg = "Unexpected error occurred. Try refreshing the page";

export function CheckoutCardForm({
  checkoutConfig,
  clientSecret,
  cart,
}: {
  checkoutConfig: CheckoutConfig;
  clientSecret: string;
  cart: NewCartItem[];
}) {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();
  const { showError } = useMySnackbar();
  const { userData, isTeam } = useAuth();

  const { paymentState, updatePaymentState } = useCheckoutPaymentState();

  const handleSubmit = async () => {
    const cardElement = elements?.getElement(CardElement);
    if (!stripe || !cardElement || !userData || !paymentState.paymentInfo)
      return;

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );
      const newOrder: NewOrder = {
        id: "",
        uid: userData.id,
        name: checkoutConfig.firstName + " " + checkoutConfig.lastName,
        email: checkoutConfig.email,
        phone: checkoutConfig.phoneNumber,
        dateCreated: new Date(),

        total:
          (paymentIntent?.amount || 0) / 100 ||
          cart.reduce(
            (p, c) => p + (isTeam ? c.teamUnitPrice : c.unitPrice) * c.quantity,
            0
          ),
        stripePaymentId: paymentIntent?.id,

        deliveryMethod: checkoutConfig.deliveryMethod,
        ...(checkoutConfig.deliveryMethod === "delivery"
          ? ({
              address: {
                street1: checkoutConfig.street1,
                city: checkoutConfig.city,
                state: checkoutConfig.state,
                zipCode: checkoutConfig.zipCode,
              },
            } as Partial<NewOrder>)
          : {
              pickupLocation: checkoutConfig.pickupLocation,
            }),

        items: cart.map((cartItem) => ({
          productId: cartItem.productId,
          productName: cartItem.productName,
          eventId: cartItem.eventId,
          eventName: cartItem.eventName,
          quantity: cartItem.quantity,
          fields: cartItem.fieldValues,
          imageStoragePath: cartItem.imageStoragePath,
          unitPrice: isTeam ? cartItem.teamUnitPrice : cartItem.unitPrice,
        })),
      };
      if (error) {
        showError(error.message || unexpectedErrorMsg);
        updatePaymentState({ paymentStatus: "error" });
      } else {
        await addDoc(newOrderCollection, newOrder);
        await updateDoc(doc(userDataCollection, userData.id), { cart: [] });
        updatePaymentState({ paymentStatus: "complete" });
      }
    } catch (e) {
      showError(e instanceof Error ? e.message : unexpectedErrorMsg);
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
