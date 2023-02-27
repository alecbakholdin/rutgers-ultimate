import { ReactNode } from "react";
import { Box, useTheme } from "@mui/material";

export default function FieldSection({ children }: { children: ReactNode }) {
  const { shape } = useTheme();

  return (
    <Box
      border={"1px solid rgba(0, 0, 0, 0.23)"}
      borderRadius={shape.borderRadius + "px"}
      padding={"16.5px 14px"}
    >
      {children}
    </Box>
  );
}
