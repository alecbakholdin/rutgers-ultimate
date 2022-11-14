import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import MdTitle from "./MdTitle";
import XsTitle from "./XsTitle";
import XsPages from "./XsPages";
import MdPages from "./MdPages";
import ProfileButton from "./ProfileButton";

const pages = ["Products", "Events"];

export default function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const navMenuProps = {
    anchorElNav,
    handleOpenNavMenu,
    handleCloseNavMenu,
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <MdTitle />
          <XsPages pages={pages} {...navMenuProps} />
          <XsTitle />
          <MdPages pages={pages} {...navMenuProps} />
          <ProfileButton />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
