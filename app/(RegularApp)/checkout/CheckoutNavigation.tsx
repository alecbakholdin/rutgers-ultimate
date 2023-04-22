"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Box, Stack, useTheme } from "@mui/material";
import LoadingButton from "appComponents/inputs/LoadingButton";
import Link from "next/link";
import { CreditCard, SentimentSatisfiedAlt, Tune } from "@mui/icons-material";
import {
  CheckoutContextType,
  useCheckout,
} from "app/(RegularApp)/checkout/CheckoutProvider";
import { useMySnackbar } from "hooks/useMySnackbar";
import { useAuth } from "appComponents/AuthProvider";
import { CreateOrderRequest } from "app/api/orders/route";

export default function CheckoutNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isConfig = pathname === "/checkout";
  const isPayment = pathname === "/checkout/payment";
  const isThankYou = pathname === "/checkout/thankYou";
  const {
    palette: {
      primary,
      grey: { "400": grey },
    },
  } = useTheme();
  const { details, stripe, cardElement } = useCheckout();
  const checkoutContext = useCheckout();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { showError } = useMySnackbar();
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmitPayment = async () => {
    if (!stripe || !cardElement || !details || !user) {
      showError("Unexpected error. Try reloading the page");
      return;
    }
    setPaymentLoading(true);
    try {
      await submitPayment(checkoutContext);
      router.push("/checkout/thankYou");
    } catch (e) {
      if (e instanceof Error) {
        showError(e.message);
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  function NavDivider({ bgColor }: { bgColor: string }) {
    return <Box height={5} bgcolor={bgColor} margin={"auto"} flexGrow={1} />;
  }

  return (
    <Stack spacing={3} width={"100%"}>
      <Stack direction={"row"} spacing={4} alignItems={"center"}>
        <Tune color={"primary"} fontSize={"large"} />
        <NavDivider bgColor={isConfig ? grey : primary.main} />
        <CreditCard
          color={isPayment || isThankYou ? "primary" : "disabled"}
          fontSize={"large"}
        />
        <NavDivider bgColor={isThankYou ? primary.main : grey} />
        <SentimentSatisfiedAlt
          color={isThankYou ? "primary" : "disabled"}
          fontSize={"large"}
        />
      </Stack>
      {children}
      <Stack direction={"row"} width={"100%"} justifyContent={"space-between"}>
        <div>
          {pathname === "/checkout/payment" && (
            <Link href={"/checkout"}>
              <LoadingButton>Back</LoadingButton>
            </Link>
          )}
        </div>
        <div>
          {pathname === "/checkout" && (
            <Link
              href={"/checkout/payment"}
              as={{
                pathname: "/checkout/payment",
                query: { orderDetails: btoa(JSON.stringify(details)) },
              }}
            >
              <LoadingButton>Next</LoadingButton>
            </Link>
          )}
          {pathname === "/checkout/payment" && (
            <LoadingButton
              onClick={handleSubmitPayment}
              loading={paymentLoading}
            >
              Confirm Payment
            </LoadingButton>
          )}
        </div>
      </Stack>
    </Stack>
  );
}

async function submitPayment({
  stripe,
  cardElement,
  details,
  price,
  items,
  signature,
}: CheckoutContextType) {
  if (!stripe || !cardElement || !details || !price || !items || !signature)
    throw new Error("Unexpected error. Try refreshing the page");
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: "card",
    card: cardElement,
  });
  if (error) throw new Error(error.message);

  const resp = await fetch("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      orderScaffold: {
        details,
        price,
        items,
      },
      signature,
      paymentMethodId: paymentMethod.id,
    } as CreateOrderRequest),
  });
  const body = await resp.json().catch(() => ({}));
  if (resp.status >= 400)
    throw new Error(body?.message || "Unexpected error. Please refresh");
}
