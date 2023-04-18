import CheckoutPayment from "app/(RegularApp)/checkout/payment/CheckoutPayment";
import { orderItemServerCollection } from "config/serverCollections";
import { authenticateUser } from "appUtil/routeUtils";
import { redirect } from "next/navigation";
import { OrderDetails, OrderPrice } from "types/order";
import { calculateShippingCost } from "appUtil/easyPostServer";
import { PaymentIntentMetadata, stripeApi } from "appUtil/stripe";

export default async function CheckoutPaymentPage({
  searchParams: { orderDetails },
}: {
  searchParams: { orderDetails?: string };
}) {
  const [userResp] = await authenticateUser();
  if (!userResp) redirect("/signIn?redirect=/checkout");
  const user = userResp!;

  if (!orderDetails) redirect("/checkout");
  const orderDetailsObj = JSON.parse(atob(orderDetails)) as OrderDetails;

  const orderItemsDoc = await orderItemServerCollection
    .where("uid", "==", user.uid)
    .where("orderId", "==", null)
    .get();
  const orderItems = orderItemsDoc.docs.map((item) => item.data());

  const subtotal = orderItems.reduce((p, c) => p + c.quantity * c.unitPrice, 0);
  const deliveryCost =
    orderDetailsObj.deliveryMethod === "delivery"
      ? await calculateShippingCost(orderDetailsObj.deliveryLocation, 24)
      : 0;
  const processingFee = subtotal * 0.03 + 0.3;
  const total = subtotal + deliveryCost + processingFee;
  const price: OrderPrice = {
    subtotal,
    deliveryCost,
    processingFee,
    total,
  };

  const paymentIntent = await stripeApi.paymentIntents.create({
    amount: total * 100,
    currency: "usd",
    receipt_email: orderDetailsObj.email,

    metadata: {
      orderDetailsBase64: orderDetails,
      orderPriceBase64: btoa(JSON.stringify(price)),
      orderItemIdsBase64: btoa(JSON.stringify(orderItems.map((o) => o.id))),
      orderItemsBase64: btoa(JSON.stringify(orderItems)),
    } as PaymentIntentMetadata,
  });

  return (
    <CheckoutPayment
      price={price}
      clientSecret={paymentIntent.client_secret!}
      items={orderItems}
    />
  );
}
