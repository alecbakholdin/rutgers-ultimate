import { NextApiRequest, NextApiResponse } from "next";
import { CheckoutPaymentIntentResponse } from "types/checkout";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutPaymentIntentResponse>
) {}
