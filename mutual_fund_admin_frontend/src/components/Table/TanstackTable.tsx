import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  IconButton,
} from "@mui/material";

import { styled } from "@mui/material/styles";

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

type ReceiptTableData = {
  data: any;
  columns: any;
  pagination?: any;
  setPagination?: any;
  next?: boolean;
  prev?: boolean;
  pageCount?: number;
  loading?: boolean;
};

export default function ReceiptTable({
  columns,
  data,
  pagination,
  setPagination,
  next,
  prev,
  pageCount,
  loading,
}: ReceiptTableData) {
  // const theme = useTheme();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      pagination,
    },
  });

  // if (data.length === 0 && !loading) {
  //   return <p>No Data Found</p>;
  // }

  return (
    <Box>
      <TableContainer sx={{ width: { xs: "100%", lg: "100%" } }}>
        <Table>
          <DefTableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {/* <DefTableCell>S. No.</DefTableCell> */}
                {headerGroup.headers.map((header, index) => (
                  <DefTableCell
                    key={header.id}
                    sx={{
                      textAlign:
                        index === headerGroup.headers.length - 1
                          ? "center"
                          : "left",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </DefTableCell>
                ))}
              </TableRow>
            ))}
          </DefTableHead>
          <DefTableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell, index) => (
                  <DefTableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </DefTableCell>
                ))}
              </TableRow>
            ))}
          </DefTableBody>
          {/* <TableFooter>
          {table.getFooterGroups().map(footerGroup => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <DefTableCell key={header.id} sx={{}}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                </DefTableCell>
              ))}
            </TableRow>
          ))}
        </TableFooter> */}
        </Table>
      </TableContainer>
      {(data && data.length >= 10) || next || prev ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <Typography>Page </Typography>
            {loading ? (
              <Typography sx={{ fontWeight: 600 }}>
                {" "}
                {table.getState().pagination.pageIndex + 1} of {pageCount}
              </Typography>
            ) : (
              <Typography sx={{ fontWeight: 600 }}>
                {" "}
                {table.getState().pagination.pageIndex + 1} of {pageCount}
              </Typography>
            )}
          </Box>
          {/* <Box>
              {Object.keys(rowSelection).length} of{' '}
              {table.getPreFilteredRowModel().rows.length} Total Rows Selected
            </Box> */}
        </Box>
      ) : null}
    </Box>
  );
}
