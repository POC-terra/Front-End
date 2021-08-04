import { CircularProgress, ThemeProvider } from "@material-ui/core";
import React from "react";
import { IntlProvider } from "react-intl";
import { Route, Switch } from "react-router-dom";
import { CustomRestfulProvider } from "../../components/custom-restful-provider";
import { useLocale } from "../../hooks/locale-hook";
import { useUserTheme } from "../../hooks/theme-hook";
import { useTranslations } from "../../hooks/translations-hook";
import { ControlTower } from "../control-tower";
import { Home } from "../home";
import { HotAndColdPieces } from "../hot-and-cold-pieces";
import "./layout.scss";

export interface MenuRoute {
  path: string;
  labelKey: string;
  icon: JSX.Element;
  component: React.FC;
}

export const Layout = () => {
  const theme = useUserTheme();
  const translations = useTranslations();
  const { locale } = useLocale();

  return translations ? (
    <IntlProvider locale={locale} messages={translations}>
      <CustomRestfulProvider base={window._env_.API_BASE_URL}>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/controlTower" component={ControlTower} />
            <Route path="/hotAndColdPieces" component={HotAndColdPieces} />
          </Switch>
        </ThemeProvider>
      </CustomRestfulProvider>
    </IntlProvider>
  ) : (
    <CircularProgress />
  );
};
