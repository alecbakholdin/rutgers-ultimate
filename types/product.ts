import {
  collection,
  CollectionReference,
  DocumentReference,
  FirestoreError,
  query,
  where,
} from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { useCollectionData } from "react-firebase-hooks/firestore";

export interface ProductColor {
  name: string;
  hex?: string;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  teamPrice: number;
  images?: string[];
  canHaveName: boolean;
  canHaveNumber: boolean;
  colors: ProductColor[];
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
