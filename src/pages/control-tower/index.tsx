import EqualizerRoundedIcon from "@material-ui/icons/EqualizerRounded";
import InfoIcon from "@material-ui/icons/Info";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { CustomMenu } from "../../components/custom-menu";
import { MenuRoute } from "../layout";
import { Information } from "./information";
import { Statistics } from "./statistics";

export const ControlTower = () => {
  let { path, url } = useRouteMatch();
  const towerControlRoutes = [
    {
      path: "/information",
      labelKey: "information",
      icon: <InfoIcon />,
      component: Information,
    },
    {
      path: "/statistics",
      labelKey: "statistics",
      icon: <EqualizerRoundedIcon />,
      component: Statistics,
    },
  ] as MenuRoute[];

  return (
    <CustomMenu routes={towerControlRoutes} url={url} titleKey="controlTower">
      <Switch>
        {towerControlRoutes.map(route => {
          return <Route key={route.path} path={path + route.path} component={route.component} />;
        })}
      </Switch>
    </CustomMenu>
  );
};
