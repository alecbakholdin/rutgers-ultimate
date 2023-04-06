import { CheckoutConfig } from "types/checkout";
import { Address } from "types/order";

export type ShippingRate = {
  shipmentId: string;
  lowestRate: number;
};

export function validateCheckoutConfigForAddress(
  checkoutConfig: CheckoutConfig
): Address | undefined {
  if (
    !checkoutConfig.address ||
    !checkoutConfig.zipCode ||
    !checkoutConfig.state ||
    !checkoutConfig.city
  )
    return undefined;

  return {
    address: checkoutConfig.address,
    city: checkoutConfig.city,
    state: checkoutConfig.state,
    zipCode: checkoutConfig.zipCode,
  };
}

export async function getLowestRateShippingCost(
  address: Address
): Promise<number> {
  const response = await fetch("/api/shipment-cost", {
    method: "POST",
    body: JSON.stringify(address),
  });
  if (response.status !== 200) {
    throw new Error("Unexpected error");
  }
  const body = (await response.json()) as ShippingRate;
  return body.lowestRate;
}
