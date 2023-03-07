"use client";
import { ServerEvent } from "types/event";
import { Product } from "types/product";
import { Divider, Grid, Typography } from "@mui/material";
import ProductCard from "./ProductCard";

export default function Store({
  events,
  eventProducts,
}: {
  events: ServerEvent[];
  eventProducts: { [eventId: string]: Product[] };
}) {
  console.log(events[0]);
  return (
    <Grid container justifyContent={"center"} spacing={1} width={"max-content"}>
      {events.map((event) => (
        <>
          <Grid key={event.id + "-divider"} item xs={12}>
            <Divider>
              <Typography variant={"h5"}>{event.name}</Typography>
            </Divider>
          </Grid>
          {eventProducts[event.id]?.map((product) => (
            <Grid key={`${event.id}-${product.id}`} item>
              <ProductCard product={product} eventId={event.id} />
            </Grid>
          ))}
        </>
      ))}
    </Grid>
  );
}
