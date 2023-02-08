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
  Stack,
  Typography,
} from "@mui/material";
import { useMySnackbar } from "hooks/useMySnackbar";
import { currencyFormat } from "util/currency";
import router from "next/router";
import CartItemRow from "../components/CartItemRow";

export default function Cart(): React.ReactElement {
  const { cart, setCartItemQuantity, totalCost, itemCount } = useUserData2();
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
                <CartItemRow
                  item={item}
                  onChangeQty={handleUpdateCartQty(item)}
                />
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
