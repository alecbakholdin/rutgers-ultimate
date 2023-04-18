import { useEffect, useState } from "react";
import { OrderDetails } from "types/order";
import { getLowestRateShippingCost } from "appUtil/easyPostClient";

export function useShippingCostEstimate(
  details: OrderDetails
): [number, boolean] {
  const [shippingCostTimeout, setShippingCostTimeout] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const [shippingCost, setShippingCost] = useState(0);
  const { deliveryMethod, deliveryLocation } = details;
  useEffect(() => {
    clearTimeout(shippingCostTimeout);
    if (deliveryMethod !== "delivery") {
      setShippingCost(0);
      setShippingCostTimeout(undefined);
      return;
    }
    const timeout = setTimeout(async () => {
      setShippingCost(await getLowestRateShippingCost(deliveryLocation));
      setShippingCostTimeout(undefined);
    }, 500);
    setShippingCostTimeout(timeout);
  }, [details.deliveryLocation.zipCode]);

  return [shippingCost, Boolean(shippingCostTimeout)];
}
