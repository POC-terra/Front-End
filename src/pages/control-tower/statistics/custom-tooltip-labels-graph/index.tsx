import chroma from "chroma-js";
import React from "react";
import { IntlShape, useIntl } from "react-intl";
import { VictoryLabel, VictoryPie } from "victory";
import { useUserTheme } from "../../../../hooks/theme-hook";
import { DayAndMonthGraphData, DayAndMonthGraphProps } from "../search-by-id-block";

interface CustomTooltipLabelsData {
  x?: number;
  y?: any;
  hoverLabel?: string;
}

export const CustomTooltipLabelsGraph = (props: DayAndMonthGraphProps) => {
  const theme = useUserTheme();
  const intl = useIntl();
  const data = transformData(props.data, intl, props.daySelected);

  const colors = chroma
    .scale([theme.palette.primary.main, theme.palette.primary.dark])
    .mode("lch")
    .colors(6);
  return (
    <>
      <VictoryPie
        style={{ labels: { fill: "white" } }}
        colorScale={colors}
        innerRadius={60}
        labelRadius={80}
        labels={({ datum }) => `${datum.y}`}
        labelComponent={<VictoryLabel />}
        data={data as any[]}
        events={[
          {
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "data",
                    mutation: ({ style }) => {
                      return { style: { fill: "#c43a31" } };
                    },
                  },
                  {
                    target: "labels",
                    mutation: (props: any) => {
                      return {
                        text: props.datum.hoverLabel,
                        style: {
                          fill: "white",
                          "text-shadow": "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
                        },
                      };
                    },
                  },
                ];
              },
              onMouseOut: () => {
                return [
                  {
                    target: "data",
                    mutation: ({ style }) => {
                      return null;
                    },
                  },
                  {
                    target: "labels",
                    mutation: ({ text }) => {
                      return null;
                    },
                  },
                ];
              },
            },
          },
        ]}
      />
    </>
  );
};

const transformData = (
  data: DayAndMonthGraphData,
  intl: IntlShape,
  daySelected?: boolean,
): CustomTooltipLabelsData[] | null => {
  if (data == null || daySelected == null) {
    return null;
  }

  return daySelected ? generateData(data.jour, intl) : generateData(data.mois, intl);
};

const generateData = (data: any[], intl: IntlShape): CustomTooltipLabelsData[] => {
  if (data == null || data.length === 0) return [];
  const keysToDisplayData = Object.keys(data[0]).filter(key => key !== "part_number" && key !== "temps_total");

  return keysToDisplayData.flatMap((key, index) => {
    return {
      x: index,
      y: data.reduce((acc, curr) => Math.round((acc + curr[key]) / data.length), 0),
      hoverLabel: intl.formatMessage({ id: key }), // TODO traduction à rajouter dans template.json et "npm run translate"
    };
  });
};
