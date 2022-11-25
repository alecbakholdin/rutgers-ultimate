import { useSnackbar } from "notistack";

export function useMySnackbar() {
  const autoHideDuration = 1000;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const showError = (message: string) =>
    enqueueSnackbar(message, { variant: "error", autoHideDuration });
  return { enqueueSnackbar, closeSnackbar, showError };
}
