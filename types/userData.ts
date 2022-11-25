import {
  collection,
  doc,
  DocumentReference,
  FirestoreError,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { auth, firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { Product, ProductVariant } from "./product";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";

export interface UserCartItem {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
  name?: string;
  number?: number;
}

export interface UserData {
  id: string;
  isAdmin: boolean;
  email?: string | null;
  isTeam?: boolean;
  cartItems: UserCartItem[];
}

export interface CartItem {
  id: string;
  variantRef: DocumentReference<ProductVariant>;
  quantity: number;
  name?: string;
  number?: number;
}

export const userDataCollection = collection(
  firestore,
  "userData"
).withConverter(getFirestoreConverter<UserData>());

export function useUserData(): [
  UserData | undefined,
  boolean,
  FirestoreError | undefined
] {
  const [user, userLoading] = useAuthState(auth);
  const userDataRef = user?.uid ? doc(userDataCollection, user.uid) : null;
  const defaultUserData: UserData = {
    id: user?.uid ?? "",
    isAdmin: false,
    email: user?.email,
    cartItems: [],
  };
  const [userData, userDataLoading, userDataError] =
    useDocumentData(userDataRef);
  useEffect(() => {
    if (!userData && !userDataLoading && !userLoading && userDataRef && user) {
      console.log("creating user");
      setDoc(userDataRef, defaultUserData).then(() =>
        console.log("Successfully created user")
      );
    }
  }, [userData, userDataLoading, userDataRef]);

  return [
    userData && { isTeam: user?.email?.endsWith("rutgers.edu"), ...userData },
    userDataLoading,
    userDataError,
  ];
}

export function useUserData2() {
  const [user, loading, error] = useUserData();
  const userRef = user?.id ? doc(userDataCollection, user?.id) : null;
  const updateUser = (updateObj: Partial<UserData>) => {
    if (!userRef) {
      throw new Error("User is not logged in yet");
    }
    return updateDoc(userRef, updateObj);
  };

  const findCartItem = (
    cartItems: UserCartItem[],
    lookup: UserCartItem
  ): [UserCartItem | undefined, number] => {
    const index = cartItems.findIndex(
      (item) =>
        item.productId === lookup.productId &&
        item.size === lookup.size &&
        item.color === lookup.color &&
        item.name === lookup.name &&
        item.number === lookup.number
    );
    const item = index >= 0 ? cartItems[index] : undefined;
    return [item, index];
  };

  const addToCartItem = async (cartItem: UserCartItem, addQty: number) => {
    if (!user) throw new Error("User is not logged in");

    const [item, itemIndex] = findCartItem(user.cartItems, cartItem);

    if (itemIndex < 0) {
      // add item
      await updateUser({
        cartItems: [...user.cartItems, { ...cartItem, quantity: addQty }],
      });
    } else {
      // edit existing item
      const newItems: UserCartItem[] = [
        ...user.cartItems.slice(0, itemIndex),
        ...(item && item.quantity + addQty > 0
          ? [{ ...item, quantity: addQty + item.quantity }]
          : []),
        ...user.cartItems.slice(itemIndex + 1, user.cartItems.length),
      ];
      await updateUser({ cartItems: newItems });
    }
  };

  const getItemPrice = (product: Product) => {
    return user?.isTeam ? product.teamPrice : product.price;
  };

  const getCartItemKey = (cartItem: UserCartItem) => {
    const fields = [
      cartItem.productId,
      cartItem.size,
      cartItem.color,
      cartItem.name,
      cartItem.number,
    ];
    return fields
      .filter((field) => field !== undefined && field !== "")
      .join("-");
  };

  return {
    user,
    loading,
    error,
    cart: user?.cartItems ?? ([] as UserCartItem[]),
    updateUser,
    addToCartItem,
    getItemPrice,
    getCartItemKey,
  };
}

export function useCart(): any {
  return { getItemPrice: (product: Product) => product.price };
}
