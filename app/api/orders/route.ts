import { authenticateUser, createResponse } from "appUtil/routeUtils";
import { OrderDetails, OrderItem, OrderPrice } from "types/order";
import { stripeApi } from "appUtil/stripe";
import { serverDb } from "config/firebaseServerApp";
import {
  orderItemServerCollection,
  orderServerCollection,
} from "config/serverCollections";
import { hash } from "appUtil/hashing";

export type OrderScaffold = {
  details: OrderDetails;
  price: OrderPrice;
  items: OrderItem[];
};

export type CreateOrderRequest = {
  paymentMethodId: string;
  orderScaffold: OrderScaffold;
  signature: string;
};

export async function POST(req: Request) {
  const [userResp, errorResp] = await authenticateUser();
  if (errorResp) return errorResp;
  const user = userResp!;

  const body: CreateOrderRequest = await req.json();
  const { paymentMethodId, orderScaffold, signature } = body;
  if (signature !== hash(orderScaffold))
    return createResponse(400, {
      message: "Order has been modified. Please refresh and try again",
    });

  const { card } = await stripeApi.paymentMethods.retrieve(paymentMethodId);
  if (!card)
    return createResponse(500, {
      message: "Unsupported payment method",
    });
  try {
    await createOrder(orderScaffold, paymentMethodId, user.uid);
  } catch (e) {
    console.error(e);
    const message =
      e instanceof Error ? e.message : "Unexpected error occurred.";
    return createResponse(500, { message });
  }

  return createResponse(201, { message: "Created order successfully" });
}

async function createOrder(
  { details, price, items }: OrderScaffold,
  paymentMethodId: string,
  uid: string
) {
  const { id: stripePaymentId } = await stripeApi.paymentIntents.create({
    amount: Math.floor(price.total * 100),
    currency: "usd",
    confirmation_method: "manual",
    payment_method: paymentMethodId,
  });

  const newOrder = await orderServerCollection.add({
    id: "",
    details,
    price,
    dateCreated: new Date(),
    uid,
    stripePaymentId,
  });
  await serverDb
    .runTransaction(async (transaction) => {
      for (const orderItem of items) {
        transaction.update(orderItemServerCollection.doc(orderItem.id), {
          orderId: newOrder.id,
        } as Partial<OrderItem>);
      }
      await stripeApi.paymentIntents.confirm(stripePaymentId);
    })
    .catch(async (e) => {
      await orderServerCollection.doc(newOrder.id).delete();
      throw e;
    });
}
