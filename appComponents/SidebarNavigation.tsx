"use client";

import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu as MenuIcon } from "@mui/icons-material";

export type SidebarPageDefinition = {
  href: string;
  name: string;
};
export default function SidebarNavigation({
  title,
  pages,
  children,
}: {
  title?: string;
  pages?: SidebarPageDefinition[];
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const { palette } = useTheme();
  const baseStyle: SxProps = {
    border: "1px solid transparent",
    color: palette.secondary.main,
  };
  const selectedStyle: SxProps = {};

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Stack spacing={3} width={"100%"}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography variant={"h4"}>{title}</Typography>
        <IconButton sx={{ display: { md: "none" } }} onClick={handleOpenMenu}>
          <MenuIcon />
        </IconButton>
        <Menu
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {pages?.map((page, i) => (
            <MenuItem key={i} onClick={handleCloseMenu}>
              <Link href={page.href}>
                <Typography variant={"body2"}>{page.name}</Typography>
              </Link>
            </MenuItem>
          ))}
        </Menu>
      </Stack>
      <Stack direction={"row"} spacing={2} width={"100%"}>
        <Stack
          spacing={1}
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
          }}
        >
          {pages?.map((page, i) => (
            <Link key={i} href={page.href}>
              <Stack direction={"row"} alignItems={"center"}>
                {pathname === page.href && <ChevronRight color={"secondary"} />}
                <Box
                  width={200}
                  borderRadius={1}
                  paddingLeft={pathname === page.href ? 0 : 1}
                  sx={[
                    {
                      ...baseStyle,
                      "&:hover": selectedStyle,
                    },
                    pathname === page.href && selectedStyle,
                  ]}
                >
                  <Typography variant={"h6"}>{page.name}</Typography>
                </Box>
              </Stack>
            </Link>
          ))}
        </Stack>
        <Box flexGrow={1}>{children}</Box>
      </Stack>
    </Stack>
  );
}
