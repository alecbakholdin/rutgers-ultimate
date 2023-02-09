import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "@google-cloud/firestore";

function formatObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.filter((val) => val !== undefined).map(formatObject);
  } else if (typeof obj === "object" && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, formatObject(value)])
    );
  }
  return obj;
}

export function getServerFirestoreConverter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore(
      modelObject: FirebaseFirestore.WithFieldValue<T>
    ): DocumentData {
      const { id, ref, ...object } = modelObject as any;
      return formatObject(object);
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return Object.fromEntries(
        Object.entries(snapshot.data() as any).filter(([key]) => key !== "ref")
      ) as T;
    },
  };
}
