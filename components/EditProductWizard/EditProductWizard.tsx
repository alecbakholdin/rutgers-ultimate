import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  TextField,
} from "@mui/material";
import { useDocument } from "react-firebase-hooks/firestore";
import { Product, productCollection } from "../../types/product";
import { doc, setDoc } from "@firebase/firestore";
import ProductSearchAutocomplete from "./ProductSearchAutocomplete";
import CurrencyTextField from "./CurrencyTextField";

export default function EditProductWizard(): React.ReactElement {
  const [productId, setProductId] = useState<string | null>(null);
  const docReference = productId ? doc(productCollection, productId) : null;
  const [product, loading, error] = useDocument(docReference);
  const [edits, setEdits] = useState<Product | null>(null);
  useEffect(() => {
    if (!loading) {
      setEdits(product?.data() ?? null);
    }
  }, [product, loading]);

  const handleSubmit = () => {
    if (docReference && edits) {
      setDoc(docReference, edits);
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
                onChange={(e) => setEdits({ ...edits!, name: e.target.value })}
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
                onChange={(e) => setEdits({ ...edits!, image: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <CurrencyTextField
                label={"Price"}
                disabled={!Boolean(edits)}
                fullWidth
                value={edits?.price || 0}
                onChange={(e) =>
                  setEdits({ ...edits!, price: parseFloat(e.target.value) })
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
                  setEdits({ ...edits!, teamPrice: parseFloat(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Button onClick={handleSubmit}>SUBMIT CHANGES</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
