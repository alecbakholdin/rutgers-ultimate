import React from "react";
import NavBar from "./NavBar";

export default function Layut(props: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <>
      <NavBar />
      <main>{props.children}</main>
    </>
  );
}
