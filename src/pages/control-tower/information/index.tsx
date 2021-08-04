import { Button } from "@material-ui/core";
import React, { useCallback, useState } from "react";
import { Column, Filters, SortingRule } from "react-table";
import { TowerControlDescription, useGetTourControlGlobal } from "../../../api-generated/swagger-api";
import { CustomCard } from "../../../components/custom-card";
import { EnhancedTable } from "../../../components/custom-table";
import { DEFAULT_MAX_DATA_PER_PAGE } from "../../../utils/constants";
import { calculateRange } from "../../../utils/page-utils";
import { InformationModal } from "./information-modal";

interface TowerControlData {
  _id?: string;
  REC_ID?: number;
  REC_STATUS?: number;
  OFA_STATUS?: number;
  CTN_NB_STATUS_FINAUX?: number;
  CTN_NB?: number;
  TAC_NB_STATUS_FINAUX?: number;
  TAC_NB?: number;
  PARTNUMBER?: string;
  URGENCE_RECEPTION?: string;
  FLUX?: string;
  FLUX_DETAIL?: string;
  stockOver?: string;
  idModalOpen?: number;
}

const transformData = (dataFromServer: TowerControlDescription | null): TowerControlData[] | [] => {
  const result = dataFromServer && dataFromServer.result;
  if (result == null) {
    return [];
  }

  return result.map(res => {
    return {
      ...res,
      stockOver: res.CTN_NB_STATUS_FINAUX + "/" + res.CTN_NB,
      idModalOpen: res.REC_ID,
    };
  });
};

export const Information = () => {
  const columns = React.useMemo(
    () =>
      [
        {
          Header: "Réception id	",
          accessor: "REC_ID",
          disableFilters: true,
        },
        {
          Header: "Référence",
          accessor: "PARTNUMBER",
        },
        {
          Header: "Type de flux",
          accessor: "FLUX",
        },
        {
          Header: "Détail du flux",
          accessor: "FLUX_DETAIL",
          disableFilters: true,
        },
        {
          Header: "Référence Urgente",
          accessor: "URGENCE_RECEPTION",
        },
        {
          Header: "Status réception",
          accessor: "REC_STATUS",
        },
        {
          Header: "Status conditionnement",
          accessor: "OFA_STATUS",
        },
        {
          Header: "Mise en stock terminée",
          accessor: "stockOver",
          disableFilters: true,
          disableSortBy: true,
        },
        {
          Header: "Plus d'info",
          accessor: "idModalOpen",
          disableSortBy: true,
          disableFilters: true,
          Cell: ({ cell: { value } }) => (
            <Button style={{ width: "140px" }} color="primary" variant="contained" onClick={() => handleOpen(value)}>
              Plus d'infos
            </Button>
          ),
        },
      ] as Column[],
    [],
  );

  const { data: serverData, refetch } = useGetTourControlGlobal({
    queryParams: { range: calculateRange(0, DEFAULT_MAX_DATA_PER_PAGE) },
  });
  const nbOfElements = serverData?.count || 0;
  const data = transformData(serverData);
  const [resetPage, setResetPage] = React.useState(false);

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
      refetch({
        queryParams: {
          range: calculateRange(page, pageSize),
          REC_STATUS: filters.find(e => e.id === "REC_STATUS")?.value,
          OFA_STATUS: filters.find(e => e.id === "OFA_STATUS")?.value,
          URGENCE_RECEPTION: filters.find(e => e.id === "URGENCE_RECEPTION")?.value,
          FLUX: filters.find(e => e.id === "FLUX")?.value,
          sortColumn: sortBy.length > 0 ? sortBy[0].id : undefined,
          sortDesc: sortBy.length > 0 ? sortBy[0].desc : undefined,
        },
      });
    },
    // Issue with refetch https://github.com/contiamo/restful-react/issues/186
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* Modal Handling */
  const [openId, setOpenId] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const handleOpen = (idModalOpen: number) => {
    setOpenId(idModalOpen);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <CustomCard title="information">
      <EnhancedTable
        columns={columns}
        data={data}
        resetPage={resetPage}
        fetchChangeData={fetchChangeData}
        nbOfElements={nbOfElements}
      />
      <InformationModal open={open} handleClose={handleClose} openId={openId} />
    </CustomCard>
  );
};
