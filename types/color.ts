import { collection, DocumentReference } from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";

export interface Color {
  id: string;
  hex: string;
  ref: DocumentReference<Color>;
}

export const colorCollection = collection(
  firestore,
  "colors"
).withConverter<Color>(getFirestoreConverter());
