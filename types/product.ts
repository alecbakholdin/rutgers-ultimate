import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  FirestoreError,
  query,
  where,
} from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

export interface Color {
  name: string;
  hex?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  teamPrice: number;
  image?: string;
  canHaveName: boolean;
  canHaveNumber: boolean;
  colors: Color[];
  sizes: string[];
  ref: DocumentReference<Product>;
}

export const productCollection: CollectionReference<Product> = collection(
  firestore,
  "products"
).withConverter(getFirestoreConverter<Product>());

export function useProductData(
  productIds?: string[]
): [Product[], boolean, FirestoreError | undefined] {
  productIds = productIds ?? [];
  const q =
    productIds.length > 0
      ? query(productCollection, where("__name__", "in", productIds))
      : undefined;
  const [products, loading, error] = useCollectionData(q, { initialValue: [] });
  return [products!, loading, error];
}

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
