import { NextRequest, NextResponse } from "next/server";
import {
  eventServerCollection,
  orderItemServerCollection,
  productServerCollection,
  userDataServerCollection,
} from "config/serverCollections";
import { OrderItem } from "types/order";
import { determineIfTeam } from "types/userData";
import { authenticateUser } from "appUtil/routeUtils";

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
  console.log(cartObjects);
  return NextResponse.json(cartObjects as GetCartResponse);
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  // authenticate user
  const [userResp, authError] = await authenticateUser();
  if (authError) return authError;
  const user = userResp!;

  const { productId, eventId, fields, quantity, imageStoragePath } =
    (await req.json()) as AddToCartRequest;

  const userDataDocPromise = userDataServerCollection.doc(user.uid).get();
  const productDocPromise = productServerCollection.doc(productId).get();
  const eventDoc = await eventServerCollection.doc(eventId).get();

  // validate event exists and product is part of this event
  if (!eventDoc.exists) return createResponse(400, "Event does not exist");
  const event = eventDoc.data()!;
  if (!event?.productIds?.includes(productId))
    return createResponse(400, "Product does not exist in this event");

  // validate product exists and all required fields are present
  const productDoc = await productDocPromise;
  if (!productDoc.exists) return createResponse(400, "Product does not exist");
  const product = productDoc.data()!;
  const missingFields = product.fields
    .filter((field) => field.required && !fields[field.name])
    .map((field) => field.name);
  if (missingFields.length > 0) {
    return createResponse(
      400,
      `Missing required fields ${missingFields.join(", ")}`
    );
  }

  // check if user is on the team
  const isTeam = determineIfTeam((await userDataDocPromise).data());

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
    unitPrice: isTeam ? product.price : product.teamPrice,
  };
  await orderItemServerCollection.add({ id: "", ...orderItem });

  return createResponse(200, "Successfully added to item to cart");
}

function createResponse(status: number, message: string): NextResponse {
  return NextResponse.json({ message }, { status });
}
