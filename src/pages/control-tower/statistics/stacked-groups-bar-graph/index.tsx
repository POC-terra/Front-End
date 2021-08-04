import React from "react";
import { VictoryBar, VictoryChart, VictoryGroup, VictoryStack } from "victory";
import { CustomVictoryLegend } from "../../../../components/custom-victory-legend";
import { useUserTheme } from "../../../../hooks/theme-hook";
import { DayAndMonthGraphData, DayAndMonthGraphProps } from "../search-by-id-block";

// Number of bars
interface StackedGroupGraphData {
  jour: VerticalStackData[];
  mois: VerticalStackData[];
}

// Number of vertical stacks
interface VerticalStackData {
  [key: number]: StackValues;
}

// x/y values of the bar
interface StackValues {
  x: string;
  y: number;
}

export const StackedGroupBarsGraph = (props: DayAndMonthGraphProps) => {
  const theme = useUserTheme();
  const dataForStackedGroupBars = transformData(props.data);
  const max = findMax(dataForStackedGroupBars);
  return (
    <div>
      <VictoryChart domainPadding={{ x: 50, y: [0, max / 2] }} width={400} height={400}>
        <VictoryGroup offset={20} style={{ data: { width: 10 } }}>
          <VictoryStack>
            {dataForStackedGroupBars?.jour.map((data, index) => {
              return (
                <VictoryBar
                  key={index}
                  data={data as any[]}
                  style={{ data: { fill: theme.palette.primary.light }, labels: { fontSize: 10 } }}
                  labels={({ datum }) => datum.y}
                />
              );
            })}
          </VictoryStack>
          <VictoryStack colorScale={"green"}>
            {dataForStackedGroupBars?.mois.map((data, index) => {
              return (
                <VictoryBar
                  key={index}
                  data={data as any[]}
                  style={{ data: { fill: theme.palette.primary.dark }, labels: { fontSize: 10 } }}
                  labels={({ datum }) => datum.y}
                />
              );
            })}
          </VictoryStack>
        </VictoryGroup>
        <CustomVictoryLegend
          data={[
            { name: "Jour", symbol: { fill: theme.palette.primary.light, type: "square" } },
            { name: "Mois", symbol: { fill: theme.palette.primary.dark, type: "square" } },
          ]}
          style={{ border: { stroke: theme.palette.primary.dark }, title: { fontSize: 20 } }}
        />
      </VictoryChart>
    </div>
  );
};

const transformData = (data: DayAndMonthGraphData): StackedGroupGraphData | null => {
  if (data == null) {
    return null;
  }
  return {
    jour: [1].map(() => {
      return data.jour.map(jour => {
        return {
          x: jour.part_number,
          y: jour.temps_total,
        };
      });
    }),
    mois: [1].map(() => {
      return data.mois.map(mois => {
        return {
          x: mois.part_number,
          y: mois.temps_total,
        };
      });
    }),
  };
};

const findMax = (data: StackedGroupGraphData | null): number => {
  if (data != null) {
    return Math.max.apply(
      null,
      data.jour.map(e => e && e[0] && e[0].y).concat(data.mois.map(e => e && e[0] && e[0].y)),
    );
  }
  return 0;
};
