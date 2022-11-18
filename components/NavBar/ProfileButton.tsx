import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { usePages } from "hooks/usePages";
import NavBarPageLink from "./NavBarPageLink";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "config/firebaseApp";
import { Link, Stack, Typography } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useCart } from "types/userData";

export default function ProfileButton(): React.ReactElement {
  const [user] = useAuthState(auth);
  const { cart } = useCart();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const { userPages } = usePages();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0, display: user ? "block" : "none" }}>
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <Link href={"/cart"}>
          <Typography color={"primary.contrastText"}>
            <ShoppingCart sx={{ verticalAlign: "middle" }} />
          </Typography>
        </Link>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu}>
            <Avatar
              alt={user?.email ?? undefined}
              /*src={user?.photoURL ?? undefined}
            sx={{ backgroundColor: user?.photoURL && "white" }}*/
            >
              {user?.email?.slice(0, 1).toUpperCase()}
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
        {userPages.map((page) => (
          <MenuItem key={page.name} onClick={handleCloseUserMenu}>
            <NavBarPageLink page={page} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
