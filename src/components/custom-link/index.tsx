import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useUserTheme } from "../../hooks/theme-hook";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textDecoration: "none",
      color: "inherit",
      "&:hover": {
        color: theme.palette.primary.light,
      },
      transition: theme.transitions.create(["color"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shortest,
      }),
    },
  }),
);

interface CustomLinkProps {
  to: string;
  children: ReactNode;
}

export const CustomLink = (props: CustomLinkProps) => {
  const theme = useUserTheme();
  const classes = useStyles(theme);
  return (
    <Link className={classes.root} to={props.to}>
      {props.children}
    </Link>
  );
};
