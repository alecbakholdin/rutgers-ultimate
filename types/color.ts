import { collection, DocumentReference } from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";
import { useCollectionData } from "react-firebase-hooks/firestore";

export interface Color {
  id: string;
  hex: string;
  ref: DocumentReference<Color>;
}

export const colorCollection = collection(
  firestore,
  "colors"
).withConverter<Color>(getFirestoreConverter());

export function useColors() {
  const [colors, loading, errors] = useCollectionData(colorCollection, {
    initialValue: [],
  });
  const colorMap: { [name: string]: string } = Object.fromEntries(
    colors!.map((color) => [color.id, color.hex])
  );
  return {
    colors: colors!,
    loading,
    errors,
    colorMap,
  };
}
