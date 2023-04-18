import React from "react";
import { OldOrder } from "types/oldOrder";
import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import { currencyFormat } from "util/currency";

export default function AdminEventSummary({
  orders,
}: {
  orders: OldOrder[] | undefined;
}): React.ReactElement {
  orders = orders || [];
  const sumOfCosts = (arr: OldOrder[]) =>
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
