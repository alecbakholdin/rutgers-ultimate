import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { doc, setDoc, WithFieldValue } from "@firebase/firestore";
import { Product, productCollection } from "../types/product";

export default function CreateProductWizard(): React.ReactElement {
  const [editStatus, setEditStatus] = useState<"loading" | "done" | null>(null);
  const [productName, setProductName] = useState("");

  const handleSubmit = () => {
    if (productName) {
      const productId = productName
        .toLowerCase()
        .split(" ")
        .filter((word) => word)
        .join("-");

      setEditStatus("loading");
      setDoc(doc(productCollection, productId), {
        id: productId,
        name: productName,
      } as WithFieldValue<Product>).then(() => setEditStatus("done"));
    }
  };

  return (
    <Container maxWidth={"lg"}>
      <Card>
        <CardHeader title={"Create Product"} />
        <CardContent>
          <Grid container justifyContent={"left"} spacing={1}>
            <Grid item xs={12}>
              <TextField
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                label={"Product Name"}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <Stack direction={"row"} alignItems={"center"}>
                <Button onClick={handleSubmit}>SUBMIT</Button>
                <Typography color={"primary"}>
                  {editStatus === "loading" ? (
                    <CircularProgress size={15} color={"error"} />
                  ) : editStatus === "done" ? (
                    <Check />
                  ) : (
                    <></>
                  )}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
