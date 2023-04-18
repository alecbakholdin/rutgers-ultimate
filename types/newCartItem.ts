import { ServerEvent } from "types/storeEvent";
import { Product } from "types/product";

export type NewCartItemFieldValues = { [fieldName: string]: any };

export interface NewCartItem {
  productId: string;
  productName: string;
  eventId: string;
  eventName: string;
  fieldValues: NewCartItemFieldValues;
  quantity: number;
  imageStoragePath: string;
  unitPrice: number;
  teamUnitPrice: number;
  delivered: boolean;
}

export function defaultNewCartItem(
  event: ServerEvent,
  product: Product,
  fieldValues: NewCartItemFieldValues,
  quantity: number
): NewCartItem {
  const colorField = product.fields.find((f) => f.type === "color");
  const selectedColor = fieldValues[colorField?.name || ""];

  const productImages = product.productImages;
  const image = selectedColor
    ? productImages.find((i) => i.colorNames.includes(selectedColor))
    : productImages?.length
    ? productImages[0]
    : undefined;

  return {
    productId: product.id,
    productName: product.name,
    eventId: event.id,
    eventName: event.name,
    fieldValues,
    quantity,
    unitPrice: product.price,
    teamUnitPrice: product.teamPrice,
    imageStoragePath: image?.storagePath || "",
    delivered: false,
  };
}
