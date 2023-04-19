"use client";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Box, Stack, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import CheckoutCostSummary from "app/(RegularApp)/checkout/payment/CheckoutCostSummary";
import { OrderItem } from "types/order";
import { useCheckout } from "app/(RegularApp)/checkout/CheckoutProvider";

export function CheckoutCardForm({
  items,
  maxWidth = 400,
}: {
  items: OrderItem[];
  maxWidth?: number;
}) {
  const theme = useTheme();
  const elements = useElements();
  const stripe = useStripe();
  const { updateCheckout } = useCheckout();

  const cardElement = elements?.getElement(CardElement);
  useEffect(() => {
    if (cardElement) {
      updateCheckout({ cardElement });
    }
  }, [cardElement]);

  useEffect(() => {
    if (stripe) {
      updateCheckout({ stripe });
    }
  }, [stripe]);

  return (
    <Stack alignItems={"center"} width={"100%"} spacing={2}>
      <CheckoutCostSummary items={items} maxWidth={maxWidth} />
      <Box
        sx={{
          width: "100%",
          maxWidth,
          padding: 2,
          border: `1px solid ${theme.palette.grey["400"]}`,
          borderRadius: `${theme.shape.borderRadius}px`,
        }}
      >
        <CardElement id={"card-element"} />
      </Box>
    </Stack>
  );
}
