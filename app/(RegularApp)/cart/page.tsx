"use client";
import { useAuth } from "components/AuthProvider";
import React from "react";
import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import { userDataCollection } from "types/userData";
import { remove, update } from "util/array";
import { doc, updateDoc } from "@firebase/firestore";
import StorageImage from "appComponents/StorageImage";
import FancyPrice from "appComponents/FancyPrice";
import NumberSelect from "components/NumberSelect";
import Link from "next/link";
import LoadingButton from "components/LoadingButton";
import { NewCartItem } from "types/newCartItem";

export default function Cart() {
  const { userData, user, isTeam, loading } = useAuth();
  const { palette } = useTheme();

  const updateQuantity = async (itemIndex: number, qty: number) => {
    if (!userData?.cart || userData.cart.length <= itemIndex) return;
    const newCart: NewCartItem[] = qty
      ? update(userData.cart, itemIndex, { quantity: qty })
      : remove(userData.cart, itemIndex);
    await updateDoc(doc(userDataCollection, user?.uid), {
      cart: newCart as any,
    });
  };

  return (
    <Container maxWidth={"md"}>
      <Stack width={"100%"} spacing={1}>
        <Typography variant={"h2"}>Cart</Typography>
        {userData?.cart?.map(
          (
            {
              productId,
              productName,
              unitPrice,
              teamUnitPrice,
              quantity,
              fieldValues,
              imageStoragePath,
            },
            i
          ) => (
            <Box
              key={`cart-${i}`}
              border={"1px solid " + palette.divider}
              padding={3}
              borderRadius={4}
            >
              <Stack key={i} direction={"row"} width={"100%"}>
                <Box height={150} width={150}>
                  <StorageImage storagePath={imageStoragePath} />
                </Box>
                <Stack flexGrow={1}>
                  <Typography variant={"h5"} color={"primary"}>
                    {productName || productId}
                  </Typography>
                  {Object.entries(fieldValues)
                    .sort(([key1], [key2]) => key1.localeCompare(key2))
                    .map(([key, value]) => (
                      <Typography key={key} variant={"body2"}>
                        <b>{key}:</b> {value}
                      </Typography>
                    ))}
                </Stack>
                <Stack spacing={2} alignSelf={"center"}>
                  <NumberSelect
                    label={"Qty"}
                    value={quantity}
                    onChange={(newQty) => updateQuantity(i, newQty)}
                    selectProps={{ size: "small" }}
                  />
                  <FancyPrice
                    price={unitPrice * quantity}
                    teamPrice={teamUnitPrice * quantity}
                    isTeam={isTeam}
                    userLoading={loading}
                    userData={userData}
                  />
                </Stack>
              </Stack>
            </Box>
          )
        )}
        <Box alignSelf={"end"}>
          <Link href={"/checkout"}>
            <LoadingButton variant={"contained"}>Checkout</LoadingButton>
          </Link>
        </Box>
      </Stack>
    </Container>
  );
}
