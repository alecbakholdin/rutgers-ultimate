import { Address } from "types/easyPost";

export async function calculateShippingCost(
  address: Address,
  weightOz: number
): Promise<number> {
  const response = await fetch("https://api.easypost.com/v2/shipments", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(process.env.EASYPOST_API_KEY!)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      shipment: {
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
      },
    }),
  });
  if(response.status >= 300) throw Error(`Unexpected error ${response.status}: ${await response.text()}`);
  const data = await response.json();
  return Math.min(...data.rates.map((rate: any) => parseFloat(rate.rate)));
}
