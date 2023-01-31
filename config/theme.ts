import { createTheme } from "@mui/material";
import { blueGrey, grey, red } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#cc0033",
      ...red,
      contrastText: "white",
    },
    secondary: {
      main: "#5F6A72",
      ...grey,
      contrastText: "white",
    },
    info: blueGrey,
  },
  typography: {
    body2: {
      fontSize: 14,
    },
  },
});
