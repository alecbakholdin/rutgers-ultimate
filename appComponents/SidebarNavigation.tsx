"use client";

import { Box, Stack, SxProps, Typography, useTheme } from "@mui/material";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const selectedStyle: SxProps = {
    borderColor: palette.secondary.main,
  };

  return (
    <Stack spacing={3} width={"100%"}>
      <Typography variant={"h4"}>{title}</Typography>
      <Stack direction={"row"} spacing={2} width={"100%"}>
        <Stack spacing={1}>
          {pages?.map((page, i) => (
            <Link key={i} href={page.href}>
              <Box
                width={200}
                borderRadius={1}
                paddingLeft={2}
                paddingTop={0.5}
                paddingBottom={0.5}
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
            </Link>
          ))}
        </Stack>
        <Box flexGrow={1}>{children}</Box>
      </Stack>
    </Stack>
  );
}
