import { collection } from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { Order } from "types/order";

export const newOrderCollection = collection(
  firestore,
  "ordersV2"
).withConverter(getFirestoreConverter<Order>());
