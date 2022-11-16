import {
  collection,
  CollectionReference,
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
