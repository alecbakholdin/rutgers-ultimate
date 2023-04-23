import {
  collection,
  CollectionReference,
  DocumentReference,
} from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";

export interface ProductColor {
  name: string;
  hex?: string;
  images?: string[];
}

export interface ProductImage {
  storagePath: string;
  colorNames: string[];
  assignedColor?: string;
}

export function defaultProductImage(): ProductImage {
  return {
    storagePath: "",
    colorNames: [],
  };
}

export type ProductFieldType = "text" | "number" | "options" | "color";

export interface ProductField {
  custom: boolean;
  presetName: "name" | "number" | "color" | "size" | "custom" | null;

  name: string;
  type: ProductFieldType;

  // for text or number
  maxChars: number;

  // for options
  options: string[];

  // for color
  colors: ProductColor[];
  required: boolean;
}

export function defaultField(): ProductField {
  return {
    name: "New Field",
    type: "text",
    maxChars: 0,
    options: [],
    colors: [] as ProductColor[],
    custom: false,
    presetName: null,
    required: false,
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  teamPrice: number;
  images?: string[];
  canHaveName: boolean;
  canHaveNumber: boolean;
  colors?: ProductColor[];
  productImages: ProductImage[];
  colorMap?: { [colorId: string]: ProductColor };
  sizes: string[];
  fields: ProductField[];
  ref?: DocumentReference<Product>;
}

export const productCollection: CollectionReference<Product> = collection(
  firestore,
  "products"
).withConverter(getFirestoreConverter<Product>());

export function defaultProduct(): Product {
  return {
    id: "",
    name: "",
    description: "",
    price: 0,
    teamPrice: 0,
    canHaveName: false,
    canHaveNumber: false,
    colors: [] as ProductColor[],
    productImages: [] as ProductImage[],
    sizes: [] as string[],
    fields: [] as ProductField[],
  };
}
