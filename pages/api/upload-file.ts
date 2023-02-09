import { NextApiRequest, NextApiResponse } from "next";
import { getUserData } from "util/server";
import { FIREBASE_AUTH_COOKIE } from "types/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed`);
    return;
  }
  const userData = await getUserData(req.cookies[FIREBASE_AUTH_COOKIE]);
  if (!userData?.isAdmin) {
    // 403 if user exists but isAdmin is false
    // 401 if user doesn't exist at all (unauthenticated)
    res.status(userData ? 403 : 401).end("Unauthorized");
    return;
  }

  res.status(200).json(userData);
}
