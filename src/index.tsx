import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { CustomSnackBarProvider } from "./components/custom-snackbar";
import { WindowData } from "./domain/window-data";
import "./index.scss";
import * as serviceWorker from "./serviceWorker";

declare global {
  interface Window {
    _env_: WindowData;
  }
}

ReactDOM.render(
  <CustomSnackBarProvider>
    <App />
  </CustomSnackBarProvider>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
