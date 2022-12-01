import React from "react";
import { useUserData2 } from "types/userData";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
} from "@mui/material";

export default function Cart(): React.ReactElement {
  const { cart, getItemPrice, productsInCart, totalCost } = useUserData2();

  return (
    <Container maxWidth={"md"} sx={{ paddingTop: 5 }}>
      <Card>
        <CardHeader title={"Cart"} />
        <CardContent>
          <Stack spacing={2}>
            {cart.map((item) => (
              <Stack direction={"row"}>
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
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
