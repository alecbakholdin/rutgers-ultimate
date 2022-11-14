import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  getDoc,
} from "@firebase/firestore";

export default class Repository<T> {
  private readonly collection: CollectionReference<T>;

  constructor(firestore: Firestore, path: string) {
    this.collection = collection(firestore, path) as CollectionReference<T>;
  }

  async get(id: string): Promise<DocumentSnapshot<T>> {
    return getDoc(this.docRef(id));
  }

  private docRef(id: string): DocumentReference<T> {
    return doc(this.collection, id);
  }
}
