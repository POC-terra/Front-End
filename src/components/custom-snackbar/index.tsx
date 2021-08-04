import CloseIcon from "@material-ui/icons/Close";
import { SnackbarProvider, WithSnackbarProps } from "notistack";
import React, { useRef } from "react";
import { MAX_NOTIFICATIONS } from "../../utils/constants";
import "./index.scss";

export const CustomSnackBarProvider: React.FC = props => {
  // add action to all snackbars
  const notistackRef = useRef<WithSnackbarProps>();
  const onClickDismiss = (key: React.ReactText) => () => {
    notistackRef?.current?.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={MAX_NOTIFICATIONS}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      action={key => (
        <span>
          <CloseIcon onClick={onClickDismiss(key)} className="closeIcon" />
        </span>
      )}
    >
      {props.children}
    </SnackbarProvider>
  );
};
