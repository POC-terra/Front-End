import Build from "@material-ui/icons/Build";
import DomainIcon from "@material-ui/icons/Domain";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import LocalConvenienceStoreIcon from "@material-ui/icons/LocalConvenienceStore";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { CustomMenu } from "../../components/custom-menu";
import { MenuRoute } from "../layout";
import { HotColdStatistics } from "./hot-cold-statistics";
import { Materials } from "./materials";
import { Shops } from "./shops";
import { Thresholds } from "./thresholds";
import { Zones } from "./zones";

export const HotAndColdPieces = () => {
  let { path, url } = useRouteMatch();

  const hotAndColdPiecesRoutes = [
    {
      path: "/thresholds",
      labelKey: "thresholds",
      icon: <Build />,
      component: Thresholds,
    },
    {
      path: "/shops",
      labelKey: "shops",
      icon: <DomainIcon />,
      component: Shops,
    },
    {
      path: "/zones",
      labelKey: "zones",
      icon: <LocalConvenienceStoreIcon />,
      component: Zones,
    },
    {
      path: "/materials",
      labelKey: "references",
      icon: <FindInPageIcon />,
      component: Materials,
    },
    {
      path: "/statistics",
      labelKey: "statistics",
      icon: <EqualizerIcon />,
      component: HotColdStatistics,
    },
  ] as MenuRoute[];

  return (
    <CustomMenu routes={hotAndColdPiecesRoutes} url={url} titleKey="hotAndColdPieces">
      <Switch>
        {hotAndColdPiecesRoutes.map(route => {
          return <Route key={route.path} path={path + route.path} component={route.component} />;
        })}
      </Switch>
    </CustomMenu>
  );
};
