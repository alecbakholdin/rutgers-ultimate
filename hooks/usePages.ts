import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../app/firebaseApp";
import { useEffect, useState } from "react";

export interface Page {
  name: string;
  href?: string;
  onClick?: () => void;
}

export function usePages() {
  const [signOut] = useSignOut(auth);
  const defaultMainPages: Page[] = [
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
  ];

  const [mainPages, setMainPages] = useState<Page[]>(defaultMainPages);
  const [userPages, setUserPages] = useState<Page[]>(defaultUserPages);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const newMainPages: Page[] = [...defaultMainPages];
    const newUserPages: Page[] = [...defaultUserPages];
    setMainPages(newMainPages);
    setUserPages(newUserPages);
  }, [user, loading]);

  return { mainPages, userPages };
}
