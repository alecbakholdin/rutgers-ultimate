import React from "react";
import { Button, Container, Stack } from "@mui/material";
import EditProductWizard from "components/EditProductWizard/EditProductWizard";
import Typography from "@mui/material/Typography";
import CreateProductWizard from "components/CreateProductWizard";
import EditColorsWizard from "components/EditColorsWizard";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { productCollection } from "types/product";
import { updateDoc } from "@firebase/firestore";

export default function ManageStore(): React.ReactElement {
  const [products] = useCollectionData(productCollection);
  const handleFix = async () => {
    for (const product of products ?? []) {
      const colorMap = Object.fromEntries(
        product?.colors?.map((color) => [color.name, color]) ?? []
      );
      await updateDoc(product.ref, { colorMap });
      console.log("Finished " + product.name);
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
      </Stack>
    </Container>
  );
}
