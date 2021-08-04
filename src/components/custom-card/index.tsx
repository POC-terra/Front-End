import { Card, CardHeader, Grid } from "@material-ui/core";
import React, { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { CustomDivider } from "../custom-divider";

interface CustomCardProps {
  title?: string;
  subheader?: string;
  children: ReactNode;
}

export const CustomCard = (props: CustomCardProps) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Card className="custom-card">
          {props.title != null && (
            <>
              <CardHeader title={<FormattedMessage id={props.title} />} subheader={props.subheader} />
              <CustomDivider />
            </>
          )}
          {props.children}
        </Card>
      </Grid>
    </Grid>
  );
};
