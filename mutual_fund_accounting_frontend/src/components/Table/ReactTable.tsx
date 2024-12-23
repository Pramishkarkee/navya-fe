/* eslint-disable no-mixed-spaces-and-tabs */

import {
  Box,
  Typography,
  IconButton,
  Select,
  FormLabel,
  MenuItem,
  TableFooter,
} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import MuiTable from "@mui/material/Table";
import Skeleton from "@mui/material/Skeleton";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import styled from "@mui/material/styles/styled";
import MuiTableContainer from "@mui/material/TableContainer";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CloudIcon from "@mui/icons-material/Cloud";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import React, { useState } from "react";
import Range from "utils/Range";
import { Empty } from "antd";
import { WidthFull } from "@mui/icons-material";

const TableContainer = styled(MuiTableContainer)(({ theme }) => ({
  overflowX: "auto",
}));

const GlobalTable = styled(MuiTable)(({ theme }) => ({
  // head customization

  "& .MuiTableHead-root": {
    "& .MuiTableCell-root ": {
      fontSize: "14px",
      fontWeight: "600",
      borderBottom: "",
      padding: "9px 10px",
      textAlign: "start",
    },
  },

  "& .MuiTableFooter-root": {
    "& .MuiTableCell-root ": {
      fontSize: "14px",
      fontWeight: "400",
      padding: "9px 10px",
      textAlign: "center",
      fontFamily: "'Roboto', sans-serif",
      width: "100%",
    },
  },

  "& .MuiTableCell-root MuiTableCell-body": {
    borderBottom: "none",
  },
  // body customization
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root[aria-expanded]": {
      "& .MuiTableCell-root": {
        border: "none",
        margin: 0,
        padding: 0,
      },
    },
    '& .MuiTableRow-root[aria-expanded="true"]': {},
  },
}));

const TableHead = styled(MuiTableHead)(({ theme }) => ({
  fontWeight: 600,

  "& .MuiTableCell-root": {
    fontFamily: "'Roboto', sans-serif",
    borderRight: "1px solid #f5f5f5",
  },
}));

const TableBody = styled(MuiTableBody)(({ theme }) => ({
  "& .MuiTableCell-root": {
    textAlign: "center",
    padding: "6px 10px",
    fontSize: "14px",
    borderRight: "1px solid #f5f5f5",
  },
}));

const TableFoot = styled(TableFooter)(({ theme }) => ({
  backgroundColor: theme.palette.secondary[100],
  "& .MuiTableCell-root": {
    textAlign: "center",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    padding: "1px 1px",
    width : "5000px",
    // WidthFull,
    
    
  },
}));

const DefTableCell = styled(TableCell)(() => ({
  padding: "0.3rem ",
}));


type TableData = {
  data: any;
  columns: any;
  isLoading?: boolean;
  pagination?: any;
  setPagination?: any;
  next?: boolean;
  prev?: boolean;
  pageCount?: number;
  pageSize?: number;
  setPageSize?: any;
};

export const ReactTable = ({
  data,
  columns,
  isLoading,
  pagination,
  setPagination,
  next,
  prev,
  pageCount,
  pageSize,
  setPageSize,
}: TableData) => {
  const columnsCount = columns?.length;
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination,
    },
    debugTable: true,
  });

  const renderTableBody = () => {
    if (isLoading) {
      return <TableBodySkeleton columnCount={columnsCount} rowCount={10} />;
    }

    if (data?.length <= 0)
      return (
        <TableRow>
          <TableCell colSpan={columnsCount}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Empty
                // imageStyle={{ height: 150, width: 150 }}
                description="No Data Available"
                
                // sx={{
                //   fontSize: "200px",
                //   color: "#bdbdbd",
                // }}
              />
              {/* <Typography>No Data available</Typography> */}
            </Box>
          </TableCell>
        </TableRow>
      );

    return table?.getRowModel()?.rows?.map((row) => {
      return (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => {
            return (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

  return (
    <Box>
      <TableContainer>
        <GlobalTable>
          <TableHead>
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableCell key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-start justify-start gap-1"
                              : "",
                            // onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {/* {{
                            asc: (
                              <ArrowUpwardIcon
                                sx={{
                                  textAlign: "center",
                                }}
                              />
                            ),
                            desc: <ArrowDownwardIcon />,
                          }[header.column.getIsSorted()] ?? null} */}
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>{renderTableBody()}</TableBody>
          
        </GlobalTable>
        <TableFoot>
          <TableRow>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  width: { xs: "100%", lg: "100%" },
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!prev}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                    }}
                  >
                    <Typography>Page </Typography>
                    {isLoading ? (
                      <Box
                        sx={{
                          height: "28px",
                          width: "100px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        <Typography sx={{ fontWeight: 600 }}>
                          {" "}
                          {table.getState().pagination.pageIndex + 1}
                        </Typography>
                        <Skeleton
                          animation="pulse"
                          variant="rectangular"
                          width={"100%"}
                          height="25"
                        />
                      </Box>
                    ) : (
                      <Typography sx={{ fontWeight: 600 }}>
                        {" "}
                        {table.getState().pagination.pageIndex + 1} of{" "}
                        {pageCount}
                      </Typography>
                    )}
                  </Box>

                  <IconButton
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!next}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FormLabel>View Size</FormLabel>
                  <Select
                    size="small"
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "#fff",
                      },
                    }}
                  >
                    <MenuItem value="10">10</MenuItem>
                    <MenuItem value="25">25</MenuItem>
                    <MenuItem value="50">50</MenuItem>
                    <MenuItem value="100">100</MenuItem>
                  </Select>
                </Box>
              </Box>
            </TableCell>
          </TableRow>
        </TableFoot>
      </TableContainer>
    </Box>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(ReactTable);

const TableBodySkeleton = ({ rowCount, columnCount }) => {
  const rows = Range({ start: 1, end: rowCount });
  const columns = Range({ start: 1, end: columnCount });

  return (
    <>
      {rows.map((row) => (
        <TableRow key={row}>
          {columns.map((column) => (
            <TableCell key={column}>
              {/* {!skipColumns?.includes(key + 1) && ( */}
              <Box
                sx={{
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Skeleton
                  animation="pulse"
                  variant="rectangular"
                  width={"100%"}
                  height="25"
                />
              </Box>
              {/* )} */}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
