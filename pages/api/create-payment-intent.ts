// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { CartItem } from "../../types/userData";
import {
  CheckoutPaymentIntentRequest,
  CheckoutPaymentIntentResponse,
} from "../../types/checkout";
import { cartSummary } from "../../types/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutPaymentIntentResponse>
) {
  const { items, deliveryMethod, sendReceipt, email } =
    req.body as CheckoutPaymentIntentRequest;
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
    description: cartSummary(items),
    ...(sendReceipt ? { receipt_email: email } : {}),
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
