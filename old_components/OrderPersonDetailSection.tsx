"use client";

import React from "react";
import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import BetterTextField from "appComponents/inputs/BetterTextField";
import { OrderInfo } from "types/order";

export default function OrderPersonDetailSection({
  orderInfo,
  handleChangeOrderInfo,
  handleSubmit,
}: {
  orderInfo: OrderInfo;
  handleChangeOrderInfo: (
    field: keyof OrderInfo
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}): React.ReactElement {
  return (
    <Card>
      <CardHeader title={"Contact Info"} />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <BetterTextField
              label={"First Name"}
              value={orderInfo.firstName ?? ""}
              error={!Boolean(orderInfo.firstName)}
              onChange={handleChangeOrderInfo("firstName")}
              fullWidth
              required
              handlePressControlEnter={handleSubmit}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <BetterTextField
              label={"Last Name"}
              value={orderInfo.lastName ?? ""}
              error={!Boolean(orderInfo.lastName)}
              onChange={handleChangeOrderInfo("lastName")}
              fullWidth
              required
              handlePressControlEnter={handleSubmit}
            />
          </Grid>
          <Grid item xs={12}>
            <BetterTextField
              label={"Phone Number"}
              value={orderInfo.phoneNumber ?? ""}
              error={!Boolean(orderInfo.phoneNumber)}
              onChange={handleChangeOrderInfo("phoneNumber")}
              fullWidth
              required
              handlePressControlEnter={handleSubmit}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
