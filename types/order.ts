import { collection, DocumentReference } from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { CartItem } from "types/userData";

export interface OrderInfo {
  venmo?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: number;
  machinePercentage?: number;
  nightshadePercentage?: number;
  comments?: string;
}

export interface Order {
  id: string;
  ref: DocumentReference<Order>;
  uid: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  comments: string;
  venmo?: string;
  machinePercentage?: number;
  nightshadePercentage?: number;
  totalCost: number;
  cart: CartItem[];
}

export const orderCollection = collection(firestore, "orders").withConverter(
  getFirestoreConverter<Order>()
);
