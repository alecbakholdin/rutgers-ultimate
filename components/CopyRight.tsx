import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import React from "react";

export default function CopyRight(): React.ReactElement {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 5 }}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Machine Ultimate
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
