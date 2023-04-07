import { collection } from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { NewOrder } from "types/newOrder";

export const newOrderCollection = collection(
  firestore,
  "ordersV2"
).withConverter(getFirestoreConverter<NewOrder>());
