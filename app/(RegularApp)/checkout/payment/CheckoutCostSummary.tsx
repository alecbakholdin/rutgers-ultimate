"use client";
import React, { useEffect, useState } from "react";
import { Divider, Grid, Popover, Typography, useTheme } from "@mui/material";
import { currencyFormat } from "util/currency";
import { OrderItem } from "types/order";
import { useCheckout } from "app/(RegularApp)/checkout/CheckoutProvider";
import CartPageRow from "app/(RegularApp)/cart/CartPageRow";

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

function ItemCurrencyRow({ item }: { item: OrderItem }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMouseMove = (e: MouseEvent) => {
    const boundingRect = anchorEl?.getBoundingClientRect();
    if (!boundingRect) return;
    if (
      e.x < boundingRect.left ||
      e.x > boundingRect.right ||
      e.y < boundingRect.top ||
      e.y > boundingRect.bottom
    ) {
      handleClose();
    }
  };

  useEffect(() => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [anchorEl]);

  return (
    <>
      <Grid item xs={8} onMouseOver={handleOpen}>
        <Typography noWrap textOverflow={"ellipsis"}>
          {item.quantity}x {item.productName}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography textAlign={"right"}>
          {currencyFormat(item.quantity * item.unitPrice)}
        </Typography>
      </Grid>
      <Popover
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <CartPageRow orderItem={item} staticQty hideBorder />
      </Popover>
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
        <ItemCurrencyRow key={item.id} item={item} />
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
