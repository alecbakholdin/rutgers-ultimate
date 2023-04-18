"use client";
import React, { createContext, useContext, useState } from "react";
import { OrderDetails, OrderPrice } from "types/order";
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

const CheckoutContext = createContext<{
  details: OrderDetails;
  setDetails: (details: OrderDetails) => void;
  price: OrderPrice;
  setPrice: (price: OrderPrice) => void;
  clientSecret: string;
  setClientSecret: (clientSecret: string) => void;
  cardElement: StripeCardElement | null | undefined;
  setCardElement: (element: StripeCardElement) => void;
  stripe: Stripe | null | undefined;
  setStripe: (stripe: Stripe) => void;
}>({
  details: defaultDetails,
  setDetails: () => {},
  price: defaultPrice,
  setPrice: () => {},
  clientSecret: "",
  setClientSecret: () => {},
  cardElement: undefined,
  setCardElement: () => {},
  stripe: undefined,
  setStripe: () => {},
});

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [details, setDetails] = useState(defaultDetails);
  const [price, setPrice] = useState(defaultPrice);
  const [clientSecret, setClientSecret] = useState("");
  const [cardElement, setCardElement] = useState<
    StripeCardElement | null | undefined
  >(undefined);
  const [stripe, setStripe] = useState<Stripe | null | undefined>(undefined);
  return (
    <CheckoutContext.Provider
      value={{
        details,
        setDetails,
        price,
        setPrice,
        clientSecret,
        setClientSecret,
        cardElement,
        setCardElement,
        stripe,
        setStripe,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  return useContext(CheckoutContext);
}
