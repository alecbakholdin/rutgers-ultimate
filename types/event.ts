import {
  collection,
  CollectionReference,
  DocumentReference,
  FirestoreError,
  query,
  where,
} from "@firebase/firestore";
import { firestore } from "../config/firebaseApp";
import { getFirestoreConverter } from "../config/firestoreConverter";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { useMemo } from "react";

export interface Event {
  id: string;
  ref: DocumentReference<Event>;

  name: string;
  endDate: Date;
  productIds: string[];
}

export const eventCollection: CollectionReference<Event> = collection(
  firestore,
  "events"
).withConverter(getFirestoreConverter<Event>());

export function useActiveEventsOnce(): [
  Event[],
  boolean,
  FirestoreError | undefined
] {
  const q = useMemo(
    () => query(eventCollection, where("endDate", ">", new Date())),
    []
  );
  const [events, loading, error] = useCollectionDataOnce(q);
  return [events || [], loading, error];
}
