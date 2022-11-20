import React, { useEffect, useState } from "react";
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import CurrencyTextField from "components/EditProductWizard/CurrencyTextField";
import { useCart } from "types/userData";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "config/firebaseApp";
import { useSnackbar } from "notistack";
import LoadingButton, { LoadingStatus } from "components/LoadingButton";
import { addDoc } from "@firebase/firestore";
import { orderCollection } from "types/order";

interface OrderInfo {
  venmo?: string;
  firstName?: string;
  lastName?: string;
  totalCost?: number;
  phoneNumber?: number;
  email?: string;
  uid?: string;
}

export default function Checkout(): React.ReactElement {
  const { cart, totalCost, clearCart } = useCart();
  const [user] = useAuthState(auth);
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({});
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    let update = { ...orderInfo };
    if (totalCost) {
      update = { ...update, totalCost };
    }
    if (user) {
      update = { ...update, email: user.email ?? undefined, uid: user.uid };
    }
    setOrderInfo(update);
  }, [totalCost, user]);

  const handleChangeOrderInfo =
    (key: keyof OrderInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setOrderInfo({ ...orderInfo, [key]: e.target.value });
    };
  const [submitStatus, setSubmitStatus] = useState<LoadingStatus | null>();
  const handleSubmit = async () => {
    if (totalCost === 0) {
      enqueueSnackbar("You don't have anything in your cart!", {
        variant: "error",
      });
    }
    const fields: (keyof OrderInfo)[] = [
      "venmo",
      "firstName",
      "lastName",
      "totalCost",
      "phoneNumber",
      "email",
      "uid",
    ];
    for (const key of fields) {
      if (!orderInfo[key]) {
        enqueueSnackbar(`Missing field '${key}'`, { variant: "error" });
        return;
      }
    }
    setSubmitStatus("loading");
    await addDoc(orderCollection, {
      ...orderInfo,
      summary: [...(cart ? cart : [])],
    } as unknown);
    await clearCart();
    setSubmitStatus("success");
    setOrderInfo({});
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
              <TextField
                label={"Your Venmo"}
                value={orderInfo.venmo ?? ""}
                error={!Boolean(orderInfo.venmo)}
                onChange={handleChangeOrderInfo("venmo")}
                required
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
                <TextField
                  label={"First Name"}
                  value={orderInfo.firstName ?? ""}
                  error={!Boolean(orderInfo.firstName)}
                  onChange={handleChangeOrderInfo("firstName")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={"Last Name"}
                  value={orderInfo.lastName ?? ""}
                  error={!Boolean(orderInfo.lastName)}
                  onChange={handleChangeOrderInfo("lastName")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={"Phone Number"}
                  value={orderInfo.phoneNumber ?? ""}
                  error={!Boolean(orderInfo.phoneNumber)}
                  onChange={handleChangeOrderInfo("phoneNumber")}
                  fullWidth
                  required
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
