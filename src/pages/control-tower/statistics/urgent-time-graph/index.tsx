import { TextField } from "@material-ui/core";
import moment from "moment";
import "moment/locale/fr";
import "moment/min/moment-with-locales";
import React, { ChangeEvent, useState } from "react";
import { FormattedMessage } from "react-intl";
import { VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryScatter } from "victory";
import { DashboardTempsTraitementDescription, useGetTempsTraitementJour } from "../../../../api-generated/swagger-api";
import { CustomVictoryLegend } from "../../../../components/custom-victory-legend";
import { useNotification } from "../../../../hooks/notification-hook";
import { useUserTheme } from "../../../../hooks/theme-hook";
import { NoDataToDisplay } from "../no-data-block";

interface TimeData {
  x: string;
  y: number;
}

export const UrgentTimeGraph = () => {
  const theme = useUserTheme();
  const { showError } = useNotification();

  const [nbJoursGlissants, setNbJoursGlissants] = useState<string>("7");

  /* Generate fake data, TO BIND WITH backend.*/
  const { data: tempsTraitementJourData } = useGetTempsTraitementJour({
    queryParams: { nbJoursGlissants: parseInt(nbJoursGlissants) || 0 },
  });

  const data = transformData(tempsTraitementJourData);

  const averageData = tempsTraitementJourData?.moyenne;

  let max = Math.max.apply(
    null,
    data.map(e => e.y),
  );
  max += max / 5;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const re = /^[0-9\b]+$/;
    if (re.test(e.target.value) || e.target.value === "") {
      setNbJoursGlissants(e.target.value);
    } else {
      showError("Veuillez saisir un entier ! ");
    }
  };

  return (
    <>
      <TextField
        onChange={handleInputChange}
        value={nbJoursGlissants}
        type="text"
        label={<FormattedMessage id="graph.averageUrgent.textField" />}
        color="primary"
        style={{ width: "60%" }}
      />

      {data && data.length > 1 ? (
        <VictoryChart
          domain={{ x: [0, data.length + 1], y: [0, max] }}
          width={500}
          height={400}
          padding={{ left: 75, right: 60, top: 50, bottom: 40 }}
        >
          <VictoryLine
            interpolation={"cardinal"}
            data={data}
            style={{ data: { stroke: theme.palette.primary.main } }}
            labels={({ datum }: any) => datum.y}
            labelComponent={
              <VictoryLabel
                renderInPortal
                dx={10}
                dy={-10}
                style={{ fontSize: 15 - Math.round(data.length / 4) + "px" }}
              />
            }
          />
          <VictoryScatter data={data} size={5} style={{ data: { fill: theme.palette.primary.main } }} />
          {averageData && <VictoryLine y={() => averageData} style={{ data: { stroke: "red" } }} />}
          <VictoryAxis
            label={"Temps en heure"}
            dependentAxis
            standalone={false}
            style={{
              axisLabel: {
                padding: 45,
              },
            }}
          />
          <VictoryAxis
            standalone={false}
            style={{
              tickLabels: {
                fontSize: 12 - Math.round(data.length / 4) + "px",
              },
            }}
          />
          <CustomVictoryLegend
            data={[
              { name: "Moyenne", symbol: { fill: "red", type: "minus" } },
              { name: "Evolution", symbol: { fill: theme.palette.primary.main } },
            ]}
            style={{ border: { stroke: theme.palette.primary.dark }, title: { fontSize: 20 } }}
            y={30}
          />
        </VictoryChart>
      ) : (
        <NoDataToDisplay />
      )}
    </>
  );
};

const transformData = (tempsTraitementJourData: DashboardTempsTraitementDescription | null): TimeData[] => {
  if (tempsTraitementJourData == null) return [];

  const graphMomentFormat = "dd Do";
  return (
    tempsTraitementJourData.jours
      ?.sort((a, b) => new Date(a.date || "").getTime() - new Date(b.date || "").getTime())
      ?.map(jour => {
        return {
          x: moment(jour?.date).format(graphMomentFormat) || "",
          y: jour?.temps_traitement_urgent || 0,
        };
      }) || []
  );
};
