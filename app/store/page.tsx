import React from "react";
import ClientPage from "./clientPage";
import { serverDb } from "config/firebaseServerApp";
import { Product } from "types/product";

export default async () => {
  const products = await serverDb.collection("products").get();
  const names = products.docs.map((d) => (d.data() as Product).name);
  return <ClientPage text={names.join(", ")} />;
};
