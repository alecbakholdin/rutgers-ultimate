import { CheckoutConfig } from "types/checkout";

export type ShippingRate = {
  shipmentId: string;
  lowestRate: number;
};

export type Address = {
  street1: string;
  city: string;
  state: string;
  zipCode: string;
};

export function validateCheckoutConfigForAddress(
  checkoutConfig: CheckoutConfig
): Address | undefined {
  if (
    !checkoutConfig.street1 ||
    !checkoutConfig.zipCode ||
    !checkoutConfig.state ||
    !checkoutConfig.city
  )
    return undefined;

  return {
    street1: checkoutConfig.street1,
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
