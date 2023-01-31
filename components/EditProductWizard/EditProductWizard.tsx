import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
} from "@mui/material";
import { useDocument } from "react-firebase-hooks/firestore";
import { Product, productCollection } from "types/product";
import { deleteDoc, doc, setDoc } from "@firebase/firestore";
import ProductSearchAutocomplete from "./ProductSearchAutocomplete";
import EditProductDetails from "./EditProductDetails";
import StatusButton, { LoadingStatus } from "components/StatusButton";
import EditColorImages from "components/EditProductWizard/EditColorImages";

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
      console.log(product?.data());
    }
  }, [product, productLoading]);

  const handleEdit = (edit: Partial<Product>) => {
    setEditStatus("pending");
    setEdits({
      ...edits!,
      ...edit,
      colorMap: { ...(edits!.colorMap ?? {}), ...(edit.colorMap ?? {}) },
    });
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
    <Card>
      <CardHeader title={"Edit Product"} />
      <CardContent>
        <Grid container justifyContent={"left"} spacing={4}>
          <Grid item xs={12}>
            <ProductSearchAutocomplete onChange={(id) => setProductId(id)} />
          </Grid>
          <Grid item xs={12}>
            <EditProductDetails edits={edits} handleEdit={handleEdit} />
          </Grid>
          <Grid item xs={12}>
            <EditColorImages edits={edits} handleEdit={handleEdit} />
          </Grid>
          <Grid item xs={6}>
            <Stack direction={"row"} alignItems={"center"}>
              <StatusButton onClick={handleSubmit} status={editStatus}>
                SUBMIT CHANGES
              </StatusButton>
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
  );
}
