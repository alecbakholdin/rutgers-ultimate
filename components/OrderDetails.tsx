import React, { useMemo } from "react";
import { Divider, Grid, Stack } from "@mui/material";
import { Order } from "../types/order";
import CartItemRow from "./CartItemRow";
import Typography from "@mui/material/Typography";
import { currencyFormat } from "../config/currencyUtils";

function OrderSummary({ obj }: { obj: { [_: string]: string } }) {
  const entries = useMemo(() => Object.entries(obj), [obj]);
  return (
    <>
      <Grid container justifyContent={"space-between"} sx={{ padding: 1 }}>
        {entries.map(([key, value]) => (
          <Grid key={`${key}_key`} item container width={"fit-content"}>
            <Grid key={"key"} item md={12}>
              <Typography width={"fit-content"}>
                <b>{key}</b>
              </Typography>
            </Grid>
            <Grid
              key={"value1"}
              item
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Typography width={"fit-content"}>{value}</Typography>
            </Grid>
            <Grid key={"value2"} item sx={{ display: { md: "none" } }}>
              <Typography>: {value}</Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default function OrderDetails({
  order,
}: {
  order: Order;
}): React.ReactElement {
  const statusString = order.delivered
    ? "Completed"
    : order.paid
    ? "Awaiting Fulfillment"
    : order.requested
    ? "Awaiting Payment"
    : "Processing";
  return (
    <Stack spacing={1}>
      <OrderSummary
        key={"OrderSummary"}
        obj={{
          "Order Placed": order.dateCreated?.toDateString(),
          Status: statusString,
          Subtotal: currencyFormat(order.totalCost) || "",
        }}
      />
      {order.cart.map((item, i) => (
        <>
          <Divider key={`${i}-divider`} />
          <CartItemRow key={i} item={item} sx={{ padding: 2 }} />
        </>
      ))}
    </Stack>
  );
}
