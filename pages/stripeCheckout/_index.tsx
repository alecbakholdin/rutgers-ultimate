import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import * as stripe from "stripe";
import CheckoutForm from "./_checkoutForm";
import { useUserData2 } from "../../types/userData";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function _index(): React.ReactElement {
  const [clientSecret, setClientSecret] = useState("");
  const { cart } = useUserData2();

  useEffect(() => {
    if (clientSecret || !cart || cart.length === 0) return;
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [cart, clientSecret]);

  return (
    <div className="App">
      {clientSecret && (
        <Elements
          options={{
            clientSecret,
            appearance: { theme: "stripe" },
          }}
          stripe={stripePromise}
        >
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
