import React from "react";
import { serverDb } from "config/firebaseServerApp";
import { redirect } from "next/navigation";
import { Event } from "types/event";
import TextDisplay from "appComponents/TextDisplay";

export default async () => {
  const eventQuery = await serverDb
    .collection("events")
    .where("endDate", ">", new Date())
    .get();

  if (eventQuery.empty) {
    return (
      <TextDisplay
        text={"No events are active at this time. Please check back later."}
      />
    );
  }
  const firstEventId = eventQuery.docs.at(0)?.id;
  if (eventQuery.size === 1 && firstEventId) {
    redirect("/store/" + firstEventId);
  }
  return (
    <>
      {eventQuery.docs?.map((event) => (
        <a key={event.id} href={"/store/" + event.id}>
          {(event.data() as Event).name}
        </a>
      ))}
    </>
  );
};
