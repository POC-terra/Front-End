import React, { useCallback, useState } from "react";
import { Column, Filters, SortingRule } from "react-table";
import { OverviewDescription, useGetOverviews } from "../../../api-generated/swagger-api";
import { CustomCard } from "../../../components/custom-card";
import { EnhancedTable } from "../../../components/custom-table";
import { DEFAULT_MAX_DATA_PER_PAGE } from "../../../utils/constants";
import { calculateRange } from "../../../utils/page-utils";

interface ThresholdData {
  DB_Magasin?: string;
  DB_Zone?: string;
  DB_ReferenceImpactantesChaudes?: number;
  DB_ReferenceImpactantesMoyennes?: number;
  DB_ReferenceImpactantesFroides?: number;
}

const transformData = (dataFromServer: OverviewDescription | null): ThresholdData[] | [] => {
  return (dataFromServer && dataFromServer.result) || [];
};

export const Zones = () => {
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
          Header: "Références impactantes chaudes	",
          accessor: "DB_ReferenceImpactantesChaudes",
          disableFilters: true,
        },
        {
          Header: "Références impactantes moyennes	",
          accessor: "DB_ReferenceImpactantesMoyennes",
          disableFilters: true,
        },
        {
          Header: "Références impactantes froides",
          accessor: "DB_ReferenceImpactantesFroides",
          disableFilters: true,
        },
      ] as Column[],
    [],
  );

  // Common to all tables
  const { data: serverData, refetch } = useGetOverviews({
    queryParams: { range: calculateRange(0, DEFAULT_MAX_DATA_PER_PAGE) },
  });
  const data = transformData(serverData);
  const nbOfElements = (serverData?.count?.length && serverData?.count[0].overview_number) || 0;
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
    <CustomCard title="zones" subheader="Petite description">
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
