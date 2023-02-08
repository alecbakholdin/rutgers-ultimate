import React from "react";
import { serverDb } from "config/firebaseServerApp";
import { notFound } from "next/navigation";

export default async function EventStore({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  const event = await serverDb.collection("events").doc(eventId).get();

  if (!event.data()) {
    notFound();
  }

  return <>page</>;
}
