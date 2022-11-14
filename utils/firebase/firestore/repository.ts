import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  getDoc,
  setDoc,
} from "@firebase/firestore";

export default class Repository<T> {
  private readonly collection: CollectionReference<T>;

  constructor(firestore: Firestore, path: string) {
    this.collection = collection(firestore, path) as CollectionReference<T>;
  }

  async get(id: string): Promise<DocumentSnapshot<T>> {
    return getDoc(this.docRef(id));
  }

  async addWithGeneratedId(doc: T): Promise<DocumentReference<T>> {
    return addDoc(this.collection, doc);
  }

  async addWithCustomId(docId: string, doc: T): Promise<void> {
    return setDoc(this.docRef(docId), doc);
  }

  private docRef(id: string): DocumentReference<T> {
    return doc(this.collection, id);
  }
}
