"use client";

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useAuth } from "components/AuthProvider";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NavBarPageLink, { NavAction } from "app/NavBarPageLink";
import Box from "@mui/material/Box";
import { signOut } from "@firebase/auth";
import { auth } from "config/firebaseApp";
import Button from "@mui/material/Button";
import ProfileButton from "app/ProfileButton";

export default function DesktopNavBar(): React.ReactElement {
  const { user, userData } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const pages: NavAction[] = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Store",
      href: "/",
    },
  ];

  const userActions: NavAction[] = [
    ...(user
      ? [
          { name: "Sign Out", onClick: () => signOut(auth) },
          { name: "My Orders", href: "/orders" },
        ]
      : []),
    ...(userData?.isAdmin
      ? [
          { name: "Manage Store", href: "/admin/store" },
          { name: "All Orders", href: "/admin/orders" },
        ]
      : []),
  ];

  return (
    <AppBar position={"static"}>
      <Container maxWidth={"xl"}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MACHINE
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <NavBarPageLink page={page} />
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MACHINE
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <NavBarPageLink page={page} />
              </Button>
            ))}
          </Box>
          <ProfileButton userActions={userActions} user={user} />
          <Box sx={{ display: user ? "none" : "block" }}>
            <NavBarPageLink
              page={{
                name: "Sign In",
              }}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
