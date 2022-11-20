import { collection, DocumentReference } from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { CartItem } from "types/userData";

export interface Order {
  id: string;
  ref: DocumentReference<Order>;
  uid: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  venmo?: string;
  totalCost: number;
  summary: CartItem[];
}

export const orderCollection = collection(firestore, "orders").withConverter(
  getFirestoreConverter<Order>()
);
