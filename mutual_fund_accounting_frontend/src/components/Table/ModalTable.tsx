import * as React from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
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
  TableFooter,
} from "@mui/material";

import { styled, useTheme } from "@mui/material/styles";

const DefTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-root ": {
    borderBottom: `1px solid ${theme.palette.secondary[700]}`,
    fontSize: "14px",
    fontWeight: "600px",
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

// type Person = {
//   firstName: string;
//   lastName: string;
//   age: number;
//   visits: number;
//   status: string;
//   progress: number;
// };

// const defaultData: Person[] = [
//   {
//     firstName: "tanner",
//     lastName: "linsley",
//     age: 24,
//     visits: 100,
//     status: "In Relationship",
//     progress: 50,
//   },
//   {
//     firstName: "tandy",
//     lastName: "miller",
//     age: 40,
//     visits: 40,
//     status: "Single",
//     progress: 80,
//   },
//   {
//     firstName: "joe",
//     lastName: "dirte",
//     age: 45,
//     visits: 20,
//     status: "Complicated",
//     progress: 10,
//   },
//   {
//     firstName: "john",
//     lastName: "see-nah",
//     age: 42,
//     visits: 20,
//     status: "Single",
//     progress: 90,
//   },
// ];

// const columnHelper = createColumnHelper<Person>();

// const columns = [
//   columnHelper.accessor("firstName", {
//     cell: (info) => {
//       console.log("info from first name", info);

//       return <Box sx={{}}>{info.getValue()}</Box>;
//     },
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor((row) => row.lastName, {
//     id: "lastName",
//     cell: (info) => info.getValue(),
//     header: () => <span>Last Name</span>,
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("age", {
//     header: () => "Age",
//     cell: (info) => info.renderValue(),
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("visits", {
//     header: () => <span>Visits</span>,
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("status", {
//     header: "Status",
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("progress", {
//     header: "Profile Progress",
//     footer: (info) => info.column.id,
//   }),
// ];

export default function ModalTable({ data, columns }) {
  const theme = useTheme();

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // console.log("get core row model", getCoreRowModel);
  // console.log("data", data)
  // console.log("columns", columns);
  // console.log("theme", theme);

  return (
    <TableContainer>
      <Table>
        <DefTableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <DefTableCell key={header.id} sx={{ fontSize: '1rem' }}>
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
        <TableFooter>
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
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
