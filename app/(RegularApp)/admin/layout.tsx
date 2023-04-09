import React, { ReactNode } from "react";
import { getUserData } from "util/server";
import { cookies } from "next/headers";
import { FIREBASE_AUTH_COOKIE } from "types/serverAuth";
import { notFound } from "next/navigation";
import SidebarNavigation from "appComponents/SidebarNavigation";

export default async function ({ children }: { children: ReactNode }) {
  const user = await getUserData(cookies().get(FIREBASE_AUTH_COOKIE)?.value);
  if (!user?.isAdmin) notFound();

  return (
    <SidebarNavigation
      title={"Admin"}
      pages={[
        { name: "Products", href: "/admin/products" },
        { name: "Events", href: "/admin/events" },
      ]}
    >
      {children}
    </SidebarNavigation>
  );
}
