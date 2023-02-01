import { useSnackbar, VariantType } from "notistack";

export function useMySnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const showAutoHide =
    (variant: VariantType) =>
    (message: string, autoHideDuration: number = 1500) =>
      enqueueSnackbar(message, { variant, autoHideDuration });

  const handleError = (e: any) => {
    if (e instanceof Error) {
      console.error(e);
      showAutoHide("error")(e.message);
    }
  };
  const executeAndCatchErrors = (fn: () => void) => {
    try {
      fn();
    } catch (e) {
      handleError(e);
    }
  };
  const executeAndCatchErrorsAsync = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (e) {
      handleError(e);
    }
  };
  return {
    enqueueSnackbar,
    closeSnackbar,
    showError: showAutoHide("error"),
    showInfo: showAutoHide("info"),
    showSuccess: showAutoHide("success"),
    executeAndCatchErrors,
    executeAndCatchErrorsAsync,
  };
}
