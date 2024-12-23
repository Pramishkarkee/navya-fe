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
  // TableFooter,
  Typography,
  IconButton,
  // Select,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import {
  styled,
  // useTheme
} from "@mui/material/styles";

const DefTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-root ": {
    borderBottom: `1px solid ${theme.palette.secondary[700]}`,
    fontSize: "14px",
    fontWeight: "600px",
  },
}));

const DefTableBody = styled(TableBody)(({ theme }) => ({
  "& .MuiTableRow-root: nth-child(even)": {
    backgroundColor: theme.palette.secondary[100],
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
  setPageSize?: any;
};

export default function ReceiptTable({
  data,
  columns,
  pagination,
  setPagination,
  next,
  prev,
  pageCount,
  loading,
  setPageSize,
}: ReceiptTableData) {
  // const theme = useTheme();

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      pagination,
    },
  });

  const handleLastPage = () => {
    table.setPageIndex(pageCount - 1);
  };

  return (
    <Box>
      <TableContainer sx={{ width: { xs: "100%", lg: "130%" } }}>
        <Table>
          <DefTableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <DefTableCell
                    key={header.id}
                    sx={{
                      fontSize: "1rem",
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
                {row.getVisibleCells().map((cell) => (
                  <DefTableCell key={cell.id} sx={{}}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </DefTableCell>
                ))}
              </TableRow>
            ))}
          </DefTableBody>
          {/* <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
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
            width: { xs: "100%", lg: "130%" },
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
              mt: 1,
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
          {/* <Box>
              {Object.keys(rowSelection).length} of{' '}
              {table.getPreFilteredRowModel().rows.length} Total Rows Selected
            </Box> */}
        </Box>
      ) : null}
    </Box>
  );
}
