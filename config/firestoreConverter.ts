import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "@firebase/firestore";

export function getFirestoreConverter<
  T extends { id: string; ref?: DocumentReference<T> }
>(): FirestoreDataConverter<T> {
  return {
    toFirestore(modelObject: WithFieldValue<T>): DocumentData {
      const { id, ref, ...object } = modelObject;
      return {
        ...object,
      };
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
