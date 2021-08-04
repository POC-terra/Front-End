import { createMuiTheme, Theme } from "@material-ui/core";
import { useMemo } from "react";
import { themeColor } from "../utils/color";

export const useUserTheme = (): Theme => {
  const color = themeColor;
  return useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: "light",
          primary: color.primary,
          secondary: color.secondary,
          success: color.success,
          error: color.error,
        },
        overrides: {
          MuiDrawer: {
            paper: {
              "& .MuiListItem-root": {
                color: color.primary.main,
              },
              "& .MuiIconButton-root": {
                color: color.primary.main,
              },
            },
          },
          MuiTableSortLabel: {
            icon: {
              color: color.primary.light + "!important",
            },
          },
          MuiInput: {
            colorSecondary: {
              color: color.secondary.light,
              "&:before": {
                borderBottom: "1px solid " + color.secondary.light + "!important",
              },
            },
          },
        },
      }),
    [color],
  );
};
