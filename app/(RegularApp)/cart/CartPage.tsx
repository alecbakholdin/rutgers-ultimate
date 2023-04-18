"use client";
import React, { useState } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import LoadingButton from "appComponents/inputs/LoadingButton";
import { OrderItem } from "types/order";
import CartPageRow from "app/(RegularApp)/cart/CartPageRow";

export default function CartPage({ cart }: { cart: OrderItem[] }) {
  const [cartState, setCartState] = useState(
    cart.map((item) => ({ ...item, loading: false }))
  );

  return (
    <Container maxWidth={"md"}>
      <Stack width={"100%"} spacing={1}>
        <Typography variant={"h2"}>Cart</Typography>
        {cartState.map((orderItem) => (
          <CartPageRow
            key={orderItem.id}
            orderItem={orderItem}
            handleDeleteRowFromUI={() =>
              setCartState(cartState.filter(({ id }) => id !== orderItem.id))
            }
          />
        ))}
        <Box alignSelf={"end"}>
          <Link href={"/checkout"}>
            <LoadingButton variant={"contained"}>Checkout</LoadingButton>
          </Link>
        </Box>
      </Stack>
    </Container>
  );
}
