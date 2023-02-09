"use client";
import React from "react";
import { ServerEvent } from "types/event";
import { Product } from "types/product";

export default function EventPage({
  event,
  products,
}: {
  event: ServerEvent;
  products: Product[];
}): React.ReactElement {
  return (
    <>
      {event.name}
      {JSON.stringify(products)}
    </>
  );
}
