import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "@firebase/firestore";

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

export function getFirestoreConverter<
  T extends { id: string; ref?: DocumentReference<T> }
>(): FirestoreDataConverter<T> {
  return {
    toFirestore(modelObject: WithFieldValue<T>): DocumentData {
      const { id, ref, ...object } = modelObject;
      const obj = formatObject(object);
      console.log(obj);
      return obj;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot<T>,
      options?: SnapshotOptions
    ): T {
      return {
        ...snapshot.data(options),
        id: snapshot.id,
        ref: snapshot.ref,
      };
    },
  };
}
