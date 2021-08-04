import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React, { ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { useUserTheme } from "../../hooks/theme-hook";
import { MenuRoute } from "../../pages/layout";
import { CustomLink } from "../custom-link";
import { LanguageMenu } from "../language-menu";
import "./custom-menu.scss";
import { useStyles } from "./index.styles";

interface CustomMenuProps {
  routes: MenuRoute[];
  url: string;
  children: ReactNode;
  titleKey: string;
}

export const CustomMenu = (props: CustomMenuProps) => {
  const [open, setOpen] = useState(false);
  const theme = useUserTheme();
  const classes = useStyles(theme);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} noWrap>
            <CustomLink to="/">
              <FormattedMessage id={props.titleKey} />
            </CustomLink>
          </Typography>
          <LanguageMenu textClass={classes.headerButton} />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {/* MENU ITEMS */}
        <List>
          {/* Back to home button */}
          <ListItem button className={classes.listItem} component={Link} to={"/"}>
            <IconButton className={"drawer-icons"}>{<HomeRoundedIcon />}</IconButton>
            <ListItemText classes={{ primary: classes.listItemText }} primary={<FormattedMessage id={"home"} />} />
          </ListItem>
          {props.routes.map(route => {
            return (
              <ListItem
                button
                className={classes.listItem}
                key={route.labelKey}
                component={Link}
                to={props.url + route.path}
              >
                <IconButton className={"drawer-icons"}>{route.icon}</IconButton>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary={<FormattedMessage id={route.labelKey} />}
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <div style={{ width: "95%" }}>
        <div className={classes.toolbar} />
        <div className={classes.content}>{props.children}</div>
      </div>
    </div>
  );
};
