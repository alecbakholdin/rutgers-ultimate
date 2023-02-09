import React from "react";
import { serverDb } from "config/firebaseServerApp";
import { notFound } from "next/navigation";
import { ServerEvent } from "types/event";
import EventPage from "app/store/[eventId]/EventPage";
import { Product } from "types/product";
import { getServerFirestoreConverter } from "config/getServerFirestoreConverter";

export default async function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  const eventCollection = serverDb
    .collection("events")
    .withConverter(getServerFirestoreConverter<ServerEvent>());
  const eventDoc = await eventCollection.doc(eventId).get();

  if (!eventDoc.data()) {
    notFound();
  }
  const event: ServerEvent = eventDoc.data()!;
  const productCollection = serverDb
    .collection("products")
    .withConverter(getServerFirestoreConverter<Product>());
  const products: Product[] = [];
  const productPromises = event.productIds.map((pid) =>
    productCollection.doc(pid).get()
  );
  for (const productPromise of productPromises) {
    const productDoc = await productPromise;
    if (productDoc.data()) {
      products.push(productDoc.data()!);
    }
  }
  return <EventPage event={event} products={products} />;
}
