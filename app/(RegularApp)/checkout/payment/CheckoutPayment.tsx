"use client";
import { useCheckout } from "app/(RegularApp)/checkout/CheckoutProvider";
import { OrderItem, OrderPrice } from "types/order";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "@mui/material";
import { useEffect } from "react";
import { CheckoutCardForm } from "app/(RegularApp)/checkout/payment/CheckoutCardForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutPayment({
  price,
  items,
  clientSecret,
}: {
  price: OrderPrice;
  items: OrderItem[];
  clientSecret: string;
}) {
  const { palette, typography, spacing, shape } = useTheme();
  const { setPrice, setClientSecret } = useCheckout();
  useEffect(() => {
    setPrice(price);
    setClientSecret(clientSecret);
  }, []);

  return (
    <Elements
      options={{
        clientSecret,
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
