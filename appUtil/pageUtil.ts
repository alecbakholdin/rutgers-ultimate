import "server-only";
import { serverAuth } from "config/firebaseServerApp";
import { cookies } from "next/headers";
import { FIREBASE_AUTH_COOKIE } from "types/serverAuth";

export function getUser() {
  const authCookie = cookies().get(FIREBASE_AUTH_COOKIE)?.value;
  return authCookie && serverAuth.verifyIdToken(authCookie);
}
