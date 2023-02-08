import React from "react";
import { serverDb } from "config/firebaseServerApp";
import { redirect } from "next/navigation";
import NoEvents from "app/store/NoEvents";

export default async () => {
  const eventQuery = await serverDb
    .collection("events")
    .where("endDate", ">", new Date())
    .get();

  if (eventQuery.empty) {
    return <NoEvents />;
  }
  const firstEventId = eventQuery.docs.at(0)?.id;
  if (eventQuery.size === 1 && firstEventId) {
    redirect("/store/" + firstEventId);
  }
  return <>multiple are present</>;
};
