import React, { useCallback } from "react";
import { Column, Filters, SortingRule } from "react-table";
import { MagasinDescription, useGetMagasins } from "../../../api-generated/swagger-api";
import { CustomCard } from "../../../components/custom-card";
import { EnhancedTable } from "../../../components/custom-table";
import { DEFAULT_MAX_DATA_PER_PAGE } from "../../../utils/constants";
import { calculateRange } from "../../../utils/page-utils";

interface ShopData {
  _id?: string;
  DB_ReferenceImpactantesChaudes?: number;
  DB_ReferenceImpactantesMoyennes?: number;
  DB_ReferenceImpactantesFroides?: number;
}

const transformData = (dataFromServer: MagasinDescription | null): ShopData[] | [] => {
  return (dataFromServer && dataFromServer.result) || [];
};

export const Shops = () => {
  const columns = React.useMemo(
    () =>
      [
        {
          Header: "Magasin",
          accessor: "_id",
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

  const { data: serverData, refetch } = useGetMagasins({
    queryParams: { range: calculateRange(0, DEFAULT_MAX_DATA_PER_PAGE) },
  });
  const data = transformData(serverData);
  const nbOfElements = (serverData?.count?.length && serverData?.count[0].magasin_number) || 0;

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
          DB_Magasin: filters.find(e => e.id === "_id")?.value,
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
    <CustomCard title="shops">
      <EnhancedTable
        columns={columns}
        data={data}
        resetPage={resetPage}
        fetchChangeData={fetchChangeData}
        nbOfElements={nbOfElements}
      />
    </CustomCard>
  );
};
