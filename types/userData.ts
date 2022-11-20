import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  FirestoreError,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { auth, firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { Product, productCollection, ProductVariant } from "./product";
import { useAuthState } from "react-firebase-hooks/auth";
import { useMemo } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { distinctEntries } from "config/arrayUtils";

export interface UserData {
  id: string;
  isAdmin: boolean;
  isTeam?: boolean;
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

export function useUserData(): [
  UserData | undefined,
  boolean,
  FirestoreError | undefined
] {
  const [user] = useAuthState(auth);
  const [userData, userDataLoading, userDataError] = useDocumentData(
    user?.uid ? doc(userDataCollection, user.uid) : null
  );
  return [
    userData && { isTeam: user?.email?.endsWith("rutgers.edu"), ...userData },
    userDataLoading,
    userDataError,
  ];
}

export function useCart() {
  const [user, userLoading] = useAuthState(auth);
  const [userData] = useUserData();
  const cartCollection = useMemo(() => {
    if (user && !userLoading) {
      return collection(
        doc(userDataCollection, user.uid),
        "cartItems"
      ).withConverter(getFirestoreConverter<CartItem>());
    }
  }, [user, userLoading]);
  const [cart, cartLoading] = useCollectionData(cartCollection);

  const productRefs = distinctEntries<DocumentReference<Product>>(
    cart?.map(
      (item) => item.variantRef.parent.parent as DocumentReference<Product>
    ),
    (docRef) => docRef.id
  );
  const productIdsInCart: string[] = productRefs.map((product) => product.id);
  const productQuery = useMemo(
    () =>
      Boolean(productIdsInCart && productIdsInCart.length)
        ? query(productCollection, where("__name__", "in", productIdsInCart))
        : null,
    [productIdsInCart]
  );
  const [productsInCart] = useCollectionData(productQuery);
  const productsInCartById: { [id: string]: Product } = Object.fromEntries(
    productsInCart?.map((p) => [p.id, p]) ?? []
  );

  const getItemPrice = (product: Product) => {
    const useTeamPrice = Boolean(userData?.isTeam && product.teamPrice);
    return useTeamPrice ? product.teamPrice : product.price;
  };
  const totalCost = cart?.reduce((total, next) => {
    const product = productsInCartById[next.variantRef.parent.parent!.id];
    if (!product) {
      return total;
    }
    return total + getItemPrice(product) * next.quantity;
  }, 0);

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

  const clearCart = async () => {
    if (!cart) return;
    for (const cartItem of cart) {
      await updateCartQuantity(cartItem, 0);
    }
  };

  return {
    cart,
    cartLoading,
    productIdsInCart,
    productsInCart,
    productsInCartById,
    totalCost,
    addToCart,
    updateCartQuantity,
    getItemPrice,
    clearCart,
  };
}
