import { Box, Paper, Typography } from "@material-ui/core";
import React, { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface CustomGraphBoxProps {
  title: string;
  children: ReactNode;
  titleSizePx?: number;
  marginBottom?: number;
}

export const CustomGraphBox = (props: CustomGraphBoxProps) => {
  return (
    <Paper elevation={3} style={{ minHeight: "200px" }}>
      <Typography component="div" style={{ fontSize: props.titleSizePx + "px" || "15px" }}>
        <Box
          style={{ marginBottom: props.marginBottom != null ? props.marginBottom : -20 + "px", paddingTop: "10px" }}
          fontWeight="fontWeightLight"
        >
          <FormattedMessage id={props.title} />
        </Box>
      </Typography>
      <span> {props.children}</span>
    </Paper>
  );
};
