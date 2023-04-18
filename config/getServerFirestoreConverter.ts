import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "@google-cloud/firestore";

function formatObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.filter((val) => val !== undefined).map(formatObject);
  } else if (
    typeof obj === "object" &&
    !(obj instanceof Date) &&
    obj !== null
  ) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, formatObject(value)])
    );
  }
  return obj;
}

export function getServerFirestoreConverter<T>(): FirestoreDataConverter<
  Omit<T, "ref">
> {
  return {
    toFirestore(
      modelObject: FirebaseFirestore.WithFieldValue<Omit<T, "ref">>
    ): DocumentData {
      return formatObject(modelObject);
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): Omit<T, "ref"> {
      return {
        ...Object.fromEntries(
          Object.entries(snapshot.data() as any)
            .filter(([key]) => key !== "ref")
            .map(([key, value]) =>
              value && Object.hasOwn(value, "_seconds")
                ? [key, { seconds: (value as any)._seconds }]
                : [key, value]
            )
        ),
        id: snapshot.id,
      } as T;
    },
  };
}
