import React from "react";
import { VictoryLegend } from "victory";

interface CustomVictoryLegendProps {
  data: any;
  style: any;
  x?: number;
  y?: number;
  orientation?: "horizontal" | "vertical" | undefined;
}

export const CustomVictoryLegend = (props: CustomVictoryLegendProps) => {
  return (
    <VictoryLegend
      x={props.x || 125}
      y={props.y || 50}
      centerTitle
      orientation={props.orientation || "horizontal"}
      gutter={20}
      {...props}
    />
  );
};
