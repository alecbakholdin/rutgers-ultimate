"use client";
import { ServerEvent } from "types/storeEvent";
import { Product } from "types/product";
import { Divider, Grid, Typography } from "@mui/material";
import ProductCard from "app/(RegularApp)/store/ProductCard";
import React from "react";

export default function Store({
  events,
  eventProducts,
}: {
  events: ServerEvent[];
  eventProducts: { [eventId: string]: Product[] };
}) {
  return (
    <Grid container justifyContent={"center"} spacing={1} width={"max-content"}>
      {events.map((event) => (
        <React.Fragment key={event.id}>
          <Grid key={event.id + "-divider"} item xs={12}>
            <Divider>
              <Typography variant={"h5"}>{event.name}</Typography>
            </Divider>
          </Grid>
          {eventProducts[event.id]?.map((product) => (
            <Grid key={`${event.id}-${product.id}`} item>
              <ProductCard product={product} event={event} />
            </Grid>
          ))}
        </React.Fragment>
      ))}
    </Grid>
  );
}
