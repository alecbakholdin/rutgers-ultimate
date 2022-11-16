import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { User, userRepo } from "types/user";

function useDbUser(): {
  user: User | null;
  updateUser: (update: Partial<User>) => Promise<void> | void;
} {
  const { user: authUser, loading } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!loading && authUser) {
      userRepo
        .get(authUser.uid)
        .then((dbUser) => setUser({ ...authUser, ...dbUser }));
    } else if (!loading && !authUser) {
      setUser(null);
    }
  }, [authUser, loading]);

  const updateUser = async (update: Partial<User>): Promise<void> => {};

  return {
    user,
    updateUser,
  };
}
