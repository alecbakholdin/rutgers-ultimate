import EasyPostClient from "@easypost/api";
import { Address } from "types/easyPost";

const client = new EasyPostClient(process.env.EASYPOST_API_KEY!);

export async function calculateShippingCost(
  address: Address,
  weightOz: number
): Promise<number> {
  const shipment = await client.Shipment.create({
    from_address: {
      street1: "68 Central Avenue",
      city: "New Brunswick",
      state: "NJ",
      zip: "08901",
      country: "US",
    },
    to_address: { ...address, zip: address.zipCode, country: "US" },
    parcel: {
      length: 15.5,
      width: 12,
      height: 5,
      weight: weightOz,
    },
  });
  return Math.min(...shipment.rates.map((rate) => parseFloat(rate.rate)));
}
