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
