import React from "react";
import NavBar from "./NavBar";

export default function Layout(props: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <>
      <NavBar />
      <main>{props.children}</main>
    </>
  );
}
