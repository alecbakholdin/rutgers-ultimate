import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  getUserFromCookie,
  removeUserCookie,
  setUserCookie,
} from "./userCookie";
import { User as FirebaseUser } from "@firebase/auth";
import { auth } from "utils/firebase.config";
import { User } from "types/user";

export const mapUserData = async (user: FirebaseUser): Promise<User> => {
  const { uid, email } = user;
  const token = await user.getIdToken(true);
  return {
    id: uid,
    email,
    token,
    verified: user.emailVerified,
  };
};

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const logout = async () => {
    return auth
      .signOut()
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    const cancelAuthListener = auth.onIdTokenChanged(async (userToken) => {
      if (userToken) {
        const userData = await mapUserData(userToken);
        setUserCookie(userData);
        setUser(userData);
      } else {
        removeUserCookie();
        setUser(null);
      }
    });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      return;
    }
    setUser(userFromCookie);
    return cancelAuthListener;
  }, []);

  return { user, logout };
};

export { useUser };
