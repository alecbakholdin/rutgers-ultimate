import React from "react";
import { serverDb } from "config/firebaseServerApp";
import { ServerEvent } from "types/event";
import { getServerFirestoreConverter } from "config/getServerFirestoreConverter";
import { Product } from "types/product";
import { firestore } from "firebase-admin";
import Store from "app/(RegularApp)/store/Store";
import QuerySnapshot = firestore.QuerySnapshot;

export default async () => {
  const eventQuery = await serverDb
    .collection("events")
    .withConverter(getServerFirestoreConverter<ServerEvent>())
    /*.where("endDate", ">", new Date())*/
    .get();
  const events = eventQuery.docs?.map((e) => e.data()) || [];

  const productCollection = serverDb
    .collection("products")
    .withConverter(getServerFirestoreConverter<Product>());
  const productPromises: [string, Promise<QuerySnapshot<Product>>][] = events
    ?.map((e) => {
      const eventIdPromises: [string, Promise<QuerySnapshot<Product>>][] = [];

      let productIds = [...e.productIds];
      while (productIds.length > 0) {
        const productPromise = productCollection
          .where("__name__", "in", productIds.slice(0, 10))
          .get();
        eventIdPromises.push([e.id, productPromise]);
        productIds = productIds.slice(10);
      }
      return eventIdPromises;
    })
    .flatMap((ep) => ep);

  const eventProducts: { [eventId: string]: Product[] } = {};
  for (const [eventId, productPromise] of productPromises) {
    const products = (await productPromise).docs?.map((p) => p.data()) || [];
    if (!eventProducts[eventId]) {
      eventProducts[eventId] = [];
    }
    eventProducts[eventId] = [...eventProducts[eventId], ...products];
  }

  return <Store events={events.reverse()} eventProducts={eventProducts} />;
};
