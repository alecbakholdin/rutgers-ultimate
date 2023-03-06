import { createTheme } from "@mui/material";
import { blueGrey, grey, red } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#cc0033",
      ...red,
      contrastText: "#fff",
    },
    secondary: {
      main: "#5F6A72",
      ...grey,
      contrastText: "#fff",
    },
    info: blueGrey,
  },
  typography: {
    body2: {
      fontSize: 14,
    },
  },
});
