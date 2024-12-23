import React from "react";

import {
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { styled } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";

const DefTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-root ": {
    borderBottom: `1px solid ${theme.palette.secondary[300]}`,
    borderRight: `1px solid ${theme.palette.secondary[300]}`,
    fontSize: "14px",
  },
}));

const DefTableBody = styled(TableBody)(({ theme }) => ({
  "& .MuiTableRow-root: nth-child(even)": {
    backgroundColor: theme.palette.secondary[100],
  },
}));

const DefTableCell = styled(TableCell)(({ theme }) => ({
  padding: "4px 8px",
  borderRight: `1px solid ${theme.palette.secondary[300]}`,
}));

type TrailBalanceTableData = {
  data: any;
  columns: any;
  //   pagination?: any;
  //   setPagination?: any;
  //   next?: boolean;
  //   prev?: boolean;
  //   pageCount?: number;
  //   loading?: boolean;
  //   setPageSize?: any;
};

interface TrialBalanceRow {
  acc_code: string;
  transactions: any[];
}

export default function TrialBalancetable({
  data,
  columns,
}: TrailBalanceTableData) {
  const [expanded, setExpanded] = React.useState<ExpandedState>(() =>
    data.reduce((acc: ExpandedState, row: any, index: number) => {
      acc[index] = true;
      return acc;
    }, {})
  );

  const table = useReactTable({
    data: data,
    columns: columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row: TrialBalanceRow) => row.transactions,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    paginateExpandedRows: false,
    debugTable: true,
  });

  return (
    <Box>
      <TableContainer>
        <Table>
          <DefTableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <DefTableCell
                      key={header.id}
                      colSpan={header.colSpan}
                      sx={{
                        textAlign:
                          index === 0 || index === 1 ? "left" : "center",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) =>
                  header.column.columnDef.footer ? (
                    <DefTableCell key={header.id} sx={{ padding: "8px 0" }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </DefTableCell>
                  ) : null
                )}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}
