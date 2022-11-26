import { collection, doc, FirestoreError, setDoc } from "@firebase/firestore";
import { auth, firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { Product, useProductData } from "./product";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { distinctEntries } from "config/arrayUtils";

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
  const initialValue: UserData = {
    id: user?.uid ?? "",
    isAdmin: false,
    email: user?.email,
    cartItems: [],
  };
  const [userData, userDataLoading, userDataError] = useDocumentData(
    userDataRef,
    { initialValue }
  );
  /*  useEffect(() => {
    if (!userData && !userDataLoading && !userLoading && userDataRef && user) {
      console.log("creating user");
      setDoc(userDataRef, defaultUserData).then(() =>
        console.log("Successfully created user")
      );
    }
  }, [userData, userDataLoading, userDataRef]);*/

  return [
    userData && {
      isTeam: user?.email?.endsWith("rutgers.edu"),
      ...userData,
    },
    userDataLoading,
    userDataError,
  ];
}

export function useUserData2() {
  const [user, loading, error] = useUserData();
  const userRef = user?.id ? doc(userDataCollection, user?.id) : null;
  const updateUser = (updateObj: Partial<UserData>) => {
    if (!userRef) throw new Error("User is not logged in");

    const idObj: Partial<UserData> = {
      email: user?.email,
    };
    return setDoc(userRef, { ...user, ...idObj, ...updateObj });
  };

  const findCartItem = (
    cartItems: UserCartItem[],
    lookup: UserCartItem
  ): [UserCartItem | undefined, number] => {
    const index = cartItems?.findIndex(
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

  const clearCart = async () => updateUser({ cartItems: [] });
  const cart = user?.cartItems ?? ([] as UserCartItem[]);
  const productIdsInCart = distinctEntries(cart.map((item) => item.productId));
  const [productsInCart] = useProductData(productIdsInCart);
  const priceMap = Object.fromEntries(
    productsInCart.map((p) => [p.id, getItemPrice(p)])
  );
  const totalCost = cart.reduce(
    (total, item) => total + item.quantity * priceMap[item.productId],
    0
  );
  return {
    signedIn: Boolean(user?.id),
    user,
    loading,
    error,
    cart,
    productIdsInCart,
    productsInCart,
    totalCost,
    updateUser,
    addToCartItem,
    getItemPrice,
    getCartItemKey,
    clearCart,
  };
}
