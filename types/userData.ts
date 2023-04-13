import { collection, DocumentReference } from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { NewCartItem } from "types/newCartItem";

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  color?: string;
  size?: string;
  name?: string;
  number?: number;
  numberField?: string;
  image?: string;
  unitPrice: number;
  totalPrice: number;
  event: string;
  delivered: boolean;
}

export interface UserData {
  id: string;
  isAdmin: boolean;
  email?: string | null;
  isTeam?: boolean;
  cartItems: CartItem[];
  cart?: NewCartItem[];
  ref?: DocumentReference<UserData>;
}

export function newUserData(uid: string): UserData {
  return {
    id: uid,
    isAdmin: false,
    cartItems: [],
  };
}

export const userDataCollection = collection(
  firestore,
  "userData"
).withConverter(getFirestoreConverter<UserData>());
