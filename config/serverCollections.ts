import "server-only";
import { serverDb } from "config/firebaseServerApp";
import { getServerFirestoreConverter } from "config/getServerFirestoreConverter";
import { Order } from "types/order";

export const newOrderServerCollection = serverDb
  .collection("ordersV2")
  .withConverter(getServerFirestoreConverter<Order>());
