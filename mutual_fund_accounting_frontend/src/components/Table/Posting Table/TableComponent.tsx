import React, { useState, HTMLProps } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
  ExpandedState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  Box,
  IconButton,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

interface TableComponentProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  renderExpandedRow?: (row: any) => React.ReactNode;
  setSelectedRows?: any;
  pageCount?: number;
  setPageSize?: any;
  pagination?: any;
  setPagination?: any;
  next?: boolean;
  prev?: boolean;
}

const TableComponent = <T,>({
  data,
  columns,
  renderExpandedRow,
  setSelectedRows,
  pageCount,
  setPageSize,
  pagination,
  setPagination,
  next,
  prev,
}: TableComponentProps<T>) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleIconClick = (rowId: string) => {
    setExpanded((prev) => ({
      // ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const handleLastPage = () => {
    table.setPageIndex(pageCount - 1);
  };

  const table = useReactTable<T>({
    data: data ?? [],
    columns,
    state: {
      expanded,
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onExpandedChange: setExpanded,
    getSubRows: (row) => (row as any).subRows,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
  });

  return (
    <Box sx={{ p: 0 }}>
      <TableContainer>
        <MuiTable>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableCell>
                  {/* Expand icon is only relevant in the action column */}
                </TableCell>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    sx={{ p: 1 }}
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <Box>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody sx={{}}>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow sx={{ borderBottom: "" }}>
                  <TableCell
                    sx={{
                      p: 0,
                      borderBottom: row.getIsExpanded()
                        ? "none"
                        : "1px solid #e2e2e2",
                    }}
                  >
                    <IconButton onClick={() => handleIconClick(row.id)}>
                      {row.getIsExpanded() ? (
                        <ExpandMoreIcon />
                      ) : (
                        <KeyboardArrowRightIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        p: 1,
                        borderBottom: row.getIsExpanded()
                          ? "none"
                          : " 1px solid #e2e2e2",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 2}>
                      {renderExpandedRow ? renderExpandedRow(row) : null}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {(data && data.length >= 10) || next || prev ? (
        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", lg: "100%" },
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: theme.palette.grey[200],
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <IconButton
              className="border rounded p-1"
              onClick={() => table.firstPage()}
              disabled={prev}
            >
              <KeyboardDoubleArrowLeftIcon />
            </IconButton>
            <IconButton
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={prev}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
                mt: 0,
              }}
            >
              {setPageSize && (
                <select
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                  }}
                  value={table.getState().pagination.pageSize}
                  onChange={(event) => {
                    if (setPageSize) {
                      setPageSize(Number(event.target.value));
                    }
                    table.setPageSize(Number(event.target.value));
                  }}
                >
                  {[10, 25, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              )}

              <Typography>Page </Typography>

              <Typography sx={{ fontWeight: 600 }}>
                {" "}
                {table.getState().pagination.pageIndex + 1} of {pageCount}
              </Typography>
            </Box>

            <IconButton
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={next}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
            <IconButton
              className="border rounded p-1"
              // onClick ={() => table.lastPage()}
              onClick={handleLastPage}
              disabled={next}
            >
              <KeyboardDoubleArrowRightIcon />
            </IconButton>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

export default TableComponent;
