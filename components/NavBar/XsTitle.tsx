import React from "react";
import Typography from "@mui/material/Typography";

export default function XsTitle(): React.ReactElement {
  return (
    <>
      <Typography
        variant="h5"
        noWrap
        component="a"
        href=""
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
    </>
  );
}
