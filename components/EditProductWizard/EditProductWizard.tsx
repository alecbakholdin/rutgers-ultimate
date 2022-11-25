import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import { useDocument } from "react-firebase-hooks/firestore";
import { Product, productCollection } from "types/product";
import { deleteDoc, doc, setDoc } from "@firebase/firestore";
import ProductSearchAutocomplete from "./ProductSearchAutocomplete";
import EditProductDetails from "./EditProductDetails";
import LoadingButton, { LoadingStatus } from "components/LoadingButton";

export default function EditProductWizard(): React.ReactElement {
  const [editStatus, setEditStatus] = useState<LoadingStatus | null>(null);

  const [productId, setProductId] = useState<string | null>(null);

  // manage product details
  const docReference = productId ? doc(productCollection, productId) : null;
  const [product, productLoading] = useDocument(docReference);
  const [edits, setEdits] = useState<Product | null>(null);
  useEffect(() => {
    if (!productLoading) {
      setEditStatus(null);
      setEdits(product?.data() ?? null);
    }
  }, [product, productLoading]);

  const handleEdit = (edit: Partial<Product>) => {
    setEditStatus("pending");
    setEdits({ ...edits!, ...edit });
  };

  const handleDelete = async () => {
    if (!docReference) {
      return;
    }
    setEditStatus("loading");
    await deleteDoc(docReference);
    setEditStatus("success");
    setProductId(null);
  };

  const handleSubmit = async () => {
    if (docReference && edits) {
      setEditStatus("loading");
      await setDoc(docReference, edits);
      setEditStatus("success");
    }
  };

  return (
    <Container maxWidth={"lg"}>
      <Card>
        <CardHeader title={"Edit Product"} />
        <CardContent>
          <Grid container justifyContent={"left"} spacing={4}>
            <Grid item xs={12}>
              <ProductSearchAutocomplete onChange={(id) => setProductId(id)} />
            </Grid>
            <Grid item xs={12}>
              <EditProductDetails
                edits={edits}
                handleEdit={handleEdit}
                handleSubmit={handleSubmit}
              />
            </Grid>
            <Grid item xs={6}>
              <Stack direction={"row"} alignItems={"center"}>
                <LoadingButton onClick={handleSubmit} status={editStatus}>
                  SUBMIT CHANGES
                </LoadingButton>
              </Stack>
            </Grid>
            <Grid item xs={6} container justifyContent={"right"}>
              <Button onClick={handleDelete} disabled={!Boolean(productId)}>
                DELETE ITEM
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
