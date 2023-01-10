import React from "react";
import { Order } from "../types/order";
import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import { currencyFormat } from "../config/currencyUtils";

export default function AdminEventSummary({
  orders,
}: {
  orders: Order[] | undefined;
}): React.ReactElement {
  orders = orders || [];
  const sumOfCosts = (arr: Order[]) =>
    arr.reduce((prev, curr) => prev + curr.totalCost, 0);
  const expectedMoney = sumOfCosts(orders);
  const collectedMoney = sumOfCosts(orders.filter((o) => o.paid));
  const alumniMoney = sumOfCosts(orders.filter((o) => !o.isTeam));

  const tableRow = (key: string, value: string | null | undefined) => (
    <>
      <Grid item xs={6}>
        {key}
      </Grid>
      <Grid item xs={6}>
        {value}
      </Grid>
    </>
  );

  return (
    <Card>
      <CardHeader title={"Event Summary"} />
      <CardContent>
        <Grid container>
          {tableRow("Money expected", currencyFormat(expectedMoney))}
          {tableRow("Money collected", currencyFormat(collectedMoney))}
          {tableRow("Alumni money expected", currencyFormat(alumniMoney))}
        </Grid>
      </CardContent>
    </Card>
  );
}
