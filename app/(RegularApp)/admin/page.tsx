import { redirect } from "next/navigation";

export default function Admin() {
  redirect("/admin/products");
  return <>Admin Page</>;
}
