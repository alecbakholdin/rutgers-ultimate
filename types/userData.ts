import { collection, doc, FirestoreError, setDoc } from "@firebase/firestore";
import { auth, firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { Product, useProductData } from "./product";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { distinctEntries } from "config/arrayUtils";

export interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
  name?: string;
  number?: number;
  numberField?: string;
  image?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface UserData {
  id: string;
  isAdmin: boolean;
  email?: string | null;
  isTeam?: boolean;
  cartItems: CartItem[];
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
  const cart = user?.cartItems ?? ([] as CartItem[]);
  const userRef = user?.id ? doc(userDataCollection, user?.id) : null;
  const updateUser = (updateObj: Partial<UserData>) => {
    if (!userRef) throw new Error("User is not logged in");

    const idObj: Partial<UserData> = {
      email: user?.email,
    };
    return setDoc(userRef, { ...user, ...idObj, ...updateObj });
  };

  const getCartItemKey = (cartItem: CartItem) => {
    const fields = [
      cartItem.productId,
      cartItem.size,
      cartItem.color,
      cartItem.name,
      cartItem.number,
      cartItem.numberField,
    ];
    return fields
      .filter((field) => field !== undefined && field !== "")
      .join("-");
  };

  const findCartItem = (lookup: CartItem): [CartItem | undefined, number] => {
    const lookupKey = getCartItemKey(lookup);
    const index = cart.findIndex((item) => getCartItemKey(item) === lookupKey);
    const item = index >= 0 ? cart[index] : undefined;
    return [item, index];
  };

  const setCartItemQuantity = async (cartItem: CartItem, quantity: number) => {
    if (!user) throw new Error("User is not logged in");

    const [item, itemIndex] = findCartItem(cartItem);
    const totalPrice = quantity * (cartItem?.unitPrice || 0);
    const newItem = { ...(item || cartItem), quantity, totalPrice };
    if (itemIndex < 0) {
      // add item
      await updateUser({
        cartItems: [...cart, newItem],
      });
    } else {
      // edit existing item
      const newItems: CartItem[] = [
        ...cart.slice(0, itemIndex),
        ...(item && quantity > 0 ? [newItem] : []),
        ...cart.slice(itemIndex + 1, cart.length),
      ];
      await updateUser({ cartItems: newItems });
    }
  };

  const addToCartItem = async (cartItem: CartItem, addQty: number) => {
    if (!user) throw new Error("User is not logged in");

    const [item] = findCartItem(cartItem);
    const newQty = (item?.quantity || 0) + addQty;
    await setCartItemQuantity(cartItem, newQty);
  };

  const getItemPrice = (product: Product) => {
    return user?.isTeam ? product.teamPrice || product.price : product.price;
  };

  const clearCart = async () => updateUser({ cartItems: [] });
  const productIdsInCart = distinctEntries(cart.map((item) => item.productId));
  const [productsInCart] = useProductData(productIdsInCart);
  const totalCost = cart.reduce((total, item) => total + item.totalPrice, 0);
  const productsInCartMap: { [id: string]: Product } = Object.fromEntries(
    productsInCart.map((product) => [product.id, product])
  );
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  return {
    signedIn: Boolean(user?.id),
    user,
    loading,
    error,
    cart,
    productIdsInCart,
    productsInCart,
    productsInCartMap,
    totalCost,
    itemCount,
    updateUser,
    addToCartItem,
    setCartItemQuantity,
    getItemPrice,
    getCartItemKey,
    clearCart,
  };
}
