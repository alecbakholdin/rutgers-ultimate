import { headers } from "next/headers";
import ReAuthPage from "app/(ReAuthentication)/reAuth/ReAuthPage";

export default function ReAuth() {
  const headerList = headers();
  const referer = headerList.get("Referer");
  const redirectTo = referer && new URL(referer).pathname;

  return <ReAuthPage redirectOnAuth={redirectTo} />;
}
