"use client";

import React from "react";
import { Alert, Card, CardContent, CardHeader, Stack } from "@mui/material";
import CurrencyTextField from "components/EditProductWizard/CurrencyTextField";
import BetterTextField from "appComponents/inputs/BetterTextField";
import { useUserData2 } from "types/userData";
import { OrderInfo } from "types/order";

export default function PaymentMethodSelector({
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
  const { totalCost } = useUserData2();

  return (
    <Card>
      <CardHeader title={"Payment"} />
      <CardContent>
        <Stack spacing={1}>
          <CurrencyTextField label={"Total"} value={totalCost ?? 0} />
          {/*              <FormControl fullWidth>
                <InputLabel>Method</InputLabel>
                <Select value={"Venmo"} label={"Method"}>
                  <MenuItem value={"Venmo"}>Venmo</MenuItem>
                </Select>
              </FormControl>*/}
          <BetterTextField
            label={"Your Venmo"}
            value={orderInfo.venmo ?? ""}
            error={!Boolean(orderInfo.venmo)}
            onChange={handleChangeOrderInfo("venmo")}
            required
            handlePressControlEnter={handleSubmit}
          />
          <Alert severity={"info"}>
            Expect a venmo request in the next couple of days from
            @alec-bakholdin
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  );
}
