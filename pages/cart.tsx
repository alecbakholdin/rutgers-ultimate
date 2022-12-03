import React from "react";
import { CartItem, useUserData2 } from "types/userData";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useMySnackbar } from "hooks/useMySnackbar";
import { currencyFormat } from "config/currencyUtils";
import NumberSelect from "components/NumberSelect";
import { router } from "next/client";

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

export default function Cart(): React.ReactElement {
  const { cart, productsInCartMap, setCartItemQuantity, totalCost, itemCount } =
    useUserData2();
  const { executeAndCatchErrorsAsync } = useMySnackbar();
  const handleUpdateCartQty = (item: CartItem) => async (newQty: number) => {
    await executeAndCatchErrorsAsync(() => setCartItemQuantity(item, newQty));
  };

  return (
    <Container maxWidth={"md"} sx={{ paddingTop: 5 }}>
      <Card>
        <CardHeader title={"Cart"} />
        <CardContent>
          <Stack spacing={2}>
            {cart.map((item) => (
              <>
                <Stack direction={"row"} spacing={2}>
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
                      href={`product/${item.productId}`}
                      sx={{
                        textDecoration: "none",
                        color: "black",
                        ":hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      <Typography variant={"h6"}>
                        {productsInCartMap[item.productId]?.name}
                      </Typography>
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
                      <NumberSelect
                        value={item.quantity || 0}
                        onChange={handleUpdateCartQty(item)}
                        max={Math.max(5, item.quantity || 0)}
                        label={"Qty"}
                      />
                    </Box>
                  </Stack>
                </Stack>
                <Divider />
              </>
            ))}
            <Typography textAlign={"right"}>
              Subtotal ({itemCount} item{itemCount > 1 ? "s" : ""}):{" "}
              <b>{currencyFormat(totalCost)}</b>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Box display={"flex"} justifyContent={"end"} sx={{ paddingTop: 2 }}>
        <Button variant={"contained"} onClick={() => router.push("/checkout")}>
          Checkout
        </Button>
      </Box>
    </Container>
  );
}
