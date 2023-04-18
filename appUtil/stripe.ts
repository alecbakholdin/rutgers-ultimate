import "server-only";
import Stripe from "stripe";

export const stripeApi = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export type PaymentIntentMetadata = {
  orderDetailsBase64: string;
  orderPriceBase64: string;
  orderItemIdsBase64: string;
  orderItemsBase64: string;
};
