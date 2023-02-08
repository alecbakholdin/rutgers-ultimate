import { CartItem } from "../types/userData";
import React from "react";
import { Box, Link, Stack, SxProps, Typography } from "@mui/material";
import { currencyFormat } from "util/currency";
import NumberSelect from "./NumberSelect";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { productCollection } from "../types/product";
import { doc } from "@firebase/firestore";

function CartItemDetailRow({
  item,
  detailKey,
  title,
}: {
  item: CartItem;
  detailKey: keyof CartItem;
  title?: string;
}): React.ReactElement {
  if (!item[detailKey] || !detailKey) {
    return <></>;
  }
  return (
    <Typography variant={"body2"} key={detailKey}>
      <b>{title || detailKey.charAt(0).toUpperCase() + detailKey.slice(1)}: </b>
      {item[detailKey]}
    </Typography>
  );
}

export default function CartItemRow({
  item,
  onChangeQty,
  sx,
}: {
  item: CartItem;
  onChangeQty?: (newQty: number) => Promise<void>;
  sx?: SxProps;
}) {
  const [product] = useDocumentDataOnce(doc(productCollection, item.productId));

  return (
    <Stack direction={"row"} spacing={2} sx={sx}>
      <Box
        height={100}
        width={100}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <img
          src={item.image}
          alt={item.productId}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </Box>
      <Stack justifyContent={"start"} alignItems={"start"}>
        <Link
          href={`/store/${item.event}/product/${item.productId}`}
          sx={{
            textDecoration: "none",
            color: "black",
            ":hover": {
              textDecoration: "underline",
            },
          }}
        >
          <Typography variant={"h6"}>{product?.name}</Typography>
        </Link>
        <CartItemDetailRow item={item} detailKey={"size"} />
        <CartItemDetailRow item={item} detailKey={"color"} />
        <CartItemDetailRow
          item={item}
          detailKey={"numberField"}
          title={"Number"}
        />
        <CartItemDetailRow item={item} detailKey={"name"} />
      </Stack>
      <Stack spacing={2} flexGrow={1} alignItems={"end"}>
        <Typography textAlign={"right"}>
          <b>{currencyFormat(item.totalPrice)}</b>
        </Typography>
        <Box width={"min-content"}>
          {onChangeQty && (
            <NumberSelect
              value={item.quantity || 0}
              onChange={onChangeQty}
              max={Math.max(5, item.quantity || 0)}
              label={"Qty"}
            />
          )}
          {!onChangeQty && (
            <Typography noWrap>
              <b>Qty: </b> {item.quantity}
            </Typography>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
