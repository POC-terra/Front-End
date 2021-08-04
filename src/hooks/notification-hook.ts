import { useSnackbar, VariantType } from "notistack";

interface NotificationValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

export const useNotification = (): NotificationValue => {
  const { enqueueSnackbar } = useSnackbar();

  const _showNotification = (message: string | JSX.Element, variant: VariantType) => {
    enqueueSnackbar(message, { variant });
  };

  const showSuccess = (message: string) => {
    return _showNotification(message, "success");
  };

  const showError = (message: string) => {
    return _showNotification(message, "error");
  };

  const showInfo = (message: string) => {
    return _showNotification(message, "info");
  };

  const showWarning = (message: string) => {
    return _showNotification(message, "warning");
  };

  return { showSuccess, showError, showInfo, showWarning };
};
