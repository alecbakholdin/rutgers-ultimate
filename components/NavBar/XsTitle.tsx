import React from "react";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function XsTitle(): React.ReactElement {
  return (
    <Link href={"/"} passHref>
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
    </Link>
  );
}
