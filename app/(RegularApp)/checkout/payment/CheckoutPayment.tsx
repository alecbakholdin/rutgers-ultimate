"use client";
import { useCheckout } from "app/(RegularApp)/checkout/CheckoutProvider";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "@mui/material";
import { useEffect } from "react";
import { CheckoutCardForm } from "app/(RegularApp)/checkout/payment/CheckoutCardForm";
import { OrderScaffold } from "app/api/orders/route";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutPayment({
  scaffold: { details, price, items },
  signature,
}: {
  scaffold: OrderScaffold;
  signature: string;
}) {
  const { palette, typography, spacing, shape } = useTheme();
  const { updateCheckout } = useCheckout();
  useEffect(() => {
    updateCheckout({
      price,
      details,
      items,
      signature,
    });
  }, []);

  return (
    <Elements
      options={{
        appearance: {
          theme: "stripe",
          labels: "floating",
          variables: {
            colorPrimary: palette.primary.main,
            colorBackground: palette.background.default,
            colorDanger: palette.error.main,
            fontFamily: typography.fontFamily,
            spacingUnit: `${spacing.length}px`,
            borderRadius: `${shape.borderRadius}px`,
          },
        },
      }}
      stripe={stripePromise}
    >
      <CheckoutCardForm items={items} />
    </Elements>
  );
}
