import { Button, IconButton, makeStyles, Paper, TableFooter, TablePagination, TextField } from "@material-ui/core";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import EditIcon from "@material-ui/icons/Edit";
import React, { ChangeEvent } from "react";
import {
  Cell,
  Column,
  ColumnInstance,
  Filters,
  Row,
  SortingRule,
  useFilters,
  usePagination,
  useRowSelect,
  useRowState,
  useSortBy,
  useTable,
} from "react-table";
import { useUserTheme } from "../../hooks/theme-hook";
import { DEFAULT_MAX_DATA_PER_PAGE } from "../../utils/constants";

interface PreparedCell extends Cell {
  state: {};
}

interface PreparedRow extends Row {
  state: PreparedRowState;
}

interface PreparedRowState {
  isBeingEdited: boolean;
}

interface EditableCellProps {
  cell: PreparedCell;
  row: PreparedRow;
  column: Column;
}

// Create an editable cell renderer
export const EditableCell = (props: EditableCellProps) => {
  const {
    cell: { value },
    row: { state, setState, values },
    column: { id },
  } = props;

  // We need to keep and update the state of the cell normally
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (id == null) return;
    values[id] = e.currentTarget.value;
    setState((old: PreparedRowState) => ({
      ...old,
      values: values,
    }));
  };

  return state.isBeingEdited ? (
    <TextField onChange={onChange} value={value} type="text" color="primary" />
  ) : (
    <span>{value}</span>
  );
};

const useStyles = makeStyles({
  root: {
    margin: "10px",
  },
  container: {
    maxHeight: "60vh",
  },
});

interface EnhancedTableProps {
  columns: Column[];
  data: object[];
  fetchChangeData: (
    page: number,
    pageSize: number,
    filters: Filters<object>,
    sortBy: SortingRule<object>[],
    isChangedPage: boolean,
  ) => void;
  nbOfElements: number;
  resetPage: boolean;
  editable?: boolean;
  column?: ColumnInstance;
  updatedRow?: (rowHasBeenUpdated: boolean, row: Row<object>) => void;
  handleAdd?: () => void;
}

// Define a default UI for filtering
const DefaultColumnFilter = (props: EnhancedTableProps) => {
  const { column } = props;
  const { filterValue, setFilter } = column || {};

  return (
    <TextField
      onChange={e => {
        setFilter && setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      value={filterValue || ""}
      color="secondary"
      placeholder="Rechercher ..."
    />
  );
};

export const EnhancedTable = (props: EnhancedTableProps) => {
  const { columns, data, resetPage, editable, fetchChangeData, nbOfElements, updatedRow, handleAdd } = props;

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      Cell: EditableCell,
    }),
    [],
  );

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, filters, sortBy },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updatedRow,
      initialRowStateAccessor: () => ({ isBeingEdited: false }),
      initialState: {
        pageSize: DEFAULT_MAX_DATA_PER_PAGE,
      },
      manualPagination: true,
      manualFilters: true,
      manualSortBy: true,
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    useRowState,
  );

  const [isPageChanged, setIsPageChanged] = React.useState(false);

  // When these table states change, fetch new data!
  React.useEffect(() => {
    fetchChangeData(pageIndex, pageSize, filters, sortBy, isPageChanged);
    setIsPageChanged(false); // ceci est fait pour désactiver le
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchChangeData, pageIndex, pageSize, filters, sortBy]);

  React.useEffect(() => {
    if (resetPage) {
      gotoPage(0);
    }
  }, [gotoPage, resetPage]);

  const handleChangePage = (event: any, newPage: number) => {
    setIsPageChanged(true);
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSize(Number(event.currentTarget.value));
  };

  const theme = useUserTheme();
  const classes = useStyles(theme);

  // Render the UI for your table
  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <MaUTable {...getTableProps()} stickyHeader>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {editable && (
                  <TableCell
                    style={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    Action
                  </TableCell>
                )}
                {headerGroup.headers.map(column => (
                  <TableCell
                    style={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <div
                      {...(column.id === "selection"
                        ? column.getHeaderProps()
                        : column.getHeaderProps(column.getSortByToggleProps()))}
                    >
                      {column.render("Header")}
                      {column.id !== "selection" ? (
                        <TableSortLabel
                          active={column.isSorted}
                          // react-table has a unsorted state which is not treated here
                          direction={column.isSortedDesc ? "desc" : "asc"}
                        />
                      ) : null}
                    </div>

                    <div>{column.canFilter ? column.render("Filter") : null}</div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody style={{ overflowY: "auto" }}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {editable && (
                    <TableCell style={{ width: "100px", textAlign: "center" }}>
                      {(row.state as PreparedRowState).isBeingEdited ? (
                        <div>
                          <IconButton
                            component="span"
                            style={{ padding: "4px" }}
                            onClick={() => {
                              updatedRow && updatedRow(true, row);
                              row.setState((old: PreparedRowState) => ({
                                ...old,
                                isBeingEdited: !old.isBeingEdited,
                              }));
                            }}
                          >
                            <DoneIcon style={{ color: "green" }} />
                          </IconButton>
                          <IconButton
                            component="span"
                            style={{ padding: "4px" }}
                            onClick={() => {
                              updatedRow && updatedRow(false, row);
                              row.setState((old: PreparedRowState) => ({
                                ...old,
                                isBeingEdited: !old.isBeingEdited,
                              }));
                            }}
                          >
                            <CloseIcon style={{ color: "red" }} />
                          </IconButton>
                        </div>
                      ) : (
                        <IconButton
                          color="primary"
                          component="span"
                          style={{ padding: "4px" }}
                          onClick={() =>
                            row.setState((old: PreparedRowState) => ({
                              ...old,
                              isBeingEdited: !old.isBeingEdited,
                            }))
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                  {row.cells.map(cell => {
                    return <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MaUTable>
      </TableContainer>
      <TableFooter style={{ display: "flex", justifyContent: "space-between" }}>
        {editable && (
          <Button
            style={{
              margin: "10px 10px 5px",
              width: "20%",
              padding: "5px 50px",
            }}
            variant="outlined"
            color="primary"
            onClick={handleAdd}
          >
            Ajouter
          </Button>
        )}
        <TablePagination
          style={editable ? { display: "inline-flex" } : { justifyContent: "space-between" }}
          rowsPerPageOptions={[5, 10, 25, 50, { label: "All", value: nbOfElements }]}
          component="div"
          colSpan={3}
          count={nbOfElements || -1}
          rowsPerPage={pageSize}
          page={pageIndex}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: true,
          }}
          onPageChange={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableFooter>
    </Paper>
  );
};
