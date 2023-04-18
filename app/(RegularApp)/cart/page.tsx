import { getUser } from "appUtil/pageUtil";
import { orderItemServerCollection } from "config/serverCollections";
import CartPage from "app/(RegularApp)/cart/CartPage";

export default async function Cart() {
  const user = await getUser();

  if (user) {
    const cartItemsDoc = await orderItemServerCollection
      .where("uid", "==", user.uid)
      .where("orderId", "==", null)
      .get();
    const cartItems = cartItemsDoc.docs.map((doc) => doc.data());
    return <CartPage cart={cartItems} />;
  } else {
    return <CartPage cart={[]} />;
  }
}
