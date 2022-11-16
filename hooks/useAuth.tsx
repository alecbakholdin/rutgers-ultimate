import React, { useContext, useEffect, useState } from "react";
import auth from "utils/firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User as FirebaseUser,
  UserCredential,
} from "@firebase/auth";

interface AuthUser {
  uid: string;
  email: string;
  verified: boolean;
}

interface AuthContextInterface {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => void;
}

const formatAuthUser = (user: FirebaseUser): AuthUser => ({
  uid: user.uid,
  email: user.email!,
  verified: user.emailVerified,
});

const signIn = (email: string, password: string): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, email, password);
const signUp = (email: string, password: string): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password);

function useFirebaseAuth(): AuthContextInterface {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = () => auth.signOut();

  const authStateChanged = async (authState: FirebaseUser | null) => {
    if (!authState) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const formattedUser = formatAuthUser(authState);
    setUser(formattedUser);
    setLoading(false);
  };

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}

const AuthContext = React.createContext<AuthContextInterface>({
  user: null,
  loading: false,
  signIn,
  signUp,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextInterface {
  return useContext(AuthContext);
}
