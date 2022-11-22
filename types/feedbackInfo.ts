import { collection, DocumentReference } from "@firebase/firestore";
import { firestore } from "config/firebaseApp";
import { getFirestoreConverter } from "config/firestoreConverter";

export interface FeedbackInfo {
  id: string;
  ref: DocumentReference<FeedbackInfo>;
  name?: string;
  content: string;
}

export const feedbackCollection = collection(
  firestore,
  "feedback"
).withConverter(getFirestoreConverter<FeedbackInfo>());
