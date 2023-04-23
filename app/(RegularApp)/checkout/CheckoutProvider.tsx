"use client";
import React, { createContext, useContext, useState } from "react";
import { OrderDetails, OrderItem, OrderPrice } from "types/order";
import { Stripe, StripeCardElement } from "@stripe/stripe-js";

const defaultDetails: OrderDetails = {
  name: "",
  email: "",
  phone: "",
  deliveryMethod: "pickup",
  pickupLocation: "bid",
  deliveryLocation: {
    street1: "",
    city: "",
    state: "",
    zipCode: "",
  },
};

const defaultPrice: OrderPrice = {
  subtotal: 0,
  deliveryCost: 0,
  processingFee: 0,
  total: 0,
};

export type CheckoutContextType = {
  details: OrderDetails;
  price: OrderPrice;
  items: OrderItem[] | null;
  signature: string;
  cardElement: StripeCardElement | null;
  stripe: Stripe | null;
  updateCheckout: (
    update: Partial<Omit<CheckoutContextType, "updateCheckout">>
  ) => void;
};

const defaultCheckoutState: CheckoutContextType = {
  details: defaultDetails,
  price: defaultPrice,
  items: null,
  cardElement: null,
  signature: "",
  stripe: null,
  updateCheckout: () => {},
};

const CheckoutContext =
  createContext<CheckoutContextType>(defaultCheckoutState);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [checkoutContextState, setCheckoutContextState] =
    useState<Omit<CheckoutContextType, "updateCheckout">>(defaultCheckoutState);
  const updateCheckout = (
    update: Partial<Omit<CheckoutContextType, "updateCheckout">>
  ) => {
    setCheckoutContextState({ ...checkoutContextState, ...update });
  };
  return (
    <CheckoutContext.Provider
      value={{
        ...checkoutContextState,
        updateCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  return useContext(CheckoutContext);
}
