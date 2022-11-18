import React from "react";
import { Container, Stack } from "@mui/material";
import EditProductWizard from "components/EditProductWizard/EditProductWizard";
import Typography from "@mui/material/Typography";
import CreateProductWizard from "components/CreateProductWizard";

export default function ManageStore(): React.ReactElement {
  return (
    <Container maxWidth={"lg"} sx={{ marginTop: 5, marginBottom: 5 }}>
      <Stack justifyContent={"center"} spacing={2}>
        <Typography variant={"h4"} textAlign={"center"}>
          Manage Store
        </Typography>
        <EditProductWizard />
        <CreateProductWizard />
      </Stack>
    </Container>
  );
}
