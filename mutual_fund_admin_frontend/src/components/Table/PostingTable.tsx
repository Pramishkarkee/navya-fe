import React, { HTMLProps, useEffect } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";

//mui icons
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const DefTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-root ": {
    borderBottom: `1px solid ${theme.palette.secondary[700]}`,
    fontWeight: "600",
    fontSize: "14px",
  },
}));
const DefTableBody = styled(TableBody)(({ theme }) => ({
  "& .MuiTableRow-root: nth-child(even)": {
    backgroundColor: theme.palette.secondary[200],
  },
}));
const DefTableCell = styled(TableCell)(() => ({
  padding: "0.3rem",
}));

type PostingTableData = {
  data: any;
  columns: any;
  setSelectedRows: any;
  pagination?: any;
  setPagination?: any;
  next?: boolean;
  prev?: boolean;
  pageCount?: number;
  resetSelectionTrigger?: any;
};

export default function PostingTable({
  data,
  columns,
  setSelectedRows,
  pagination,
  setPagination,
  next,
  prev,
  pageCount,
  resetSelectionTrigger,
}: PostingTableData) {
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data,
    columns,
    state: {
      rowSelection,
      pagination,
    },

    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    debugTable: true,
  });

  useEffect(() => {
    setRowSelection({});
  }, [resetSelectionTrigger]);

  useEffect(() => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((item) => item?.original);

    setSelectedRows(selectedRows);
  }, [rowSelection]);

  return (
    <Box>
      <TableContainer sx={{ width: { xs: "100%", lg: "100%" } }}>
        <Table>
          <DefTableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <DefTableCell key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </>
                      )}
                    </DefTableCell>
                  );
                })}
              </TableRow>
            ))}
          </DefTableHead>
          <DefTableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <DefTableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </DefTableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </DefTableBody>
          {/* <TableFooter>
            <TableRow>
              <DefTableCell className="p-1">
                <IndeterminateCheckbox
                  {...{
                    checked: table.getIsAllPageRowsSelected(),
                    indeterminate: table.getIsSomePageRowsSelected(),
                    onChange: table.getToggleAllPageRowsSelectedHandler(),
                  }}
                />
              </DefTableCell>
              <TableCell colSpan={20}>Page Rows ({table.getRowModel().rows.length})</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </TableContainer>
      {(data && data.length >= 10) || next || prev ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <IconButton
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={prev}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={next}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </Box>
          {pagination && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
              }}
            >
              <Typography>Page </Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {" "}
                {table.getState().pagination.pageIndex + 1} of {pageCount}
              </Typography>
            </Box>
          )}

          {/* <Box>
            {Object.keys(rowSelection).length} of{" "}
            {table.getPreFilteredRowModel().rows.length} Total Rows Selected
          </Box> */}
        </Box>
      ) : null}
    </Box>
  );
}

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
      style={{ backgroundColor: "mainColor" }}
    />
  );
}
