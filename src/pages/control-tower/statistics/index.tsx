import { Grid } from "@material-ui/core";
import React from "react";
import { CustomCard } from "../../../components/custom-card";
import { CustomDivider } from "../../../components/custom-divider";
import { CustomGraphBox } from "../../../components/custom-graph-box";
import { SearchByIdBlock } from "./search-by-id-block";
import { UrgentTimeGraph } from "./urgent-time-graph";

export const Statistics = () => {
  return (
    <CustomCard>
      <Grid container spacing={3} justify="center">
        <Grid item xs={10} sm={6} style={{ marginTop: "10px" }}>
          <CustomGraphBox title="graph.averageUrgent.title" marginBottom={0}>
            <UrgentTimeGraph />
          </CustomGraphBox>
        </Grid>
        <Grid item xs={10}>
          <CustomDivider />
          <SearchByIdBlock />
        </Grid>
      </Grid>
    </CustomCard>
  );
};
