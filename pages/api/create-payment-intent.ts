// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { CartItem } from "../../types/userData";
import { CheckoutPaymentIntentResponse } from "../../types/checkout";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutPaymentIntentResponse>
) {
  const { items, deliveryMethod } = req.body;
  const subtotal = items.reduce(
    (prev: number, curr: CartItem) => prev + curr.totalPrice,
    0
  );
  const shipping = deliveryMethod === "delivery" ? 7 : 0;
  const processingFee = 0;
  const total = subtotal + shipping + processingFee;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "usd",
  });
  if (paymentIntent.client_secret) {
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      subtotal,
      shipping,
      processingFee,
      total,
    });
  } else {
    res.status(500);
  }
}
