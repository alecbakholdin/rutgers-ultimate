import Repository from "../utils/firebase/firestore/repository";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export const userRepo = new Repository<User>("users");
