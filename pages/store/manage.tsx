import React from "react";
import { Container, Stack } from "@mui/material";
import EditProductWizard from "../../components/EditProductWizard/EditProductWizard";
import Typography from "@mui/material/Typography";

export default function ManageStore(): React.ReactElement {
  return (
    <Container maxWidth={"lg"}>
      <Typography variant={"h4"} gutterBottom>
        Manage Store
      </Typography>
      <Stack>
        <EditProductWizard />
      </Stack>
    </Container>
  );
}
