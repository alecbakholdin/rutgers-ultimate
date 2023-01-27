import React, { useState } from "react";
import { Alert, Container, Stack } from "@mui/material";
import { useUserData2 } from "types/userData";
import LoadingButton, { LoadingStatus } from "components/LoadingButton";
import { addDoc } from "@firebase/firestore";
import { orderCollection, OrderInfo } from "types/order";
import { useRouter } from "next/router";
import { useMySnackbar } from "hooks/useMySnackbar";
import PaymentMethodSelector from "components/PaymentMethodSelector";
import OrderPersonDetailSection from "components/OrderPersonDetailSection";
import OrderDonationSliderSection from "components/OrderDonationSliderSection";
import CommentsSection from "components/CommentsSection";

export default function Checkout(): React.ReactElement {
  const { user, cart, totalCost, clearCart } = useUserData2();
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    machinePercentage: 50,
    nightshadePercentage: 50,
  });
  const { showError } = useMySnackbar();
  const eventsInCart: string[] = cart?.reduce(
    (prev, curr) => (prev.includes(curr.event) ? prev : [...prev, curr.event]),
    [] as string[]
  );

  const handleChangeOrderInfo =
    (key: keyof OrderInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setOrderInfo({ ...orderInfo, [key]: e.target.value });
    };
  const [submitStatus, setSubmitStatus] = useState<LoadingStatus | null>();
  const handleSubmit = async () => {
    if (!user) {
      showError("Please log in first");
      return;
    }
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
      isTeam: user.isTeam,
      email: user.email,
      totalCost,
      cart,
      eventIds: eventsInCart,
      dateCreated: new Date(),
      dateUpdated: new Date(),
    } as unknown);
    await clearCart();
    setSubmitStatus("success");
    setOrderInfo({});
    await router.push("/thankyou");
  };

  const checkoutSectionProps = {
    orderInfo,
    handleChangeOrderInfo,
    handleSubmit,
    setOrderInfo,
  };

  return (
    <Container maxWidth={"md"} sx={{ marginTop: 5 }}>
      <Stack spacing={2}>
        <Alert severity={"info"}>More payment methods are coming</Alert>
        <PaymentMethodSelector {...checkoutSectionProps} />
        <OrderPersonDetailSection {...checkoutSectionProps} />
        <OrderDonationSliderSection {...checkoutSectionProps} />
        <CommentsSection {...checkoutSectionProps} />
        <Stack direction={"row"}>
          <LoadingButton status={submitStatus} onClick={handleSubmit}>
            SUBMIT
          </LoadingButton>
        </Stack>
      </Stack>
    </Container>
  );
}
