"use client";
import React, { useMemo, useState } from "react";
import {
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import OrdersDataGrid from "app/(RegularApp)/admin/oldOrders/OrdersDataGrid";
import ProductSummaryDataGrid from "app/(RegularApp)/admin/oldOrders/ProductSummaryDataGrid";
import {
  useCollectionData,
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import { orderCollection } from "types/oldOrder";
import AdminEventSummary from "app/(RegularApp)/admin/oldOrders/AdminEventSummary";
import { Event, eventCollection } from "types/event";
import { query, where } from "@firebase/firestore";
import { Email } from "@mui/icons-material";
import { useMySnackbar } from "hooks/useMySnackbar";

export default function Page(): React.ReactElement {
  const [events] = useCollectionDataOnce(eventCollection, { initialValue: [] });
  const [eventId, setEventId] = useState("");
  const { showError, showSuccess } = useMySnackbar();
  const q = useMemo(
    () =>
      eventId
        ? query(orderCollection, where("eventIds", "array-contains", eventId))
        : undefined,
    [eventId]
  );
  const [orders] = useCollectionData(q);
  const handleEventChange = (e: SelectChangeEvent) => {
    setEventId(e.target.value as string);
  };

  const copyEmails = async () => {
    const emailList = orders
      ?.filter((order) => order.email)
      .map((order) => `${order.firstName} ${order.lastName}<${order.email}>`)
      .join(", ");
    if (!emailList) {
      showError("Email list is empty for some reason");
      return;
    }
    await navigator.clipboard.writeText(emailList);
    showSuccess("Copied emails to clipboard");
  };

  return (
    <Container sx={{ paddingTop: 5, height: 600 }}>
      <Typography variant={"h4"}>Orders</Typography>
      <FormControl>
        <InputLabel>Event</InputLabel>
        <Select label={"Event"} value={eventId} onChange={handleEventChange}>
          {events?.map((e) => (
            <MenuItem key={e.id} value={e.id}>
              {e.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction={"row"}>
        <IconButton onClick={copyEmails}>
          <Email />
        </IconButton>
      </Stack>
      <AdminEventSummary orders={orders} />
      <OrdersDataGrid orders={orders} />
      <ProductSummaryDataGrid orders={orders} />
    </Container>
  );
}
