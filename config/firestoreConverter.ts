import {
  DocumentData,
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
  T extends { id: string }
>(): FirestoreDataConverter<T> {
  return {
    toFirestore(modelObject: WithFieldValue<T>): DocumentData {
      const { id, ...object } = modelObject;
      if ((object as any)["ref"]) {
        delete (object as any)["ref"];
      }
      return formatObject(object);
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot<T>,
      options?: SnapshotOptions
    ): T {
      const data = Object.fromEntries(
        Object.entries(snapshot.data(options) as any).map(([key, value]) => {
          return [
            key,
            Object.hasOwn(value as any, "seconds")
              ? new Date((value as { seconds: number }).seconds * 1000)
              : value,
          ];
        })
      );
      return {
        ...(data as any),
        id: snapshot.id,
        ref: snapshot.ref,
      };
    },
  };
}
