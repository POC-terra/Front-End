import React, { useCallback, useState } from "react";
import { Column, Filters, Row, SortingRule } from "react-table";
import { SeuilDescription, useGetSeuils } from "../../../api-generated/swagger-api";
import { CustomCard } from "../../../components/custom-card";
import { EnhancedTable } from "../../../components/custom-table";
import { useNotification } from "../../../hooks/notification-hook";
import { DEFAULT_MAX_DATA_PER_PAGE } from "../../../utils/constants";
import { calculateRange } from "../../../utils/page-utils";
import { AddThresholdModal } from "./add-threshold-modal";
import { usePutSeuil } from "./api-post";

export interface ThresholdData {
  id?: string;
  magasin?: string;
  zone?: string;
  seuil_min?: string;
  seuil_max?: string;
  critere?: string;
}

const transformData = (dataFromServer: SeuilDescription | null): ThresholdData[] | [] => {
  return (dataFromServer && dataFromServer.result) || [];
};

interface QueryParamsValues {
  range: string;
  magasin: any;
  zone: any;
  critere: any;
  sortColumn: string | undefined;
  sortDesc: boolean | undefined;
}

export const Thresholds = () => {
  const columns = React.useMemo(
    () =>
      [
        {
          Header: "Magasin",
          accessor: "magasin",
        },
        {
          Header: "Zone",
          accessor: "zone",
        },
        {
          Header: "Seuil Min",
          accessor: "seuil_min",
          disableFilters: true,
        },
        {
          Header: "Seuil Max",
          accessor: "seuil_max",
          disableFilters: true,
        },
        {
          Header: "Critère",
          accessor: "critere",
        },
      ] as Column[],
    [],
  );

  // Common to all tables
  const { data: serverData, refetch } = useGetSeuils({
    queryParams: { range: calculateRange(0, DEFAULT_MAX_DATA_PER_PAGE) },
  });
  const data = transformData(serverData);
  const nbOfElements = (serverData?.count?.length && serverData?.count[0].seuil_number) || 0;
  const [resetPage, setResetPage] = useState(false);

  // We can't use usePostSeuils or we have to change the CustomRestfulProvider Base..
  const { mutate } = usePutSeuil();

  // Used to refetch with previous params when updating line
  const [queryParams, setQueryParams] = useState<QueryParamsValues | undefined>(undefined);

  // Proper to Editable tables
  const { showSuccess, showError } = useNotification();
  const updatedRow = (rowHasBeenUpdated: boolean, row: Row<object>) => {
    const {
      values: { magasin, zone, seuil_min, seuil_max, critere },
    } = row;
    setResetPage(true);
    if (rowHasBeenUpdated) {
      mutate({ seuils: [{ magasin, zone, seuil_min, seuil_max, critere }] }).then(() => {
        showSuccess("Ligne mise à jour avec succès!");
        refetch({ queryParams: queryParams });
      });
    } else {
      refetch({ queryParams: queryParams });
      showError("Action de modification annulée !");
    }
  };

  /* Function to handle page change + filter + sort */
  const fetchChangeData = useCallback(
    (
      page: number,
      pageSize: number,
      filters: Filters<object>,
      sortBy: SortingRule<object>[],
      isPageChanged: boolean,
    ) => {
      // Reset page if not changing page action
      isPageChanged ? setResetPage(false) : setResetPage(true);
      const newQueryParams = {
        range: calculateRange(page, pageSize),
        magasin: filters.find(e => e.id === "magasin")?.value,
        zone: filters.find(e => e.id === "zone")?.value,
        critere: filters.find(e => e.id === "critere")?.value,
        sortColumn: sortBy.length > 0 ? sortBy[0].id : undefined,
        sortDesc: sortBy.length > 0 ? sortBy[0].desc : undefined,
      };
      setQueryParams(newQueryParams);
      refetch({
        queryParams: newQueryParams,
      });
    },
    // Issue with refetch https://github.com/contiamo/restful-react/issues/186
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* Modal add Handling */
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    refetch({ queryParams: queryParams });
  };

  return (
    <CustomCard title="thresholds" subheader="Petite description">
      <EnhancedTable
        columns={columns}
        data={data}
        fetchChangeData={fetchChangeData}
        resetPage={resetPage}
        editable={true}
        nbOfElements={nbOfElements}
        updatedRow={updatedRow}
        handleAdd={handleAdd}
      />
      <AddThresholdModal open={open} handleClose={handleClose} />
    </CustomCard>
  );
};
