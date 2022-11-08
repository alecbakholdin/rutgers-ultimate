// Initialize Firebase
import {collection, getFirestore} from "@firebase/firestore";
import app from './app';

const db = getFirestore(app);

export default {
  products: collection(db, 'products')
}
