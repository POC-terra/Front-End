import { Grid } from "@material-ui/core";
import React from "react";
import { CustomCard } from "../../../components/custom-card";
import { CustomGraphBox } from "../../../components/custom-graph-box";
import { HotRotationGraph } from "../hot-rotation-graph";

export const HotColdStatistics = () => {
  return (
    <CustomCard>
      <Grid container spacing={3} justify="center">
        <Grid item xs={11} sm={8} md={7} lg={6} style={{ marginTop: "10px" }}>
          <CustomGraphBox title="graph.amountHotAndRotation.title" titleSizePx={18}>
            <HotRotationGraph />
          </CustomGraphBox>
        </Grid>
      </Grid>
    </CustomCard>
  );
};
