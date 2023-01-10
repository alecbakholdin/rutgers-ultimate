import {
  collection,
  CollectionReference,
  DocumentReference,
} from "@firebase/firestore";
import { firestore } from "../config/firebaseApp";
import { getFirestoreConverter } from "../config/firestoreConverter";

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
