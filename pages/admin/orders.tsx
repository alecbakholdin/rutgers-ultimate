import React from "react";
import { Container, Typography } from "@mui/material";
import OrdersDataGrid from "../../components/OrdersDataGrid";

export default function Orders(): React.ReactElement {
  return (
    <Container sx={{ paddingTop: 5, height: 600 }}>
      <Typography variant={"h4"}>Orders</Typography>
      <OrdersDataGrid />
    </Container>
  );
}
