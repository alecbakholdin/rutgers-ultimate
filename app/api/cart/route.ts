import { NextRequest, NextResponse } from "next/server";
import {
  eventServerCollection,
  orderItemServerCollection,
  productServerCollection,
  userDataServerCollection,
} from "config/serverCollections";
import { OrderItem } from "types/order";
import { determineIfTeam } from "types/userData";
import {
  authenticateUser,
  createErrorResponse,
  createResponse,
} from "appUtil/routeUtils";

export type GetCartResponse = OrderItem[];

export async function GET() {
  // authenticate user
  const [userResp, authError] = await authenticateUser();
  if (authError) return authError;
  const user = userResp!;

  const cart = await orderItemServerCollection
    .where("uid", "==", user.uid)
    .where("orderId", "==", null)
    .get();

  const cartObjects = cart.docs.map((doc) => doc.data());
  return NextResponse.json(cartObjects as GetCartResponse);
}

export type AddToCartRequest = {
  productId: string;
  eventId: string;
  quantity: number;
  imageStoragePath: string;
  fields: { [field: string]: any };
};
export type AddToCartResponse = {
  message: string;
};

export async function PUT(req: NextRequest): Promise<NextResponse> {
  // authenticate user
  const [userResp, authError] = await authenticateUser();
  if (authError) return authError;
  const user = userResp!;

  const { productId, eventId, fields, quantity, imageStoragePath } =
    (await req.json()) as AddToCartRequest;

  const existingItemDocPromise = existingCartItemQuery(
    user.uid,
    productId,
    eventId,
    fields
  );
  const userDataDocPromise = userDataServerCollection.doc(user.uid).get();
  const productDocPromise = productServerCollection.doc(productId).get();
  const eventDoc = await eventServerCollection.doc(eventId).get();

  // validate event exists and product is part of this event
  if (!eventDoc.exists) return createErrorResponse(400, "Event does not exist");
  const event = eventDoc.data()!;
  if (!event?.productIds?.includes(productId))
    return createErrorResponse(400, "Product does not exist in this event");

  // validate product exists and all required fields are present
  const productDoc = await productDocPromise;
  if (!productDoc.exists)
    return createErrorResponse(400, "Product does not exist");
  const product = productDoc.data()!;
  const missingFields = product.fields
    .filter((field) => field.required && !fields[field.name])
    .map((field) => field.name);
  if (missingFields.length > 0) {
    return createErrorResponse(
      400,
      `Missing required fields ${missingFields.join(", ")}`
    );
  }

  // check if user is on the team
  const userData = (await userDataDocPromise).data();
  console.log("userData", userData);
  const isTeam = determineIfTeam(userData);
  console.log(isTeam);

  const orderItem: Omit<OrderItem, "id"> = {
    orderId: null,
    uid: user.uid,
    productId,
    productName: product.name,
    eventId,
    eventName: event.name,
    fields,
    quantity,
    imageStoragePath,
    fieldCount: Object.keys(fields).length,
    unitPrice: isTeam ? product.teamPrice : product.price,
  };

  const existingOrderItems = (await existingItemDocPromise).docs;
  const existingItemDoc = existingOrderItems.length
    ? existingOrderItems[0]
    : undefined;

  if (existingItemDoc?.data().quantity) {
    const qty = existingItemDoc?.data().quantity;
    await orderItemServerCollection
      .doc(existingItemDoc!.id)
      .update({ quantity: qty + quantity });
  } else {
    await orderItemServerCollection.add({ id: "", ...orderItem });
  }

  return createResponse(200, {
    message: "Successfully added to item to cart",
  } as AddToCartResponse);
}

export type UpdateCartRequest = {
  orderItemId: string;
  quantity: number;
};

export type UpdateCartResponse = {
  message: string;
};

export async function PATCH(req: NextRequest) {
  const [userResp, errorResp] = await authenticateUser();
  if (errorResp) return errorResp;
  const user = userResp!;

  const { orderItemId, quantity }: UpdateCartRequest = await req.json();

  const orderItem = await orderItemServerCollection.doc(orderItemId).get();
  if (!orderItem.exists)
    return createErrorResponse(404, "Order Item not found");
  if (orderItem.data()!.uid !== user.uid)
    return createErrorResponse(403, "You don't have permission to do that");

  if (quantity) {
    await orderItemServerCollection.doc(orderItem.id).update({ quantity });
    return createResponse(200, "Item quantity updated");
  } else {
    await orderItemServerCollection.doc(orderItem.id).delete();
    return createResponse(200, "Item removed from cart");
  }
}

function existingCartItemQuery(
  uid: string,
  productId: string,
  eventId: string,
  fields: { [p: string]: any }
) {
  const fieldEntries = Object.entries(fields);
  return fieldEntries
    .reduce(
      (prev, [name, value]) => prev.where("fields." + name, "==", value),
      orderItemServerCollection
        .where("uid", "==", uid)
        .where("orderId", "==", null)
        .where("productId", "==", productId)
        .where("eventId", "==", eventId)
    )
    .where("fieldCount", "==", fieldEntries.length)
    .get();
}
