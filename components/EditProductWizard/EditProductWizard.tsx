import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
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
import EditProductDetails from "./EditProductDetails";
import EditProductVariants from "./EditProductVariants";
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

  // manage variants
  const variantCollectionMemo = useMemo(
    () => (productId ? variantCollection(productId) : null),
    [productId]
  );
  const [variants, variantsLoading] = useCollectionData<ProductVariant>(
    variantCollectionMemo
  );
  const [updatedVariants, setUpdatedVariants] = useState<ProductVariant[]>([]);
  const handleSetVariants = (variants: ProductVariant[]) => {
    setEditStatus("pending");
    setUpdatedVariants(variants);
  };
  useEffect(() => {
    if (variants && !variantsLoading) {
      setUpdatedVariants(variants);
    } else if (variantsLoading) {
      setUpdatedVariants([]);
    }
  }, [variantsLoading]);

  const handleDelete = async () => {
    if (!docReference) {
      return;
    }
    setEditStatus("loading");
    if (variants) {
      for (const variant of variants) {
        await deleteDoc(variant.ref);
      }
    }
    await deleteDoc(docReference);
    setEditStatus("success");
    setProductId(null);
  };

  const handleSubmit = async () => {
    if (docReference && edits) {
      setEditStatus("loading");
      await setDoc(docReference, edits);

      if (variantCollectionMemo) {
        // delete docs that are no longer present in updatedVariants
        const toDeleteDocs =
          (await variants?.filter(
            (old) => !updatedVariants.find((update) => old.id == update.id)
          )) ?? [];
        for (const toDelete of toDeleteDocs) {
          await deleteDoc(doc(variantCollectionMemo, toDelete.id));
        }

        // update docs with new order
        for (let i = 0; i < updatedVariants.length; i++) {
          const update = {
            id: updatedVariants[i].id,
            order: i,
          } as ProductVariant;
          await setDoc(doc(variantCollectionMemo, update.id), update);
        }
      }

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
              <EditProductDetails edits={edits} handleEdit={handleEdit} />
            </Grid>
            <Grid item xs={12}>
              <EditProductVariants
                variants={updatedVariants}
                setVariants={handleSetVariants}
                variantsLoading={variantsLoading}
                disabled={!Boolean(productId) || variantsLoading}
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
