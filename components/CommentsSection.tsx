"use client";

import React from "react";
import { OrderInfo } from "types/order";
import { Card, CardContent, CardHeader } from "@mui/material";
import BetterTextField from "components/BetterTextField";

export default function CommentsSection({
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
      <CardHeader title={"Comments"} />
      <CardContent>
        <BetterTextField
          value={orderInfo.comments || ""}
          onChange={handleChangeOrderInfo("comments")}
          placeholder={"Enter any comments here"}
          fullWidth
          multiline
          rows={4}
        />
      </CardContent>
    </Card>
  );
}
