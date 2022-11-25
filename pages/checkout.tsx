import React, { useState } from "react";
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import CurrencyTextField from "components/EditProductWizard/CurrencyTextField";
import { useUserData2 } from "types/userData";
import LoadingButton, { LoadingStatus } from "components/LoadingButton";
import { addDoc } from "@firebase/firestore";
import { orderCollection } from "types/order";
import { useRouter } from "next/router";
import BetterTextField from "components/BetterTextField";
import { useMySnackbar } from "hooks/useMySnackbar";

interface OrderInfo {
  venmo?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: number;
}

export default function Checkout(): React.ReactElement {
  const { user, cart, totalCost, clearCart } = useUserData2();
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({});
  const { showError } = useMySnackbar();

  const handleChangeOrderInfo =
    (key: keyof OrderInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setOrderInfo({ ...orderInfo, [key]: e.target.value });
    };
  const [submitStatus, setSubmitStatus] = useState<LoadingStatus | null>();
  const handleSubmit = async () => {
    if (totalCost === 0) {
      showError("You don't have anything in your cart!");
      return;
    }
    const fields: (keyof OrderInfo)[] = [
      "venmo",
      "firstName",
      "lastName",
      "phoneNumber",
    ];
    for (const key of fields) {
      if (!orderInfo[key]) {
        showError(`Missing field '${key}'`);
        return;
      }
    }
    if (!cart || !user?.email || isNaN(totalCost) || totalCost === 0) {
      showError(
        "Something went wrong. Please restart checkout process and make sure you have something in your cart"
      );
      return;
    }
    setSubmitStatus("loading");
    await addDoc(orderCollection, {
      ...orderInfo,
      uid: user.id,
      email: user.email,
      totalCost,
      cart,
    } as unknown);
    await clearCart();
    setSubmitStatus("success");
    setOrderInfo({});
    await router.push("/thankyou");
  };

  return (
    <Container maxWidth={"md"} sx={{ marginTop: 5 }}>
      <Stack spacing={2}>
        <Alert severity={"info"}>More payment methods are coming</Alert>
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
        <Stack direction={"row"}>
          <LoadingButton status={submitStatus} onClick={handleSubmit}>
            SUBMIT
          </LoadingButton>
        </Stack>
      </Stack>
    </Container>
  );
}
