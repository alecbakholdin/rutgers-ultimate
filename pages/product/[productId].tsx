import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { productCollection } from "types/product";
import { doc } from "@firebase/firestore";
import { Alert, Container, Grid, Typography } from "@mui/material";
import { currencyFormat } from "config/currencyUtils";
import ProductCartSummary from "components/ProductCartSummary";
import { CartItem, useUserData, useUserData2 } from "types/userData";
import ImageGallery from "components/ImageGallery";
import ProductColorPicker from "components/ProductColorPicker";
import BetterTextField from "components/BetterTextField";
import LoadingButton from "components/LoadingButton";
import QuantitySelect from "components/QuantitySelect";
import StringSelect from "components/StringSelect";
import { useMySnackbar } from "hooks/useMySnackbar";

export default function ProductPage(): React.ReactElement {
  const { getItemPrice, addToCartItem } = useUserData2();
  useUserData();
  const router = useRouter();
  const { productId } = router.query;
  const [product] = useDocumentDataOnce(doc(productCollection, `${productId}`));
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  useEffect(() => {
    if ((!selectedColor && product?.colors?.length) ?? 0 > 0) {
      setSelectedColor(product?.colors[0].name);
    }
  }, [product]);
  const imgArray = useMemo(() => {
    if (
      selectedColor &&
      product?.colorMap &&
      (product?.colorMap[selectedColor]?.images?.length ?? 0) > 0
    ) {
      return product.colorMap[selectedColor].images;
    }
    return product?.images;
  }, [product, selectedColor]);
  const [quantity, setQuantity] = useState(1);
  const handleSetQuantity = (qty: number) => {
    setQuantity(Math.max(1, qty));
  };
  const [name, setName] = useState("");
  const [size, setSize] = useState<string>("");
  const [numberField, setNumberField] = useState<string>("");
  const handleChangeNumber = (val: string) => {
    val = val.replace(/\D/, "").slice(0, 2);
    if (val === "") {
      setNumberField("");
    } else {
      setNumberField(val);
    }
  };

  const { showError } = useMySnackbar();
  const handleSubmit = async () => {
    if (product?.sizes?.length && !size) {
      showError("Please select a size");
      return;
    }
    if (!product) {
      showError("Unexpected error occurred: product missing somehow");
      return;
    }
    const unitPrice = getItemPrice(product);
    const totalPrice = unitPrice * quantity;
    const cartItem: CartItem = {
      productId: product.id,
      color: selectedColor,
      size,
      quantity,
      name,
      numberField,
      unitPrice,
      image: imgArray?.length ? imgArray[0] : undefined,
      totalPrice,
    };
    try {
      await addToCartItem(cartItem, quantity);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
        showError(e.message);
      }
    }
  };

  return (
    <Container maxWidth={"md"} sx={{ paddingTop: 5 }}>
      <Grid
        container
        justifyContent={"center"}
        alignItems={"start"}
        spacing={3}
      >
        <Grid item xs={8} sm={4}>
          <ImageGallery imageLinks={imgArray} />
        </Grid>
        <Grid item container xs={8} spacing={1} rowSpacing={2}>
          <Grid item xs={12}>
            <Typography variant={"h4"}>{product?.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"h6"}>
              {currencyFormat(product && getItemPrice(product))}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Alert severity={"warning"}>
              Inventory will be shipped out in late February.
            </Alert>
          </Grid>
          {selectedColor && (
            <Grid item xs={12}>
              <ProductColorPicker
                setSelectedColor={setSelectedColor}
                selectedColor={selectedColor}
                productColors={product?.colors}
                swatchSize={35}
                sx={{ padding: 1 }}
              />
            </Grid>
          )}
          {product?.canHaveName && (
            <Grid item flexGrow={1}>
              <BetterTextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                label={"Name (optional)"}
                fullWidth
              />
            </Grid>
          )}
          {product?.canHaveNumber && (
            <Grid item flexGrow={1}>
              <BetterTextField
                value={numberField ?? ""}
                onChange={(e) => handleChangeNumber(e.target.value)}
                label={"Number (optional)"}
                type={"tel"}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12} sx={{ margin: 0 }} />
          {(product?.sizes?.length ?? 0) > 0 && (
            <Grid item xs={4} sm={6}>
              <StringSelect
                label={"Size"}
                value={size}
                values={product?.sizes ?? []}
                onChange={setSize}
              />
            </Grid>
          )}
          <Grid item xs={8} sm={6}>
            <QuantitySelect
              quantity={quantity}
              setQuantity={handleSetQuantity}
            />
          </Grid>

          <Grid
            item
            flexGrow={1}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <LoadingButton
              variant={"contained"}
              onClick={handleSubmit}
              sx={{ width: "100%", height: "100%" }}
            >
              Add to cart
            </LoadingButton>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {product && <ProductCartSummary product={product} />}
        </Grid>
      </Grid>
    </Container>
  );
}
