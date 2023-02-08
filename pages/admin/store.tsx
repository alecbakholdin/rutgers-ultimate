import React from "react";
import { Button, Container, Stack } from "@mui/material";
import EditProductWizard from "components/EditProductWizard/EditProductWizard";
import Typography from "@mui/material/Typography";
import CreateProductWizard from "components/CreateProductWizard";
import EditColorsWizard from "components/EditColorsWizard";
import {
  useCollectionData,
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import { productCollection } from "types/product";
import { updateDoc } from "@firebase/firestore";
import { userDataCollection } from "types/userData";
import { Order, orderCollection } from "types/order";
import { extractKey } from "util/array";
import EventWizard from "../../components/EventWizard";

export default function ManageStore(): React.ReactElement {
  const [products] = useCollectionData(productCollection);
  const productMap = Object.fromEntries(
    products?.map((product) => [product.id, product]) ?? []
  );
  const [userData] = useCollectionDataOnce(userDataCollection);
  const userMap = extractKey(userData, "id");
  const [orders] = useCollectionDataOnce(orderCollection);
  const handleFix = async () => {
    console.log(orders);
    for (const order of orders ?? []) {
      const user = userMap[order.uid];
      const update: Partial<Order> = { cart: [...(order.cart || [])] };
      const isTeam = user.isTeam || user.email?.endsWith("rutgers.edu");
      let isDirty = false;
      for (const cartItem of update.cart ?? []) {
        if (!cartItem.unitPrice) {
          const product = productMap[cartItem.productId];
          cartItem.unitPrice = isTeam ? product?.teamPrice : product?.price;
          cartItem.totalPrice = cartItem.unitPrice * cartItem.quantity;
          isDirty = true;
        }
        if (
          !cartItem.numberField &&
          cartItem.number !== undefined &&
          cartItem.number !== null
        ) {
          cartItem.numberField = cartItem.number?.toString();
          isDirty = true;
        }
        if (!cartItem.event && order.dateCreated < new Date("2023-01-01")) {
          cartItem.event = "aArV98cYa3d8nsErTgiL";
          isDirty = true;
        } else if (!cartItem.event) {
          cartItem.event = "OeZmi1CZMzJGbRW3UHtw";
          isDirty = true;
        }
      }
      if (order.machinePercentage === undefined) {
        update.machinePercentage = update.nightshadePercentage = 50;
        isDirty = true;
      }
      if (!order.dateCreated || JSON.stringify(order.dateCreated) === "{}") {
        update.dateCreated = update.dateUpdated = new Date("2022-12-14");
        isDirty = true;
      }
      if (!order.isTeam && userMap[order.uid].isTeam) {
        update.isTeam = true;
        isDirty = true;
      }
      if (!order.eventIds) {
        update.eventIds = [order.cart[0].event];
        isDirty = true;
      }

      if (isDirty && order.ref) {
        await updateDoc(order.ref, update);
        console.log(update);
      }
    }
    console.log("done");
  };

  return (
    <Container maxWidth={"lg"} sx={{ marginTop: 5, marginBottom: 5 }}>
      <Stack justifyContent={"center"} spacing={2}>
        <Button onClick={handleFix}>FIX</Button>
        <Typography variant={"h4"} textAlign={"center"}>
          Manage Store
        </Typography>
        <EditProductWizard />
        <CreateProductWizard />
        <EditColorsWizard />
        <EventWizard />
      </Stack>
    </Container>
  );
}
