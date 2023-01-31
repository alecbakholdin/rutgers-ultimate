// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { CartItem } from "../../types/userData";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

type Data = {
  clientSecret: string;
};

function calculateTotal(items: CartItem[]): number {
  return items.reduce((prev, curr) => prev + curr.totalPrice, 0) * 100;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { items } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateTotal(items as CartItem[]),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  if (paymentIntent.client_secret) {
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } else {
    res.status(500);
  }
}
