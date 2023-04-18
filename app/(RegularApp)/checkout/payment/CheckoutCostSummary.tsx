"use client";
import React from "react";
import { Divider, Grid, Typography, useTheme } from "@mui/material";
import { currencyFormat } from "util/currency";
import { OrderItem } from "types/order";
import { useCheckout } from "app/(RegularApp)/checkout/CheckoutProvider";

function SectionDivider(): React.ReactElement {
  return (
    <Grid item xs={12} sx={{ paddingTop: 1, paddingBottom: 1 }}>
      <Divider />
    </Grid>
  );
}

function BasicCurrencyRow({ title, cost }: { title: string; cost: number }) {
  return (
    <>
      <Grid item xs={8}>
        <Typography noWrap textOverflow={"ellipsis"}>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography textAlign={"right"}>{currencyFormat(cost)}</Typography>
      </Grid>
    </>
  );
}

export default function CostSummary({
  items,
  maxWidth = 400,
}: {
  items: OrderItem[];
  maxWidth?: number;
}): React.ReactElement {
  const { palette, shape } = useTheme();
  const { price } = useCheckout();

  return (
    <Grid
      container
      borderRadius={shape.borderRadius + "px"}
      border={"1px solid " + palette.grey["400"]}
      padding={3}
      maxWidth={maxWidth}
    >
      <Grid key={"order-summary-title"} item xs={12}>
        <Typography variant={"h5"}>
          <b>Order Summary</b>
        </Typography>
      </Grid>
      <SectionDivider key={"order-summary-divider"} />
      {items.map((item) => (
        <BasicCurrencyRow
          key={item.id}
          title={`${item.quantity}x ${item.productName}`}
          cost={item.unitPrice * item.quantity}
        />
      ))}
      <SectionDivider />
      <BasicCurrencyRow title={"Subtotal"} cost={price.subtotal} />
      {Boolean(price.deliveryCost) && (
        <BasicCurrencyRow
          title={"Shipping & Handling"}
          cost={price.deliveryCost}
        />
      )}
      {Boolean(price.processingFee) && (
        <BasicCurrencyRow title={"Processing fee"} cost={price.processingFee} />
      )}
      <SectionDivider key={"order-total-divider"} />
      <Grid
        key={"order-total"}
        item
        xs={12}
        container
        justifyContent={"space-between"}
      >
        <Typography variant={"h5"} color={"primary"} width={"fit-content"}>
          Order Total
        </Typography>
        <Typography variant={"h5"} color={"primary"} width={"fit-content"}>
          {currencyFormat(price.total)}
        </Typography>
      </Grid>
    </Grid>
  );
}
