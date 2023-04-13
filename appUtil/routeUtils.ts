import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { FIREBASE_AUTH_COOKIE } from "types/serverAuth";
import { serverAuth } from "config/firebaseServerApp";
import { DecodedIdToken } from "firebase-admin/lib/auth";

export type ErrorResponse = {
  message: string;
};

export async function authenticateUser(): Promise<
  [DecodedIdToken | undefined, NextResponse | undefined]
> {
  const authCookie = cookies().get(FIREBASE_AUTH_COOKIE)?.value;
  if (!authCookie) {
    return [undefined, createErrorResponse(401, "You must log in first")];
  }
  const user = await serverAuth.verifyIdToken(authCookie).catch(console.error);
  if (!user) {
    return [
      undefined,
      createErrorResponse(
        401,
        "Please try refreshing the page or logging in again"
      ),
    ];
  }
  return [user, undefined];
}

export function createErrorResponse(status: number, message: string) {
  return createResponse(status, { message } as ErrorResponse);
}

export function createResponse(status: number, body: any) {
  return NextResponse.json(body, { status });
}
