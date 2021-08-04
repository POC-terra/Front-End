import { ButtonBase, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

const images = [
  {
    img_url: "/images/control-tower.jpg",
    title: "Tour de contrôle",
    width: "40%",
    url: "controlTower",
  },
  {
    img_url: "/images/hot-pieces.jpg",
    title: "Pièces chaudes / froides",
    width: "40%",
    url: "/hotAndColdPieces",
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      minWidth: 300,
      justifyContent: "center",
    },
    image: {
      position: "relative",
      margin: "10px",
      height: 200,
      [theme.breakpoints.down("xs")]: {
        width: "100% !important", // Overrides inline-style
        height: 100,
      },
      "&:hover, &$focusVisible": {
        zIndex: 1,
        "& $imageBackdrop": {
          opacity: 0.15,
        },
        "& $imageMarked": {
          opacity: 0,
        },
        "& $imageTitle": {
          border: "4px solid currentColor",
        },
      },
    },
    focusVisible: {},
    imageButton: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.palette.common.white,
    },
    imageSrc: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: "cover",
      backgroundPosition: "center 40%",
    },
    imageBackdrop: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.primary.dark,
      opacity: 0.4,
      transition: theme.transitions.create("opacity"),
    },
    imageTitle: {
      position: "relative",
      padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
    },
    imageMarked: {
      height: 3,
      width: 18,
      backgroundColor: theme.palette.common.white,
      position: "absolute",
      bottom: -2,
      left: "calc(50% - 9px)",
      transition: theme.transitions.create("opacity"),
    },
  }),
);

export const Home = () => {
  const classes = useStyles();
  return (
    <div style={{ width: "100%" }}>
      <Typography component="div" variant="h4" color="inherit">
        <FormattedMessage id="header.title" />
      </Typography>
      <div className={classes.root}>
        {images.map(image => (
          <ButtonBase
            focusRipple
            key={image.title}
            className={classes.image}
            focusVisibleClassName={classes.focusVisible}
            style={{
              width: image.width,
            }}
          >
            <Link to={image.url}>
              <span
                className={classes.imageSrc}
                style={{
                  backgroundImage: `url(${image.img_url})`,
                }}
              />
              <span className={classes.imageBackdrop} />
              <span className={classes.imageButton}>
                <Typography component="span" variant="subtitle1" color="inherit" className={classes.imageTitle}>
                  {image.title}
                  <span className={classes.imageMarked} />
                </Typography>
              </span>
            </Link>
          </ButtonBase>
        ))}
      </div>
    </div>
  );
};
