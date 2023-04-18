import { Address, ShippingRate } from "types/easyPost";

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
