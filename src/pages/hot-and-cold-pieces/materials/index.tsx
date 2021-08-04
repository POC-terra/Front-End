import React, { useCallback, useState } from "react";
import { Column, Filters, SortingRule } from "react-table";
import { MaterialDescription, useGetMaterials } from "../../../api-generated/swagger-api";
import { CustomCard } from "../../../components/custom-card";
import { EnhancedTable } from "../../../components/custom-table";
import { DEFAULT_MAX_DATA_PER_PAGE } from "../../../utils/constants";
import { calculateRange } from "../../../utils/page-utils";

interface MaterialData {
  _id?: string;
  DB_Magasin?: string;
  DB_Zone?: string;
  DB_Reference?: string;
  DB_CTT?: string;
  DB_CTU?: number;
  DB_DateStock?: string;
  DB_DQLM0?: number;
  DB_DQPM0?: number;
  DB_DQLM1?: number;
  DB_DQPM1?: number;
  DB_DQLM2?: number;
  DB_DQPM2?: number;
  DB_ReferenceImpactante?: string;
  DB_StockMin?: number;
  DB_StockMax?: number;
  DB_ReferenceImpactanteEncoded?: number;
}

const transformData = (dataFromServer: MaterialDescription | null): MaterialData[] | [] => {
  return (dataFromServer && dataFromServer.result) || [];
};

export const Materials = () => {
  const columns = React.useMemo(
    () =>
      [
        {
          Header: "Magasin",
          accessor: "DB_Magasin",
        },
        {
          Header: "Zone",
          accessor: "DB_Zone",
        },
        {
          Header: "Référence",
          accessor: "DB_Reference",
        },
        {
          Header: "CTT",
          accessor: "DB_CTT",
          disableFilters: true,
        },
        {
          Header: "CTU",
          accessor: "DB_CTU",
          disableFilters: true,
        },
        {
          Header: "Date stock départ",
          accessor: "DB_DateStock",
          disableFilters: true,
        },
        {
          Header: "Détail lignes mois en cours",
          accessor: "DB_DQLM0",
          disableFilters: true,
        },
        {
          Header: "Détail pièces mois en cours",
          accessor: "DB_DQPM0",
          disableFilters: true,
        },
        {
          Header: "Détail lignes mois -1",
          accessor: "DB_DQLM1",
          disableFilters: true,
        },
        {
          Header: "Détail pièces mois -1",
          accessor: "DB_DQPM1",
          disableFilters: true,
        },
        {
          Header: "Détail lignes mois -2",
          accessor: "DB_DQLM2",
          disableFilters: true,
        },
        {
          Header: "Détail pièces mois -2",
          accessor: "DB_DQPM2",
          disableFilters: true,
        },
        {
          Header: "Chaleur de la référence",
          accessor: "DB_ReferenceImpactante",
        },
      ] as Column[],
    [],
  );

  // Common to all tables
  const { data: serverData, refetch } = useGetMaterials({
    queryParams: { range: calculateRange(0, DEFAULT_MAX_DATA_PER_PAGE) },
  });
  const data = transformData(serverData);
  const nbOfElements = (serverData?.count?.length && serverData?.count[0].material_number) || 0;
  const [resetPage, setResetPage] = useState(false);

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
          DB_Magasin: filters.find(e => e.id === "DB_Magasin")?.value,
          DB_Zone: filters.find(e => e.id === "DB_Zone")?.value,
          DB_Reference: filters.find(e => e.id === "DB_Reference")?.value,
          DB_ReferenceImpactante: filters.find(e => e.id === "DB_ReferenceImpactante")?.value,
          sortColumn: sortBy.length > 0 ? sortBy[0].id : undefined,
          sortDesc: sortBy.length > 0 ? sortBy[0].desc : undefined,
        },
      });
    },
    // Issue with refetch https://github.com/contiamo/restful-react/issues/186
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <CustomCard title="references" subheader="Petite description">
      <EnhancedTable
        columns={columns}
        data={data}
        fetchChangeData={fetchChangeData}
        resetPage={resetPage}
        nbOfElements={nbOfElements}
      />
    </CustomCard>
  );
};
