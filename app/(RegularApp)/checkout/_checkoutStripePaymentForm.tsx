import {
  CheckoutConfig,
  CheckoutPaymentIntentRequest,
  CheckoutPaymentIntentResponse,
  useCheckoutPaymentState,
} from "types/checkout";
import React, { useEffect } from "react";
import { useTheme } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutCardForm } from "app/(RegularApp)/checkout/_checkoutCardForm";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "appComponents/AuthProvider";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export function CheckoutStripePaymentForm({
  checkoutConfig,
}: {
  checkoutConfig: CheckoutConfig;
}): React.ReactElement {
  const { userData } = useAuth();
  const theme = useTheme();
  const { paymentState, updatePaymentState } = useCheckoutPaymentState();
  const clientSecret = paymentState.paymentInfo?.clientSecret;

  useEffect(() => {
    updatePaymentState({ intentLoading: true, paymentStatus: "waiting" });
    const intentRequest: CheckoutPaymentIntentRequest = {
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
          {userData?.cart && (
            <CheckoutCardForm
              cart={userData?.cart}
              clientSecret={clientSecret}
              checkoutConfig={checkoutConfig}
            />
          )}
        </Elements>
      )}
    </>
  );
}
