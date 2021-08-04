import { makeStyles, Switch, Theme } from "@material-ui/core";
import chroma from "chroma-js";
import React from "react";

interface CustomSwitchProps {
  color: string;
  checked: boolean;
  onChange: () => void;
}

const useStyles = makeStyles<Theme, { color: string }>({
  switchBase: {
    color: ({ color }) =>
      chroma(color)
        .brighten()
        .brighten()
        .css(),
  },
  checked: {
    color: ({ color }) => color + "!important",
  },
  track: {
    backgroundColor: ({ color }) =>
      chroma(color)
        .brighten()
        .css() + "!important",
  },
});

export const CustomSwitch = (props: CustomSwitchProps) => {
  const { checked, onChange, color } = props;
  const classes = useStyles({ color });

  return (
    <Switch
      classes={{
        switchBase: classes.switchBase,
        checked: classes.checked,
        track: classes.track,
      }}
      checked={checked}
      onChange={onChange}
    />
  );
};
