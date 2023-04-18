import { authenticateUser, createResponse } from "appUtil/routeUtils";
import { OrderDetails, OrderItem, OrderPrice } from "types/order";
import { PaymentIntentMetadata, stripeApi } from "appUtil/stripe";
import { serverDb } from "config/firebaseServerApp";
import {
  orderItemServerCollection,
  orderServerCollection,
} from "config/serverCollections";

export type CreateOrderRequest = {
  stripePaymentIntentId: string;
};

export async function POST(req: Request) {
  const [userResp, errorResp] = await authenticateUser();
  if (errorResp) return errorResp;
  const user = userResp!;

  const body: CreateOrderRequest = await req.json();
  const { stripePaymentIntentId } = body;

  const { status, metadata, amount } = await stripeApi.paymentIntents.retrieve(
    stripePaymentIntentId
  );
  if (status !== "succeeded")
    return createResponse(500, {
      message: "Unexpected error. Payment intent in the wrong state",
    });

  const { orderDetailsBase64, orderItemIdsBase64, orderPriceBase64 } =
    metadata as PaymentIntentMetadata;
  const orderDetails = JSON.parse(atob(orderDetailsBase64)) as OrderDetails;
  const orderPrice = JSON.parse(atob(orderPriceBase64)) as OrderPrice;
  const orderItemIds = JSON.parse(atob(orderItemIdsBase64)) as string[];
  if (orderPrice.total !== amount / 100) {
    return createResponse(400, {
      message: "Something went wrong. Please refresh the page.",
    });
  }

  const newOrder = await orderServerCollection.add({
    id: "",
    details: orderDetails,
    dateCreated: new Date(),
    price: orderPrice,
    uid: user.uid,
    stripePaymentId: stripePaymentIntentId,
  });
  const firestoreError = await serverDb
    .runTransaction(async (transaction) => {
      for (const orderItemId of orderItemIds) {
        transaction.update(orderItemServerCollection.doc(orderItemId), {
          orderId: newOrder.id,
        } as Partial<OrderItem>);
      }
    })
    .catch(async () => {
      await orderServerCollection.doc(newOrder.id).delete();
      return createResponse(500, {
        message:
          "Unexpected error creating order. Please exit this page and contact Alec at +1 (201)-396-3132 as you've already been charged",
      });
    });
  if (firestoreError) return firestoreError;

  return createResponse(201, { message: "Created order successfully" });
}
