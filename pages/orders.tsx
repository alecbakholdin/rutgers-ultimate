import React from "react";
import { useUserOrders } from "../types/order";
import { Container, Paper, Stack, Typography } from "@mui/material";
import OrderDetails from "../components/OrderDetails";

export default function UserOrders(): React.ReactElement {
  const [orders] = useUserOrders();

  return (
    <Container maxWidth={"md"} sx={{ paddingTop: 5 }}>
      <Typography variant={"h4"}>Orders</Typography>
      <Stack spacing={2}>
        {orders.map((o) => (
          <Paper key={o.id}>
            <OrderDetails order={o} />
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
