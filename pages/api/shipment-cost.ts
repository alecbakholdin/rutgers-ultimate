import { NextApiRequest, NextApiResponse } from "next";
import EasyPostClient from "@easypost/api";
import { Address, ShippingRate } from "types/easyPost";
import { serverAuth, serverDb } from "config/firebaseServerApp";
import { FIREBASE_AUTH_COOKIE } from "types/serverAuth";
import { getServerFirestoreConverter } from "config/getServerFirestoreConverter";
import { UserData } from "types/userData";

const client = new EasyPostClient(process.env.EASYPOST_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShippingRate>
) {
  const { uid } = await serverAuth.verifyIdToken(
    req.cookies[FIREBASE_AUTH_COOKIE]!
  );
  const userData = (
    await serverDb
      .collection("userData")
      .withConverter(getServerFirestoreConverter<UserData>())
      .doc(uid)
      .get()
  ).data();
  if (!userData || !userData.cart) {
    res.status(400);
    return;
  }
  const { cart } = userData;

  const address = JSON.parse(req.body) as Address;
  const to_address = {
    name: "John Smith",
    street1: address.street1,
    city: address.city,
    state: address.state,
    zip: address.zipCode,
    country: "US",
  };
  console.log(to_address);
  const shipment = await client.Shipment.create({
    from_address: {
      street1: "68 Central Avenue",
      city: "New Brunswick",
      state: "NJ",
      zip: "08901",
      country: "US",
    },
    to_address,
    parcel: {
      length: 15.5,
      width: 12,
      height: 5,
      weight: cart.reduce((prev, curr) => prev + curr.quantity * 8, 0) || 16,
    },
  });
  console.log(shipment);
  res.json({
    shipmentId: shipment.id,
    lowestRate: Math.min(
      ...shipment.rates.map((rate) => parseFloat(rate.rate))
    ),
  });
}
