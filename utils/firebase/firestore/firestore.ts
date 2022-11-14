// Initialize Firebase
import { getFirestore } from "@firebase/firestore";
import app from "../app";
import Repository from "./repository";

const db = getFirestore(app);
console.log(db);

const firestore = {
  products: new Repository<any>(db, "products"),
};
export default firestore;

firestore.products.get("ACZJ3ri0pkag09szXKvg").then((doc) => {
  console.log(doc);
  console.log(doc.get("Name"));
});
