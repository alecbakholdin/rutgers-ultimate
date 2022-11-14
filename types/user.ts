import Repository from "../utils/firebase/firestore/repository";
import db from "../utils/firebase/firestore/firestore";

export interface User {
  firstName: string;
  lastName: string;
}

export const userRepo = new Repository<User>(db, "users");
