import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { usePages } from "hooks/usePages";
import NavBarPageLink from "./NavBarPageLink";

export default function MdPages(props: {
  handleCloseNavMenu: () => void;
}): React.ReactElement {
  const { mainPages } = usePages();
  return (
    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
      {mainPages.map((page) => (
        <Button
          key={page.name}
          onClick={props.handleCloseNavMenu}
          sx={{ my: 2, color: "white", display: "block" }}
        >
          <NavBarPageLink page={page} />
        </Button>
      ))}
    </Box>
  );
}
