import { collection, DocumentReference } from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { CartItem } from "types/userData";
import { currencyFormat } from "util/currency";
import { Address } from "types/easyPost";

export interface OrderInfo {
  venmo?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: number;
  machinePercentage?: number;
  nightshadePercentage?: number;
  comments?: string;
}

export interface OldOrder {
  id: string;
  ref: DocumentReference<OldOrder>;
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

export const oldOrderCollection = collection(firestore, "orders").withConverter(
  getFirestoreConverter<OldOrder>()
);

export function orderAsStringSummary(order: OldOrder): string {
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
