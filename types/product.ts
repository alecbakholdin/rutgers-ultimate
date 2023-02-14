import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  FirestoreError,
  getDoc,
  query,
  where,
} from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";

export interface ProductColor {
  name: string;
  hex?: string;
  images?: string[];
}

export interface ProductImage {
  storagePath: string;
  colorNames: string[];
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
  colors: ProductColor[];
  productImages: ProductImage[];
  colorMap: { [colorId: string]: ProductColor };
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

/**
 * Should only be called once all productIds are known
 * @param productIds
 */
export function useProductDataOnce(productIds: string[]): Product[] {
  const [products, setProducts] = useState<Product[]>([]);
  const updateProducts = async () => {
    const newProducts: Product[] = [];
    for (const productId of productIds) {
      const docRef = await getDoc(doc(productCollection, productId));
      const data = docRef.data();
      if (data) {
        newProducts.push(data);
      }
    }
    setProducts(newProducts);
  };
  useEffect(() => {
    updateProducts().catch(console.error);
  }, []);
  return products;
}
