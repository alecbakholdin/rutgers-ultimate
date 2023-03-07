import nookies from "nookies";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@firebase/auth";
import { auth } from "config/firebaseApp";
import { FIREBASE_AUTH_COOKIE } from "types/serverAuth";
import { newUserData, UserData, userDataCollection } from "types/userData";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { useRouter } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";

const AuthContext = createContext<{
  user: User | null;
  userData: UserData | null;
  isTeam: boolean;
  loading: boolean;
}>({
  user: null,
  userData: null,
  isTeam: false,
  loading: false,
});

export function AuthProvider({ children }: any) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userData, firestoreLoading] = useDocumentData(
    user?.uid ? doc(userDataCollection, user.uid) : null
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    return auth.onIdTokenChanged(async (authUser) => {
      setLoading(true);
      if (!authUser) {
        setUser(null);
        nookies.set(undefined, FIREBASE_AUTH_COOKIE, "", { path: "/" });
      } else {
        const token = await authUser.getIdToken();
        setUser(authUser);
        const oldToken = nookies.get(undefined)[FIREBASE_AUTH_COOKIE];
        nookies.set(undefined, FIREBASE_AUTH_COOKIE, token, { path: "/" });
        const userDataDoc = doc(userDataCollection, authUser.uid);
        if (!(await getDoc(userDataDoc)))
          await setDoc(userDataDoc, newUserData(authUser.uid));
        if (oldToken && token !== oldToken) {
          router.refresh();
        }
      }
      setLoading(false);
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
    <AuthContext.Provider
      value={{
        user,
        userData: userData || null,
        isTeam,
        loading: loading || firestoreLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
