// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { UserData } from "types/userData";
import {
  CheckoutPaymentIntentRequest,
  CheckoutPaymentIntentResponse,
} from "types/checkout";
import { serverAuth, serverDb } from "config/firebaseServerApp";
import { FIREBASE_AUTH_COOKIE } from "types/serverAuth";
import { getServerFirestoreConverter } from "config/getServerFirestoreConverter";
import { NewCartItem } from "types/newCartItem";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutPaymentIntentResponse>
) {
  const idToken = req.cookies[FIREBASE_AUTH_COOKIE];
  if (!idToken) {
    res.status(401);
    return;
  }
  const { uid } = await serverAuth.verifyIdToken(idToken);
  const userDataDoc = await serverDb
    .doc(`userData/${uid}`)
    .withConverter(getServerFirestoreConverter<UserData>())
    .get();
  if (!userDataDoc.data()) {
    res.status(403);
    return;
  }

  const userData = userDataDoc.data()!;
  const cart = userData.cart || [];
  const isTeam = userData.email?.endsWith("rutgers.edu") || userData.isTeam;
  const subtotal = cart.reduce(
    (prev: number, curr: NewCartItem) =>
      prev + (isTeam ? curr.teamUnitPrice : curr.unitPrice) * curr.quantity,
    0
  );
  const { deliveryMethod, sendReceipt, email } =
    req.body as CheckoutPaymentIntentRequest;
  const shipping = deliveryMethod === "delivery" ? 7 : 0;
  const processingFee = 0;
  const total = subtotal + shipping + processingFee;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "usd",
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
