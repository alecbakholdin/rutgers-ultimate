import "server-only";
import { serverDb } from "config/firebaseServerApp";
import { getServerFirestoreConverter } from "config/getServerFirestoreConverter";
import { Order, OrderItem } from "types/order";

export const orderServerCollection = serverDb
  .collection("ordersV2")
  .withConverter(getServerFirestoreConverter<Order>());

export const orderItemCollection = serverDb
  .collection("orderItems")
  .withConverter(getServerFirestoreConverter<OrderItem>());
