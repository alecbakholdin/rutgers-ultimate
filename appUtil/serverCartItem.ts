import "server-only";
import { orderItemServerCollection } from "config/serverCollections";

export function getCartItems(uid: string) {
  return orderItemServerCollection
    .where("uid", "==", uid)
    .where("orderId", "==", null);
}
