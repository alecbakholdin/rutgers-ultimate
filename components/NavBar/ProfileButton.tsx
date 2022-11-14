import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";

export default function ProfileButton(): React.ReactElement {
  const { user, signOut } = useAuth();
  const loggedIn = Boolean(user);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const actions = [
    {
      name: "Sign Out",
      action: signOut,
    },
  ];

  return (
    <Box sx={{ flexGrow: 0 }}>
      {loggedIn && user ? (
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar />
          </IconButton>
        </Tooltip>
      ) : (
        <Link href={"/signIn"}>
          <Typography>SIGN IN</Typography>
        </Link>
      )}

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
        {actions.map(({ name, action }) => (
          <MenuItem
            key={name}
            onClick={() => {
              handleCloseUserMenu();
              action();
            }}
          >
            <Typography textAlign="center">{name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
