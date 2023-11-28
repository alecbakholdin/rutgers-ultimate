"use client";

import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useAuth } from "appComponents/AuthProvider";
import Typography from "@mui/material/Typography";
import { Container, Link, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NavBarPageLink, { NavAction } from "app/(RegularApp)/NavBarPageLink";
import Box from "@mui/material/Box";
import { signOut } from "@firebase/auth";
import { auth } from "config/firebaseApp";
import Button from "@mui/material/Button";
import { usePathname } from "next/navigation";
import { DecodedIdToken } from "firebase-admin/lib/auth";
import { ShoppingCart } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";

function useUserEmail(initialEmail: string | undefined): string | undefined {
  const { user } = useAuth();
  const [email, setEmail] = useState(initialEmail);

  useEffect(() => {
    setEmail(user?.email || undefined);
  }, [user?.email]);

  return email;
}

export default function DesktopNavBar({
  existingUser,
}: {
  existingUser: DecodedIdToken | undefined;
}): React.ReactElement {
  const { userData } = useAuth();
  const email = useUserEmail(existingUser?.email);
  const path = usePathname();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const pages: NavAction[] = [
    {
      name: "Store",
      href: "/store",
    },
  ];

  const userActions: NavAction[] = [
    ...(email
      ? [
          { name: "Sign Out", onClick: () => signOut(auth) },
          { name: "My Orders", href: "/orders" },
        ]
      : []),
    ...(userData?.isAdmin ? [{ name: "Admin", href: "/admin" }] : []),
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
          <Box sx={{ flexGrow: 0, display: email ? "block" : "none" }}>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Link href={"/cart"}>
                <Typography color={"primary.contrastText"}>
                  <ShoppingCart sx={{ verticalAlign: "middle" }} />
                </Typography>
              </Link>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu}>
                  <Avatar
                    alt={email ?? undefined}
                    /*src={user?.photoURL ?? undefined}
                  sx={{ backgroundColor: user?.photoURL && "white" }}*/
                  >
                    {email?.slice(0, 1).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Stack>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userActions.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseUserMenu}>
                  <NavBarPageLink page={page} />
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: email ? "none" : "block" }}>
            <NavBarPageLink
              page={{
                name: "Sign In",
                href: "/signIn" + (path !== "signIn" && "?redirect=" + path),
              }}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
