import { CircularProgress } from "@material-ui/core";
import React from "react";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryTheme } from "victory";
import { useGetRotationPiece } from "../../../api-generated/swagger-api";
import { CustomVictoryLegend } from "../../../components/custom-victory-legend";
import { useUserTheme } from "../../../hooks/theme-hook";

export const HotRotationGraph = () => {
  const { data: dataFromServer, loading } = useGetRotationPiece({
    queryParams: { nbPieceChaude: 10, zoneIds: ["V4", "V3", "B2"].join(",") },
  });
  const { rotation_piece_zone } = dataFromServer || {};

  const data = transformData(rotation_piece_zone);
  const theme = useUserTheme();
  const max = findMax(data);
  return (
    <div>
      {loading ? (
        <CircularProgress color="secondary" style={{ marginTop: "40px" }} />
      ) : (
        <span style={{ marginTop: "-50px" }}>
          <VictoryChart height={320} theme={VictoryTheme.material} domain={{ y: [0, max + max / 3] }}>
            <CustomVictoryLegend
              data={[
                { name: "Chaudes", symbol: { fill: theme.palette.primary.light, type: "minus" } },
                { name: "Rotation", symbol: { fill: "orange", type: "minus" } },
              ]}
              style={{ border: { stroke: theme.palette.primary.dark }, labels: { fontSize: 10 } }}
              x={265}
              y={40}
              orientation={"vertical"}
            />
            <VictoryGroup
              horizontal
              offset={10}
              style={{ data: { width: 6 } }}
              colorScale={["orange", theme.palette.primary.light]}
            >
              <VictoryBar data={data?.rotation} style={{ labels: { fontSize: 6 } }} labels={({ datum }) => datum.y} />
              <VictoryBar data={data?.chaud} style={{ labels: { fontSize: 6 } }} labels={({ datum }) => datum.y} />
            </VictoryGroup>
            <VictoryAxis
              label={"Nombre de pièces"}
              dependentAxis
              standalone={false}
              style={{
                tickLabels: {
                  fontSize: 9,
                  padding: 5,
                },
                axisLabel: {
                  fontSize: 10,
                  padding: 20,
                },
              }}
            />
            <VictoryAxis
              standalone={false}
              style={{
                tickLabels: {
                  fontSize: 9,
                },
              }}
            />
          </VictoryChart>
        </span>
      )}
    </div>
  );
};

interface HotAndRotationPieceGraphData {
  chaud: HotAndRotationPieceSubData[];
  rotation: HotAndRotationPieceSubData[];
}

interface HotAndRotationPieceSubData {
  x: string;
  y: number;
}

const transformData = (
  data:
    | { zone?: string | undefined; nb_pieces_chaudes?: number | undefined; nb_piece_rotation?: number | undefined }[]
    | undefined,
): HotAndRotationPieceGraphData | null => {
  if (data == null) return null;
  return {
    chaud: data.map(d => {
      return {
        x: d.zone || "",
        y: d.nb_pieces_chaudes || 0,
      };
    }),
    rotation: data.map(d => {
      return {
        x: d.zone || "",
        y: d.nb_piece_rotation || 0,
      };
    }),
  };
};

const findMax = (data: HotAndRotationPieceGraphData | null): number => {
  if (data != null) {
    return Math.max.apply(null, data.chaud.map(e => e && e.y).concat(data.rotation.map(e => e.y)));
  }
  return 0;
};
