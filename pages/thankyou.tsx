import React from "react";
import { Container, Typography } from "@mui/material";

export default function Thankyou(): React.ReactElement {
  return (
    <Container maxWidth={"lg"} sx={{ marginTop: 5 }}>
      <Typography color={"primary"} textAlign={"center"} variant={"h3"}>
        Thank you for your order!
      </Typography>
    </Container>
  );
}
