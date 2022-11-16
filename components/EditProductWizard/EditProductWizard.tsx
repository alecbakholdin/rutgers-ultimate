import React, { useEffect, useState } from "react";
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
import { useDocument } from "react-firebase-hooks/firestore";
import { Product, productCollection } from "../../types/product";
import { doc, setDoc } from "@firebase/firestore";
import ProductSearchAutocomplete from "./ProductSearchAutocomplete";
import CurrencyTextField from "./CurrencyTextField";
import { Check, PendingOutlined } from "@mui/icons-material";

export default function EditProductWizard(): React.ReactElement {
  const [editStatus, setEditStatus] = useState<
    "pending" | "loading" | "nothing" | "error" | "done"
  >("nothing");

  const [productId, setProductId] = useState<string | null>(null);
  const docReference = productId ? doc(productCollection, productId) : null;
  const [product, loading] = useDocument(docReference);
  const [edits, setEdits] = useState<Product | null>(null);
  useEffect(() => {
    if (!loading) {
      setEditStatus("nothing");
      setEdits(product?.data() ?? null);
    }
  }, [product, loading]);

  const handleEdit = (edit: Partial<Product>) => {
    setEditStatus("pending");
    setEdits({ ...edits!, ...edit });
  };

  const handleSubmit = () => {
    if (docReference && edits && editStatus == "pending") {
      setEditStatus("loading");
      setDoc(docReference, edits)
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
          <Grid container justifyContent={"left"} spacing={1}>
            <Grid item xs={12}>
              <ProductSearchAutocomplete onChange={(id) => setProductId(id)} />
            </Grid>
            <Grid item />
            <Grid item xs={12}>
              <TextField
                value={edits?.name || ""}
                onChange={(e) => handleEdit({ name: e.target.value })}
                disabled={!Boolean(edits)}
                label={"Name"}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={"Image URL"}
                disabled={!Boolean(edits)}
                fullWidth
                value={edits?.image || ""}
                onChange={(e) => handleEdit({ image: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <CurrencyTextField
                label={"Price"}
                disabled={!Boolean(edits)}
                fullWidth
                value={edits?.price || 0}
                onChange={(e) =>
                  handleEdit({ price: parseFloat(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CurrencyTextField
                label={"TeamPrice"}
                disabled={!Boolean(edits)}
                fullWidth
                value={edits?.teamPrice || 0}
                onChange={(e) =>
                  handleEdit({ teamPrice: parseFloat(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Stack direction={"row"} alignItems={"center"}>
                <Button onClick={handleSubmit}>SUBMIT CHANGES</Button>
                <Typography>
                  {editStatus === "pending" ? (
                    <PendingOutlined />
                  ) : editStatus === "loading" ? (
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
