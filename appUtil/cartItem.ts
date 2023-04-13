import { Product, ProductField } from "types/product";
import { useState } from "react";
import { useMySnackbar } from "hooks/useMySnackbar";
import { useAuth } from "appComponents/AuthProvider";
import { userDataCollection } from "types/userData";
import { objsEqual } from "util/object";
import { ServerEvent } from "types/event";
import { remove, update } from "util/array";
import { doc, updateDoc } from "@firebase/firestore";
import { defaultNewCartItem, NewCartItemFieldValues } from "types/newCartItem";

export function getDefaultColorField(product: Product) {
  return product.fields?.find((f) => f.type === "color");
}

export function getDefaultFieldValues(
  product: Product
): NewCartItemFieldValues {
  const colorField = getDefaultColorField(product);
  return colorField ? { [colorField.name]: colorField.colors?.[0]?.name } : {};
}

export function useFieldValuesState(event: ServerEvent, product: Product) {
  const { showError, showInfo } = useMySnackbar();
  const { userData } = useAuth();
  const [fieldValues, setFieldValues] = useState(
    getDefaultFieldValues(product)
  );
  const [loading, setLoading] = useState(false);

  const resetFieldValues = () => setFieldValues(getDefaultFieldValues(product));
  const getFieldValue = (field: ProductField) => fieldValues[field.name];
  const setFieldValue = (field: ProductField, value: any) =>
    setFieldValues({ ...fieldValues, [field.name]: value });

  const handleAddToCart = (quantity: number) => {
    // validate all required fields are filled out and user is logged in
    if (!userData) {
      showError("Please log in first");
      return;
    }
    const missingFields = product.fields
      ?.filter((f) => f.required && !getFieldValue(f))
      .map((f) => f.name);
    if (missingFields.length) {
      showError(
        `Missing required field${
          missingFields.length > 1 ? "s" : ""
        } ${missingFields.join(", ")}`
      );
      return;
    }

    const userDataRef = doc(userDataCollection, userData.id);
    const cart = userData.cart || [];
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.eventId &&
        objsEqual(item.fieldValues, fieldValues)
    );
    // add 1 if exists with same fields
    let newItems;
    if (existingItemIndex >= 0) {
      const existingItem = cart[existingItemIndex];
      const existingQty = existingItem.quantity;
      const newQty = existingQty + quantity;
      newItems =
        newQty > 0
          ? update(cart, existingItemIndex, { quantity: newQty })
          : remove(cart, existingItemIndex);
    }

    // create if not exists
    else {
      newItems = [
        ...cart,
        defaultNewCartItem(event, product, fieldValues, quantity),
      ];
    }

    setLoading(true);
    updateDoc(userDataRef, "cart", newItems)
      .then(() => showInfo("Successfully added to cart"))
      .finally(() => setLoading(false));
  };

  return {
    fieldValues,
    setFieldValues,
    resetFieldValues,
    getFieldValue,
    setFieldValue,
    handleAddToCart,
    loading,
  };
}
