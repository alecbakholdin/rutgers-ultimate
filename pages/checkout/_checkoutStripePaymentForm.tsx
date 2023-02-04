import {
  CheckoutConfig,
  CheckoutPaymentIntentRequest,
  CheckoutPaymentIntentResponse,
  useCheckoutPaymentState,
} from "../../types/checkout";
import { CartItem } from "../../types/userData";
import React, { useEffect } from "react";
import { useTheme } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutCardForm } from "./_checkoutCardForm";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export function CheckoutStripePaymentForm({
  checkoutConfig,
  cart,
}: {
  checkoutConfig: CheckoutConfig;
  cart: CartItem[];
}): React.ReactElement {
  const theme = useTheme();
  const { paymentState, updatePaymentState } = useCheckoutPaymentState();
  const clientSecret = paymentState.paymentInfo?.clientSecret;

  useEffect(() => {
    updatePaymentState({ intentLoading: true, paymentStatus: "waiting" });
    const intentRequest: CheckoutPaymentIntentRequest = {
      items: cart,
      deliveryMethod: checkoutConfig.deliveryMethod,
      sendReceipt: checkoutConfig.sendEmailReceipt,
      email: checkoutConfig.email,
    };
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intentRequest),
    })
      .then((res) => res.json())
      .then((json) =>
        updatePaymentState({
          intentLoading: false,
          paymentStatus: "waiting",
          paymentInfo: json as CheckoutPaymentIntentResponse,
        })
      )
      .catch((e) => {
        console.error(e);
        updatePaymentState({
          intentLoading: false,
          paymentStatus: "waiting",
          paymentInfo: undefined,
        });
      });
  }, []);

  return (
    <>
      {clientSecret && (
        <Elements
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              labels: "floating",
              variables: {
                colorPrimary: theme.palette.primary.main,
                colorBackground: theme.palette.background.default,
                colorDanger: theme.palette.error.main,
                fontFamily: theme.typography.fontFamily,
                spacingUnit: `${theme.spacing.length}px`,
                borderRadius: `${theme.shape.borderRadius}px`,
              },
            },
          }}
          stripe={stripePromise}
        >
          <CheckoutCardForm
            clientSecret={clientSecret}
            cart={cart}
            checkoutConfig={checkoutConfig}
          />
        </Elements>
      )}
    </>
  );
}
