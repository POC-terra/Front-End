import { Box, Button, Checkbox, FormControlLabel, Grid, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import Select, { ValueType } from "react-select";
import {
  DashboardTempsTraitementJourMois,
  useGetReferencesUniques,
  useGetTempsTraitementJourMois,
} from "../../../../api-generated/swagger-api";
import { CustomGraphBox } from "../../../../components/custom-graph-box";
import { useNotification } from "../../../../hooks/notification-hook";
import { CustomTooltipLabelsGraph } from "../custom-tooltip-labels-graph";
import { NoDataToDisplay } from "../no-data-block";
import { StackedGroupBarsGraph } from "../stacked-groups-bar-graph";
import "./index.scss";

export interface DayAndMonthGraphData {
  jour: TimeGraphData[];
  mois: TimeGraphData[];
}

export interface TimeGraphData {
  part_number: string;
  temps_reception: number;
  temps_conditionnement: number;
  temps_transport?: number;
  temps_stockage?: number;
  temps_total: number;
}

export interface DayAndMonthGraphProps {
  data: DayAndMonthGraphData;
  daySelected?: boolean;
}

interface OptionType {
  value: string;
  label: string;
}

interface CheckedType {
  part_number: string;
  isChecked: boolean;
}

const filterDataWithPartNumber = (checkedPartNumber: CheckedType[], dataFromServer: DayAndMonthGraphData) => {
  return {
    jour: dataFromServer.jour.filter(e => checkedPartNumber.find(cpn => cpn.part_number === e.part_number)?.isChecked),
    mois: dataFromServer.mois.filter(e => checkedPartNumber.find(cpn => cpn.part_number === e.part_number)?.isChecked),
  };
};

const filterDataByOptions = (
  selectedOptions: OptionType[],
  dataFromServer: DashboardTempsTraitementJourMois | null,
): DayAndMonthGraphData => {
  return {
    jour: mapDayAndMonthArray(dataFromServer?.jours, selectedOptions),
    mois: mapDayAndMonthArray(dataFromServer?.mois, selectedOptions),
  };
};

const mapDayAndMonthArray = (
  array:
    | {
        part_number?: string;
        temps_reception?: number;
        temps_conditionnement?: number;
        temps_transport?: number;
        temps_stockage?: number;
        temps_total?: number;
      }[]
    | undefined
    | null,
  selectedOptions: OptionType[],
) => {
  return (
    array
      ?.filter(e => selectedOptions.map(opt => opt.value).includes(e?.part_number || ""))
      .map(e => {
        return {
          part_number: e.part_number || "",
          temps_reception: e.temps_reception || 0,
          temps_conditionnement: e.temps_conditionnement || 0,
          temps_transport: e.temps_transport || 0,
          temps_stockage: e.temps_stockage || 0,
          temps_total: e.temps_total || 0,
        };
      }) || []
  );
};

export const SearchByIdBlock = () => {
  const { showError } = useNotification();
  const [daySelected, setDaySelected] = useState(true);
  const [checkedPartNumber, setCheckedPartNumber] = useState<CheckedType[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [searched, setSearched] = useState(false);

  // DATA
  const { data: refUniqueData } = useGetReferencesUniques({});
  const options = refUniqueData?.references_uniques?.map(e => {
    return {
      value: e,
      label: e,
    } as OptionType;
  });

  const { data: tempsTraitementData } = useGetTempsTraitementJourMois({
    queryParams: { refIds: selectedOptions.map(opt => opt.value).join(",") },
  });

  const filteredDataBySelectedOptions = filterDataByOptions(selectedOptions, tempsTraitementData);
  const filteredDataByChecked = filterDataWithPartNumber(checkedPartNumber, filteredDataBySelectedOptions);
  // END DATA

  const handleChange = (selectedOptions: ValueType<OptionType, boolean>) => {
    setSelectedOptions((selectedOptions as OptionType[]) || []);
  };

  const searchClicked = () => {
    if (selectedOptions.length === 0) {
      showError("Veuillez rechercher au moins un PartNumber !");
      return;
    }

    setCheckedPartNumber(
      selectedOptions.map(opt => {
        return {
          part_number: opt.value,
          isChecked: true,
        };
      }),
    );

    setSearched(true);
  };

  const handleCheck = (part_number: string) => {
    const newArr = checkedPartNumber.map(a => {
      if (a.part_number === part_number) {
        return {
          ...a,
          isChecked: !a.isChecked,
        };
      }
      return a;
    });

    setCheckedPartNumber(newArr);
  };

  return (
    <>
      <Paper variant="outlined" style={{ marginBottom: "10px" }}>
        <Typography component="h4">
          <Box style={{ paddingTop: "10px" }} fontWeight="fontWeightLight">
            <FormattedMessage id="searchByPartNumber" />
          </Box>
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={8} style={{ fontSize: "16px" }}>
            <Select className="m-10" closeMenuOnSelect={false} isMulti options={options} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="outlined" color="primary" style={{ margin: "10px" }} onClick={searchClicked}>
              <FormattedMessage id="search" />
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {searched && (
        <Grid container spacing={1} style={{ fontSize: "16px" }}>
          <Grid item xs={12} sm={6}>
            <CustomGraphBox title="graph.averageTime.title">
              {filteredDataBySelectedOptions.jour.length !== 0 ? (
                <StackedGroupBarsGraph data={filteredDataBySelectedOptions} />
              ) : (
                <NoDataToDisplay />
              )}
            </CustomGraphBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomGraphBox title="graph.averageUrgent.title">
              <div style={{ marginTop: "30px", marginBottom: "-5px" }}>
                <Button
                  variant={daySelected ? "contained" : "outlined"}
                  color="primary"
                  style={{ margin: "5px" }}
                  onClick={() => setDaySelected(true)}
                >
                  Affichage Jour
                </Button>
                <Button
                  variant={daySelected ? "outlined" : "contained"}
                  color="primary"
                  style={{ margin: "5px" }}
                  onClick={() => setDaySelected(false)}
                >
                  Affichage Mois
                </Button>
                <div>
                  {checkedPartNumber.map(j => {
                    return (
                      <FormControlLabel
                        key={j.part_number}
                        control={
                          <Checkbox
                            key={j.part_number}
                            color="primary"
                            checked={j.isChecked}
                            onChange={() => handleCheck(j.part_number)}
                            value={j.isChecked}
                          />
                        }
                        label={j.part_number}
                      />
                    );
                  })}
                </div>
              </div>
              {filteredDataByChecked.jour?.length !== 0 ? (
                <CustomTooltipLabelsGraph data={filteredDataByChecked} daySelected={daySelected} />
              ) : (
                <NoDataToDisplay />
              )}
            </CustomGraphBox>
          </Grid>
        </Grid>
      )}
    </>
  );
};
