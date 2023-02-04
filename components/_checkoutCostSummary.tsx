import React from "react";
import { CartItem } from "../types/userData";
import { Divider, Grid, Typography, useTheme } from "@mui/material";
import { currencyFormat } from "../config/currencyUtils";
import { CheckoutPaymentIntentResponse } from "../types/checkout";

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
  paymentInfo,
}: {
  items: CartItem[];
  paymentInfo: CheckoutPaymentIntentResponse;
}): React.ReactElement {
  const { palette, shape } = useTheme();
  return (
    <Grid
      container
      borderRadius={shape.borderRadius + "px"}
      border={"1px solid " + palette.grey["400"]}
      padding={3}
    >
      <Grid key={"order-summary-title"} item xs={12}>
        <Typography variant={"h5"}>
          <b>Order Summary</b>
        </Typography>
      </Grid>
      <SectionDivider key={"order-summary-divider"} />
      {items.map((item, i) => (
        <BasicCurrencyRow
          key={i}
          title={item.productName}
          cost={item.totalPrice}
        />
      ))}
      {Boolean(paymentInfo.shipping) && (
        <>
          <SectionDivider key={"shipping-divider"} />
          <BasicCurrencyRow title={"Subtotal"} cost={paymentInfo.subtotal} />
          <BasicCurrencyRow
            title={"Shipping & Handling"}
            cost={paymentInfo.shipping}
          />
        </>
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
          {currencyFormat(paymentInfo.total)}
        </Typography>
      </Grid>
    </Grid>
  );
}
