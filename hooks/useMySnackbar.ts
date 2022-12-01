import { useSnackbar, VariantType } from "notistack";

export function useMySnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const showAutoHide =
    (variant: VariantType) =>
    (message: string, autoHideDuration: number = 1000) =>
      enqueueSnackbar(message, { variant, autoHideDuration });
  return {
    enqueueSnackbar,
    closeSnackbar,
    showError: showAutoHide("error"),
    showInfo: showAutoHide("info"),
    showSuccess: showAutoHide("success"),
  };
}
