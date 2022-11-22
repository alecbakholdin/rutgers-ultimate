import React from "react";
import { Page } from "hooks/usePages";
import { Typography } from "@mui/material";

export default function NavBarPageLink({
  page,
}: {
  page: Page;
}): React.ReactElement {
  return (
    <a href={page.href} onClick={page.onClick}>
      <Typography textAlign={"center"}>{page.name}</Typography>
    </a>
  );
}
