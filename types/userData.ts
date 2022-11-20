import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  updateDoc,
} from "@firebase/firestore";
import { auth, firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { ProductVariant } from "./product";
import { useAuthState } from "react-firebase-hooks/auth";
import { useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

export interface UserData {
  id: string;
  isAdmin: true;
}

export interface CartItem {
  id: string;
  variantRef: DocumentReference<ProductVariant>;
  quantity: number;
  name: string;
  number: number;
}

export const userDataCollection = collection(
  firestore,
  "userData"
).withConverter(getFirestoreConverter<UserData>());

export function useCart() {
  const [user, userLoading] = useAuthState(auth);
  const cartCollection = useMemo(() => {
    if (user && !userLoading) {
      return collection(
        doc(userDataCollection, user.uid),
        "cartItems"
      ).withConverter(getFirestoreConverter<CartItem>());
    }
  }, [user, userLoading]);
  const [cart, cartLoading] = useCollectionData(cartCollection);
  const updateCartQuantity = async (cartItem: CartItem, quantity: number) => {
    if (!user || !cartCollection) {
      throw new Error("User is not authenticated. Please log in first");
    }

    const docReference = doc(cartCollection, cartItem.id);
    if (quantity === 0) {
      return deleteDoc(docReference);
    }

    return updateDoc(docReference, {
      quantity,
    } as CartItem);
  };

  const addToCart = async (
    variantRef: DocumentReference<ProductVariant>,
    quantity: number,
    name?: string,
    number?: number
  ) => {
    if (!user || !cartCollection) {
      throw new Error("User is not authenticated. Please log in first");
    }

    // update quantity if item already is in the cart
    const existingItem = cart?.find(
      (item) =>
        item.variantRef.path === variantRef.path &&
        item.name === name &&
        item.number === number
    );

    if (existingItem) {
      return updateCartQuantity(existingItem, existingItem.quantity + quantity);
    }

    // otherwise, add it to the cart
    return addDoc<CartItem>(cartCollection, {
      variantRef,
      quantity,
      ...(name !== undefined && { name }),
      ...(number !== undefined && { number }),
    } as CartItem);
  };

  return {
    cart,
    cartLoading,
    addToCart,
    updateCartQuantity,
  };
}
