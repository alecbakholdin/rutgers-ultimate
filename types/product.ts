import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "@firebase/firestore";
import { firestore } from "../app/firebaseApp";
import { getFirestoreConverter } from "../config/firestoreConverter";

export interface Product {
  id: string;
  name: string;
  price: number;
  teamPrice: number;
  image?: string;
  ref: DocumentReference<Product>;
}

export const productCollection: CollectionReference<Product> = collection(
  firestore,
  "products"
).withConverter(getFirestoreConverter<Product>());

export interface ProductVariant {
  id: string;
  ref: DocumentReference<ProductVariant>;
  order: number;
}

export const variantCollection = (
  productId: string
): CollectionReference<ProductVariant> =>
  collection(doc(productCollection, productId), "variants").withConverter(
    getFirestoreConverter<ProductVariant>()
  );
