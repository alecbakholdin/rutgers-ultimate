import React from "react";
import NavBar from "./NavBar";
import CopyRight from "./CopyRight";

export default function Layut(props: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <>
      <NavBar />
      <main>{props.children}</main>
      <CopyRight />
    </>
  );
}
