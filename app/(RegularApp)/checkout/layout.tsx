import { CheckoutProvider } from "app/(RegularApp)/checkout/CheckoutProvider";
import React from "react";
import CheckoutNavigation from "app/(RegularApp)/checkout/CheckoutNavigation";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CheckoutProvider>
      <CheckoutNavigation>{children}</CheckoutNavigation>
    </CheckoutProvider>
  );
}
