import React, { useMemo, useState } from "react";
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import OrdersDataGrid from "../../components/OrdersDataGrid";
import ProductSummaryDataGrid from "../../components/ProductSummaryDataGrid";
import {
  useCollectionData,
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import { orderCollection } from "../../types/order";
import AdminEventSummary from "../../components/AdminEventSummary";
import { Event, eventCollection } from "../../types/event";
import { query, where } from "@firebase/firestore";

export default function Orders(): React.ReactElement {
  const [events] = useCollectionDataOnce(eventCollection, { initialValue: [] });
  const [eventId, setEventId] = useState("");
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
      <AdminEventSummary orders={orders} />
      <OrdersDataGrid orders={orders} />
      <ProductSummaryDataGrid orders={orders} />
    </Container>
  );
}
