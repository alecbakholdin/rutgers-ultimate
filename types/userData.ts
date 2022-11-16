import { collection } from "@firebase/firestore";
import { firestore } from "../app/firebaseApp";
import { getFirestoreConverter } from "../config/firestoreConverter";

export interface UserData {
  id: string;
  isAdmin: true;
}

export const userDataCollection = collection(
  firestore,
  "userData"
).withConverter(getFirestoreConverter<UserData>());
