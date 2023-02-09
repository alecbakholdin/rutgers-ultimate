import nookies from "nookies";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@firebase/auth";
import { auth } from "config/firebaseApp";
import { FIREBASE_AUTH_COOKIE } from "types/serverAuth";
import { UserData, userDataCollection } from "types/userData";
import { doc, getDoc, setDoc } from "@firebase/firestore";

const AuthContext = createContext<{
  user: User | null;
  userData: UserData | null;
  isTeam: boolean;
}>({
  user: null,
  userData: null,
  isTeam: false,
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        setUserData(null);
        nookies.set(undefined, FIREBASE_AUTH_COOKIE, "", { path: "/" });
      } else {
        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, FIREBASE_AUTH_COOKIE, token, { path: "/" });
        const userDataDoc = doc(userDataCollection, user.uid);
        const userData =
          (await getDoc(userDataDoc)) ??
          (await setDoc(userDataDoc, {
            id: user.uid,
            isAdmin: false,
            cartItems: [],
          }));
        setUserData(userData.data() || null);
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  const isTeam = Boolean(
    user?.email?.endsWith("rutgers.edu") || userData?.isTeam
  );
  return (
    <AuthContext.Provider value={{ user, userData, isTeam }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
