import React from "react";
import { Container, Typography } from "@mui/material";
import OrdersDataGrid from "../../components/OrdersDataGrid";
import ProductSummaryDataGrid from "../../components/ProductSummaryDataGrid";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { orderCollection } from "../../types/order";
import AdminEventSummary from "../../components/AdminEventSummary";

export default function Orders(): React.ReactElement {
  const [orders] = useCollectionData(orderCollection);

  return (
    <Container sx={{ paddingTop: 5, height: 600 }}>
      <Typography variant={"h4"}>Orders</Typography>
      <AdminEventSummary orders={orders} />
      <OrdersDataGrid orders={orders} />
      <ProductSummaryDataGrid orders={orders} />
    </Container>
  );
}
