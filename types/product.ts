import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

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

export function useVariantCollection(product: Product) {
  return useMemo(() => {
    return variantCollection(product.id);
  }, [product.id]);
}

export function useVariants(product: Product) {
  const variantQuery = useVariantCollection(product);
  return useCollectionData(variantQuery);
}
