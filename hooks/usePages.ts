import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "config/firebaseApp";
import { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "@firebase/firestore";
import { userDataCollection } from "types/userData";

export interface Page {
  name: string;
  href?: string;
  onClick?: () => void;
}

export function usePages() {
  const defaultMainPages: Page[] = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Store",
      href: "/store",
    },
  ];
  const defaultUserPages: Page[] = [
    {
      name: "Sign Out",
      onClick: () => signOut(),
    },
    {
      name: "My Orders",
      href: "/orders",
    },
  ];

  const [signOut] = useSignOut(auth);
  const [user, loading] = useAuthState(auth);
  const [userData] = useDocumentData(
    user?.uid ? doc(userDataCollection, user?.uid) : null
  );
  const [mainPages, setMainPages] = useState<Page[]>(defaultMainPages);
  const [userPages, setUserPages] = useState<Page[]>(defaultUserPages);

  useEffect(() => {
    const newMainPages: Page[] = [...defaultMainPages];
    const newUserPages: Page[] = [...defaultUserPages];
    if (userData?.isAdmin) {
      newUserPages.push({
        name: "Manage Store",
        href: "/admin/store",
      });
      newUserPages.push({
        name: "Manage All Orders",
        href: "/admin/orders",
      });
    }
    setMainPages(newMainPages);
    setUserPages(newUserPages);
  }, [user, loading, userData]);

  return { mainPages, userPages };
}
