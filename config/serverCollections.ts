import "server-only";
import { serverDb } from "config/firebaseServerApp";
import { getServerFirestoreConverter } from "config/getServerFirestoreConverter";
import { Order, OrderItem } from "types/order";
import { Product } from "types/product";
import { StoreEvent } from "types/storeEvent";
import { UserData } from "types/userData";

export const orderServerCollection = serverCollection<Order>("ordersV2");
export const orderItemServerCollection =
  serverCollection<OrderItem>("orderItems");
export const productServerCollection = serverCollection<Product>("products");
export const eventServerCollection = serverCollection<StoreEvent>("events");
export const userDataServerCollection = serverCollection<UserData>("userData");

function serverCollection<T>(path: string) {
  return serverDb
    .collection(path)
    .withConverter(getServerFirestoreConverter<T>());
}
