export async function calculateShippingCost(
  destinationZip: string
): Promise<number> {
  /*const response = await fetch("https://api.pirateship.com/graphql", {
    method: "POST",
    body: JSON.stringify(shipFromNewBrunswickJson(destinationZip)),
  });*/
  const response = await fetchShippingRates();
  const body = await response.json();
  if (response.status != 200 || !body) {
    throw new Error("Unexpected error calculating shipping cost");
  }
  if (body["data"]) {
    const data: any[] = body["data"];
    return data.find((d) => d["cheapest"])["basePrice"];
  }
  if (body["errors"]?.[0]["message"]) {
    throw new Error(body["errors"][0]["message"]);
  }
  throw new Error("Unexpected error calculating shipping cost");
}

function fetchShippingRates() {
  return fetch("https://api.pirateship.com/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      authorization: "",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "device-id": "Ljl9lAMDQ17xh4AE7mKCKtlhCX8c1UTh",
      pragma: "no-cache",
      "sec-ch-ua":
        '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://www.pirateship.com/",
    },
    body: '{"operationName":"GetRates","variables":{"originZip":"08901","originRegionCode":"NJ","isResidential":true,"destinationZip":"07751","destinationCountryCode":"US","mailClassKeys":["First","ParcelSelect","ParcelSelect_Cubic","PriorityExpress","Priority","Priority_Cubic","14","01","13","59","02","12","03","03_cubic"],"packageTypeKeys":["SoftEnvelope"],"pricingTypes":["weight","cubic","flat_rate"],"dimensionX":15.5,"dimensionY":12,"weight":37},"query":"query GetRates($originZip: String!, $originCity: String, $originRegionCode: String, $destinationZip: String, $isResidential: Boolean, $destinationCountryCode: String, $weight: Float, $dimensionX: Float, $dimensionY: Float, $dimensionZ: Float, $mailClassKeys: [String!]!, $packageTypeKeys: [String!]!, $pricingTypes: [String!], $showUpsRatesWhen2x7Selected: Boolean) {\\n  rates(\\n    originZip: $originZip\\n    originCity: $originCity\\n    originRegionCode: $originRegionCode\\n    destinationZip: $destinationZip\\n    isResidential: $isResidential\\n    destinationCountryCode: $destinationCountryCode\\n    weight: $weight\\n    dimensionX: $dimensionX\\n    dimensionY: $dimensionY\\n    dimensionZ: $dimensionZ\\n    mailClassKeys: $mailClassKeys\\n    packageTypeKeys: $packageTypeKeys\\n    pricingTypes: $pricingTypes\\n    showUpsRatesWhen2x7Selected: $showUpsRatesWhen2x7Selected\\n  ) {\\n    title\\n    deliveryDescription\\n    trackingDescription\\n    serviceDescription\\n    pricingDescription\\n    cubicTier\\n    mailClassKey\\n    mailClass {\\n      accuracy\\n      international\\n      __typename\\n    }\\n    packageTypeKey\\n    zone\\n    surcharges {\\n      title\\n      price\\n      __typename\\n    }\\n    carrier {\\n      carrierKey\\n      title\\n      __typename\\n    }\\n    totalPrice\\n    priceBaseTypeKey\\n    basePrice\\n    crossedTotalPrice\\n    pricingType\\n    pricingSubType\\n    ratePeriodId\\n    learnMoreUrl\\n    cheapest\\n    fastest\\n    __typename\\n  }\\n}\\n"}',
    method: "POST",
  });
}

function shipFromNewBrunswickJson(destinationZip: string) {
  return {
    operationName: "GetRates",
    variables: {
      originZip: "08901",
      originRegionCode: "NJ",
      isResidential: true,
      destinationZip,
      destinationCountryCode: "US",
      mailClassKeys: [
        "First",
        "ParcelSelect",
        "ParcelSelect_Cubic",
        "PriorityExpress",
        "Priority",
        "Priority_Cubic",
        "14",
        "01",
        "13",
        "59",
        "02",
        "12",
        "03",
        "03_cubic",
      ],
      packageTypeKeys: ["SoftEnvelope"],
      pricingTypes: ["weight", "cubic", "flat_rate"],
      dimensionX: 15.5,
      dimensionY: 12,
      weight: 21,
    },
    query:
      "query GetRates($originZip: String!, $originCity: String, $originRegionCode: String, $destinationZip: String, $isResidential: Boolean, $destinationCountryCode: String, $weight: Float, $dimensionX: Float, $dimensionY: Float, $dimensionZ: Float, $mailClassKeys: [String!]!, $packageTypeKeys: [String!]!, $pricingTypes: [String!], $showUpsRatesWhen2x7Selected: Boolean) {\n  rates(\n    originZip: $originZip\n    originCity: $originCity\n    originRegionCode: $originRegionCode\n    destinationZip: $destinationZip\n    isResidential: $isResidential\n    destinationCountryCode: $destinationCountryCode\n    weight: $weight\n    dimensionX: $dimensionX\n    dimensionY: $dimensionY\n    dimensionZ: $dimensionZ\n    mailClassKeys: $mailClassKeys\n    packageTypeKeys: $packageTypeKeys\n    pricingTypes: $pricingTypes\n    showUpsRatesWhen2x7Selected: $showUpsRatesWhen2x7Selected\n  ) {\n    title\n    deliveryDescription\n    trackingDescription\n    serviceDescription\n    pricingDescription\n    cubicTier\n    mailClassKey\n    mailClass {\n      accuracy\n      international\n      __typename\n    }\n    packageTypeKey\n    zone\n    surcharges {\n      title\n      price\n      __typename\n    }\n    carrier {\n      carrierKey\n      title\n      __typename\n    }\n    totalPrice\n    priceBaseTypeKey\n    basePrice\n    crossedTotalPrice\n    pricingType\n    pricingSubType\n    ratePeriodId\n    learnMoreUrl\n    cheapest\n    fastest\n    __typename\n  }\n}\n",
  };
}
