import { OrderItem } from "types/order";
import React, { useState } from "react";
import { UpdateCartRequest } from "app/api/cart/route";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import StorageImage from "appComponents/StorageImage";
import NumberSelect from "appComponents/inputs/NumberSelect";
import FancyCurrency from "appComponents/textDisplay/FancyCurrency";
import { useMySnackbar } from "hooks/useMySnackbar";

export default function CartPageRow({
  orderItem,
  handleDeleteRowFromUI,
}: {
  orderItem: OrderItem;
  handleDeleteRowFromUI: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [qtyState, setQtyState] = useState(orderItem.quantity);
  const { palette } = useTheme();
  const { showError } = useMySnackbar();

  const handleUpdateQuantity = async (quantity: number) => {
    if (loading || quantity === qtyState) return;

    setLoading(true);
    const resp = await fetch("/api/cart", {
      method: "PATCH",
      body: JSON.stringify({
        orderItemId: orderItem.id,
        quantity,
      } as UpdateCartRequest),
    }).finally(() => setLoading(false));

    if (resp.status !== 200) {
      const error = await resp.json();
      showError(error?.message || "Unexpected error occurred");
      return;
    }
    if (quantity) {
      setQtyState(quantity);
    } else {
      handleDeleteRowFromUI();
    }
  };

  const { productId, productName, fields, imageStoragePath, unitPrice } =
    orderItem;
  return (
    <Box border={"1px solid " + palette.divider} padding={3} borderRadius={4}>
      <Stack direction={"row"} width={"100%"}>
        <Box height={150} width={150}>
          <StorageImage storagePath={imageStoragePath} />
        </Box>
        <Stack flexGrow={1}>
          <Typography variant={"h5"} color={"primary"}>
            {productName || productId}
          </Typography>
          {Object.entries(fields)
            .sort(([key1], [key2]) => key1.localeCompare(key2))
            .map(([key, value]) => (
              <Typography key={key} variant={"body2"}>
                <b>{key}:</b> {value}
              </Typography>
            ))}
        </Stack>
        <Stack spacing={2} alignSelf={"center"}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <NumberSelect
                label={"Qty"}
                value={qtyState}
                onChange={(newQty) => handleUpdateQuantity(newQty)}
                selectProps={{ size: "small" }}
              />
              <FancyCurrency
                amount={unitPrice * qtyState}
                loading={loading}
                size={25}
              />
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
