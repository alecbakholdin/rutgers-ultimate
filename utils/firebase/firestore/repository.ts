import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
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
    const q = query(this.collection);
    const docs = await getDocs(q);
    const products: T[] = [];
    docs.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
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
