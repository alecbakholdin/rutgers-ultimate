import { createTheme } from "@mui/material";
import { blueGrey, grey, red } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      ...red,
      contrastText: "white",
    },
    secondary: grey,
    info: blueGrey,
  },
  typography: {
    body2: {
      fontSize: 14,
    },
  },
});
