import React from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function XsPages(props: {
  pages: string[];
  anchorElNav: HTMLElement | null;
  handleOpenNavMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseNavMenu: () => void;
}): React.ReactElement {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={props.handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={props.anchorElNav}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(props.anchorElNav)}
        onClose={props.handleCloseNavMenu}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        {props.pages.map((page) => (
          <MenuItem key={page} onClick={props.handleCloseNavMenu}>
            <Typography textAlign="center">{page}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
