import "server-only";
import { serverDb } from "config/firebaseServerApp";
import { getServerFirestoreConverter } from "config/getServerFirestoreConverter";
import { NewOrder } from "types/newOrder";

export const newOrderServerCollection = serverDb
  .collection("ordersV2")
  .withConverter(getServerFirestoreConverter<NewOrder>());
