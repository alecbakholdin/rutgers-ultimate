import { useSnackbar, VariantType } from "notistack";

export function useMySnackbar() {
  const autoHideDuration = 1000;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const showAutoHide = (variant: VariantType) => (message: string) =>
    enqueueSnackbar(message, { variant, autoHideDuration });
  return {
    enqueueSnackbar,
    closeSnackbar,
    showError: showAutoHide("error"),
    showInfo: showAutoHide("info"),
  };
}
