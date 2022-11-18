import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";
import {
  Product,
  productCollection,
  ProductVariant,
  variantCollection,
} from "types/product";
import { deleteDoc, doc, setDoc } from "@firebase/firestore";
import ProductSearchAutocomplete from "./ProductSearchAutocomplete";
import { Check, PendingOutlined } from "@mui/icons-material";
import EditProductDetails from "./EditProductDetails";
import EditProductVariants from "./EditProductVariants";

export default function EditProductWizard(): React.ReactElement {
  const [editStatus, setEditStatus] = useState<
    "pending" | "loading" | "nothing" | "error" | "done"
  >("nothing");

  const [productId, setProductId] = useState<string | null>(null);

  // manage product details
  const docReference = productId ? doc(productCollection, productId) : null;
  const [product, productLoading] = useDocument(docReference);
  const [edits, setEdits] = useState<Product | null>(null);
  useEffect(() => {
    if (!productLoading) {
      setEditStatus("nothing");
      setEdits(product?.data() ?? null);
    }
  }, [product, productLoading]);

  const handleEdit = (edit: Partial<Product>) => {
    setEditStatus("pending");
    setEdits({ ...edits!, ...edit });
  };

  // manage variants
  const query = useMemo(() => {
    return productId ? variantCollection(productId) : null;
  }, [productId]);
  const [variants, variantsLoading] = useCollectionData<ProductVariant>(query);
  const [updatedVariants, setUpdatedVariants] = useState<ProductVariant[]>([]);
  const handleSetVariants = (variants: ProductVariant[]) => {
    setEditStatus("pending");
    setUpdatedVariants(variants);
  };
  useEffect(() => {
    if (variants && !variantsLoading) {
      setUpdatedVariants(variants);
    }
  }, [variantsLoading]);

  const handleSubmit = () => {
    if (docReference && edits && editStatus == "pending") {
      setEditStatus("loading");
      setDoc(docReference, edits)
        .then(() => {
          // deleting old variants
          variants
            ?.filter(
              (old) => !updatedVariants.find((update) => old.id == update.id)
            )
            .forEach(
              async (toDelete) => await deleteDoc(doc(query!, toDelete.id))
            );
        })
        .then(() => {
          // adding new variants and updating
          updatedVariants.forEach(async (v, i) => {
            await setDoc(doc(query!, v.id), {
              id: v.id,
              order: i,
            } as ProductVariant);
          });
        })
        .then(() => setEditStatus("done"))
        .catch((e) => {
          setEditStatus("error");
          console.error(e);
        });
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
              <EditProductDetails edits={edits} handleEdit={handleEdit} />
            </Grid>
            <Grid item xs={12}>
              <EditProductVariants
                variants={updatedVariants}
                setVariants={handleSetVariants}
                disabled={!Boolean(productId) || variantsLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <Stack direction={"row"} alignItems={"center"}>
                <Button onClick={handleSubmit}>SUBMIT CHANGES</Button>
                <Typography color={"primary"}>
                  {editStatus === "pending" ? (
                    <PendingOutlined />
                  ) : editStatus === "loading" ? (
                    <CircularProgress size={15} />
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
