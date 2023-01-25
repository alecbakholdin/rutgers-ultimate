import React from "react";
import { useUserOrders } from "../../types/order";
import { Container, Stack, Typography } from "@mui/material";
import OrderDetails from "../../components/OrderDetails";

export default function UserOrders(): React.ReactElement {
  const [orders] = useUserOrders();
  console.log(orders);

  return (
    <Container maxWidth={"md"} sx={{ paddingTop: 5 }}>
      <Typography variant={"h4"}>Orders</Typography>
      <Stack spacing={2}>
        {orders.map((o) => (
          <OrderDetails key={o.id} order={o} />
        ))}
      </Stack>
    </Container>
  );
}
