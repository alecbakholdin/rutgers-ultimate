import "server-only";
import { hmac } from "fast-sha256";
import { sha1 } from "object-hash";

const secretKey = new TextEncoder().encode(
  process.env.SECRET_HASH_KEY || "secret-key"
);

export function hash(obj: any) {
  return new TextDecoder().decode(
    hmac(secretKey, new TextEncoder().encode(sha1(obj)))
  );
}
