import { collection, DocumentReference } from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { UserCartItem } from "types/userData";

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
  venmo?: string;
  machinePercentage?: number;
  nightshadePercentage?: number;
  totalCost: number;
  cart: UserCartItem[];
}

export const orderCollection = collection(firestore, "orders").withConverter(
  getFirestoreConverter<Order>()
);
