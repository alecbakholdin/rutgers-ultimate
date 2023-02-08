import React from "react";
import { Typography } from "@mui/material";

export type NavAction = {
  name: string;
  href?: string;
  action?: () => void | Promise<void>;
};

export default function NavBarPageLink({
  page,
}: {
  page: NavAction;
}): React.ReactElement {
  return (
    <a href={page.href} onClick={page.onClick}>
      <Typography textAlign={"center"}>{page.name}</Typography>
    </a>
  );
}
