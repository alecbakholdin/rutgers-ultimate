import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  Query,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import db from "./firestore";

export default class Repository<T> {
  private readonly collection: CollectionReference<T>;

  constructor(path: string) {
    this.collection = collection(db, path) as CollectionReference<T>;
  }

  async get(id: string): Promise<T> {
    const doc = await getDoc(this.docRef(id));
    if (!doc.exists()) {
      throw new Error("Doc does not exist");
    }
    return {
      ...doc.data(),
      id: doc.id,
    };
  }

  async getAll(): Promise<T[]> {
    return this.getDocs(query(this.collection));
  }

  async searchIds(match: string): Promise<T[]> {
    const w1 = where("Document ID", ">=", match);
    const w2 = where("Document ID", "<=", match + "\uf8ff");
    return this.getDocs(query(this.collection, w1, w2));
  }

  async getDocs(q: Query<T>): Promise<T[]> {
    const docs = await getDocs(q);
    const values: T[] = [];
    docs.forEach((doc) => {
      values.push({ id: doc.id, ...doc.data() });
    });
    return values;
  }

  async addWithGeneratedId(doc: T): Promise<DocumentReference<T>> {
    return addDoc(this.collection, { ...doc, id: undefined });
  }

  async addWithCustomId(docId: string, doc: T): Promise<DocumentReference<T>> {
    await setDoc(this.docRef(docId), { ...doc, id: undefined });
    return this.docRef(docId);
  }

  private docRef(id: string): DocumentReference<T> {
    return doc(this.collection, id);
  }
}
