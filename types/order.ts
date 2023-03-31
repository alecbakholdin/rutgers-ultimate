import {
  collection,
  DocumentReference,
  FirestoreError,
  query,
  where,
} from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { CartItem, useUserData2 } from "types/userData";
import { currencyFormat } from "util/currency";
import { useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

export interface OrderInfo {
  venmo?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: number;
  machinePercentage?: number;
  nightshadePercentage?: number;
  comments?: string;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: string;
  ref: DocumentReference<Order>;
  uid: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  comments?: string;
  venmo?: string;
  machinePercentage?: number;
  nightshadePercentage?: number;
  totalCost: number;
  isTeam: boolean;
  dateCreated: Date;
  dateUpdated: Date;
  cart: CartItem[];
  eventIds: string[];

  requested: boolean;
  paid: boolean;
  delivered: boolean;
  stripePaymentId?: string;

  deliveryMethod: "delivery" | "pickup";
  pickupLocation?: string;
  address?: Address;
}

export const orderCollection = collection(firestore, "orders").withConverter(
  getFirestoreConverter<Order>()
);

export function useUserOrders(): [
  Order[],
  boolean,
  FirestoreError | undefined | null
] {
  const { uid } = useUserData2();
  const q = useMemo(
    () => (uid ? query(orderCollection, where("uid", "==", uid)) : undefined),
    [uid]
  );
  const [orders, loading, error] = useCollectionData<Order>(q);

  return [orders ?? [], !uid || loading, error];
}

export function orderAsStringSummary(order: Order): string {
  return cartSummary(order.cart) + `Total: ${currencyFormat(order.totalCost)}`;
}

export function cartSummary(items: CartItem[]): string {
  let cartSummary = "";

  for (const item of items) {
    cartSummary += item.productName + "\n";
    const attributes = [];

    if (item.size) attributes.push(item.size);
    if (item.number !== null && item.number !== undefined)
      attributes.push("number " + item.number);
    if (item.name) attributes.push(item.name);

    if (attributes.length > 0) cartSummary += attributes.join(", ") + "\n";
    cartSummary += `${item.quantity} x ${currencyFormat(item.unitPrice)}\n\n`;
  }

  return cartSummary;
}
