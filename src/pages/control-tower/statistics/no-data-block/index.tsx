import { Box, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

export const NoDataToDisplay = () => {
  return (
    <Typography component="div" style={{ fontSize: "15px" }}>
      <Box style={{ margin: "30px" }} fontStyle="italic" fontWeight="fontWeightLight">
        <FormattedMessage id="noDataToDisplay" />
      </Box>
    </Typography>
  );
};
