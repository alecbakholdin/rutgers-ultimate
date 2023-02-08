import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Event, eventCollection } from "../types/event";
import { extractKey } from "util/array";
import BetterTextField from "./BetterTextField";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { addDoc, updateDoc } from "@firebase/firestore";
import { deleteDoc } from "@firebase/firestore/lite";
import ProductSelector from "./ProductSelector";
import NumberSelect from "./NumberSelect";

export default function EventWizard(): React.ReactElement {
  const [events] = useCollectionData(eventCollection);
  const eventArr = events || [];
  const eventMap = extractKey(eventArr, "id");
  const [eventId, setEventId] = useState<string | null>(null);
  const [event, setEvent] = useState<Event | undefined>(undefined);
  useEffect(() => {
    setEvent(eventMap[eventId ?? ""]);
  }, [eventId]);
  const handleEdit = (update: Partial<Event>) => {
    console.log(update);
    if (event) {
      setEvent({ ...event, ...update });
    }
  };
  const handleCreateEvent = async () => {
    const newEvent = await addDoc(eventCollection, {
      name: "New Event",
      endDate: new Date(),
    } as Event);
    setEventId(newEvent.id);
  };
  const handleDeleteEvent = async () => {
    if (event) {
      await deleteDoc(event.ref);
    }
  };
  const handleUpdateEvent = async () => {
    if (event) {
      await updateDoc(event.ref, event);
    }
  };

  return (
    <Card>
      <CardHeader title={"Edit Events"} />
      <CardContent>
        <Grid container gap={1}>
          <Grid item xs={12}>
            <Autocomplete
              value={eventId}
              onChange={(_, newValue) => setEventId(newValue)}
              renderInput={(params) => (
                <TextField {...params} label={"Select Event"} />
              )}
              options={eventArr.map((e) => e.id)}
              getOptionLabel={(option) => eventMap[option ?? ""]?.name || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              value={event?.id || ""}
              disabled
              label={"ID"}
            />
          </Grid>
          <Grid item xs={12}>
            <BetterTextField
              fullWidth
              label={"Name"}
              value={event?.name || ""}
              onChange={(e) => handleEdit({ name: e.target.value })}
            />
          </Grid>
          <Grid item>
            <DateTimePicker
              onChange={(newValue) =>
                handleEdit({ endDate: dayjs(newValue).toDate() })
              }
              value={event?.endDate ? dayjs(event.endDate.toString()) : null}
              renderInput={(params) => (
                <TextField {...params} label={"End Date"} />
              )}
            />
          </Grid>
          <Grid item>
            <NumberSelect
              value={event?.sizingChartCount || 0}
              label={"Sizing Charts"}
              onChange={(e) => handleEdit({ sizingChartCount: e })}
              disabled={!event}
            />
          </Grid>
          <Grid item xs={12}>
            <ProductSelector
              productIds={event?.productIds || []}
              setProductIds={(val) =>
                handleEdit({ productIds: val.map((e) => e.toString()) })
              }
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button onClick={handleCreateEvent}>New Event</Button>
        <Button onClick={handleUpdateEvent}>Submit Changes</Button>
        <Button onClick={handleDeleteEvent}>Delete</Button>
      </CardActions>
    </Card>
  );
}
