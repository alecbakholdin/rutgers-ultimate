import React, { useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useActiveEventsOnce } from "../../types/event";
import { useRouter } from "next/router";

export default function Store(): React.ReactElement {
  const [events] = useActiveEventsOnce();
  const router = useRouter();
  useEffect(() => {
    if (events?.length === 1) {
      router.push(`/store/${events[0].id}`).catch(console.error);
    }
  }, [events]);

  return (
    <Container maxWidth={"lg"} sx={{ paddingTop: 5 }}>
      <Typography variant={"h4"}>Active Events</Typography>
    </Container>
  );
}
