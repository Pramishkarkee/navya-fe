import React, { HTMLProps, useEffect, useRef, useState } from "react";
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
  TableFooter,
  useTheme,
  FormControlLabel,
  Radio,
  IconButton,
  Typography,
  // FormLabel,
  // Select,
  // MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

//mui icons
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const DefTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-root ": {
    borderBottom: `1px solid ${theme.palette.secondary[700]}`,
    fontSize: "14px",
    fontWeight: 600,
  },
}));
const DefTableBody = styled(TableBody)(({ theme }) => ({
  "& .MuiTableRow-root: nth-child(even)": {
    backgroundColor: theme.palette.secondary[200],
  },

}));
const DefTableCell = styled(TableCell)(() => ({
  padding: "0.3rem",
  "& .MuiTypography-root": {
    fontSize: "14px",
    fontWeight: 400,
  },
}));
const DefTableFooter = styled(TableCell)(() => ({
  "& .MuiTypography-root": {
    fontSize: "14px",
    fontWeight: 600,
  },
  "&.MuiTableCell-root": {
    padding: "0.5rem",
  },
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
  mutipleRowSelection?: boolean;
  // pageSize?: number;
  setPageSize?: any;
  resetSelectionTrigger?: any;   // to reset the selected rows
};

export function PostingTable({
  data,
  columns,
  setSelectedRows,
  pagination,
  setPagination,
  next,
  prev,
  pageCount,
  // pageSize,
  setPageSize,
  mutipleRowSelection,
  resetSelectionTrigger,
}: PostingTableData) {
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    debugTable: true,
  });

  //to reset the selected rows
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
              <DefTableCell className="">
              
              </DefTableCell>
              <TableCell colSpan={0}>
                
                Total (Selected Items)
              </TableCell>
            </TableRow>
          </TableFooter> */}
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <DefTableFooter key={header.id} sx={{}}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                  </DefTableFooter>
                ))}
              </TableRow>
            ))}
          </TableFooter>


        </Table>
        {/* <Box
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
                </Box> */}
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

          {/* {mutipleRowSelection ? (
            <Box>
              {Object.keys(rowSelection).length} of{" "

              } Total Rows Selected 
            </Box>
          ) : null} */}


          {pagination && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
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
    />
  );
}

export function IndeterminateRadiobox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(rest.checked || false);
  const theme = useTheme();
  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      if (!rest.checked && indeterminate) {
        ref.current.indeterminate = true;
        setChecked(false);
      } else {
        ref.current.indeterminate = false;
        setChecked(rest.checked || false);
      }
    }
  }, [indeterminate, rest.checked]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!indeterminate) {
      setChecked(event.target.checked);
    }
    if (rest.onChange) {
      rest.onChange(event);
    }
  };

  return (
    <FormControlLabel
      control={
        <Radio
          inputRef={ref}
          checked={checked}
          onChange={handleInputChange}
          sx={{
            "& .MuiSvgIcon-root": {
              color: indeterminate
                ? theme.palette.primary[1100]
                : theme.palette.primary[1100],
            },
          }}
        />
      }
      label={rest.label}
      className={className + " cursor-pointer"}
    />
  );
}





// import React, { HTMLProps, useEffect, useRef, useState } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Box,
//   TableContainer,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableFooter,
//   useTheme,
//   FormControlLabel,
//   Radio,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";

// //mui icons
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// const DefTableHead = styled(TableHead)(({ theme }) => ({
//   "& .MuiTableCell-root ": {
//     borderBottom: `1px solid ${theme.palette.secondary[700]}`,
//   },
// }));
// const DefTableBody = styled(TableBody)(({ theme }) => ({
//   "& .MuiTableRow-root:nth-child(even)": {
//     backgroundColor: theme.palette.secondary[200],
//   },
// }));
// const DefTableCell = styled(TableCell)(() => ({
//   padding: "0.3rem",
// }));

// type PostingTableData = {
//   data: any;
//   columns: any;
//   setSelectedRows: any;
//   pagination?: any;
//   setPagination?: any;
//   next?: boolean;
//   prev?: boolean;
//   pageCount?: number;
//   multipleRowSelection?: boolean;
// };

// export function PostingTable({
//   data,
//   columns,
//   setSelectedRows,
//   pagination,
//   setPagination,
//   next,
//   prev,
//   pageCount,
//   multipleRowSelection,
// }: PostingTableData) {
//   const [rowSelection, setRowSelection] = useState({});

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       rowSelection,
//       pagination,
//     },
//     enableRowSelection: true,
//     enableMultiRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onPaginationChange: setPagination,
//     manualPagination: true,
//     debugTable: true,
//   });

//   useEffect(() => {
//     const selectedRows = table
//       .getSelectedRowModel()
//       .rows.map((item) => item?.original);

//     setSelectedRows(selectedRows);
//   }, [rowSelection]);

//   // Calculate total units
//   // const totalUnits = data.reduce((sum, rowSelection) => sum + parseFloat(rowSelection.units || 0), 0);
//   const totalUnits =  data.reduce((sum , selectedRows ) => (sum + (parseFloat(selectedRows.units) || 0)), 0);
//   const totalPurchase = data.reduce((sum, row) => sum + parseFloat(row.purchasePrice || 0), 0);

//   return (
//     <Box>
//       <TableContainer sx={{ width: { xs: "100%", lg: "100%" } }}>
//         <Table>
//           <DefTableHead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <DefTableCell key={header.id} colSpan={header.colSpan}>
//                       {header.isPlaceholder ? null : (
//                         <>
//                           {flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                         </>
//                       )}
//                     </DefTableCell>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </DefTableHead>
//           <DefTableBody>
//             {table.getRowModel().rows.map((row) => {
//               return (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => {
//                     return (
//                       <DefTableCell key={cell.id}>
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext()
//                         )}
//                       </DefTableCell>
//                     );
//                   })}
//                 </TableRow>
//               );
//             })}
//           </DefTableBody>
//           <TableFooter>
//             <TableRow>
//               <DefTableCell colSpan={columns.length} sx={{display:'flex'}}>
//                 <Typography
//                   sx={{
//                     fontSize: "0.85rem",
//                     textAlign: "right",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Total Units: {totalUnits.toLocaleString()}
//                 </Typography>
//                 <Typography
//                   sx={{
//                     fontSize: "0.85rem",
//                     textAlign: "right",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Total Units: {totalPurchase.toLocaleString()}
//                 </Typography>
//               </DefTableCell>
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </TableContainer>
//       {(data && data.length >= 10) || next || prev ? (
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//             }}
//           >
//             <IconButton
//               className="border rounded p-1"
//               onClick={() => table.previousPage()}
//               disabled={prev}
//             >
//               <KeyboardArrowLeftIcon />
//             </IconButton>
//             <IconButton
//               className="border rounded p-1"
//               onClick={() => table.nextPage()}
//               disabled={next}
//             >
//               <KeyboardArrowRightIcon />
//             </IconButton>
//           </Box>
//           {multipleRowSelection ? (
//             <Box>
//               {Object.keys(rowSelection).length} of Total Rows Selected
//             </Box>
//           ) : null}
//           {pagination && (
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 gap: 1,
//               }}
//             >
//               <Typography>Page </Typography>
//               <Typography sx={{ fontWeight: 600 }}>
//                 {table.getState().pagination.pageIndex + 1} of {pageCount}
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       ) : null}
//     </Box>
//   );
// }

// export function IndeterminateCheckbox({
//   indeterminate,
//   className = "",
//   ...rest
// }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
//   const ref = React.useRef<HTMLInputElement>(null!);

//   React.useEffect(() => {
//     if (typeof indeterminate === "boolean") {
//       ref.current.indeterminate = !rest.checked && indeterminate;
//     }
//   }, [ref, indeterminate]);

//   return (
//     <input
//       type="checkbox"
//       ref={ref}
//       className={className + " cursor-pointer"}
//       {...rest}
//     />
//   );
// }

// export function IndeterminateRadiobox({
//   indeterminate,
//   className = "",
//   ...rest
// }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
//   const ref = useRef<HTMLInputElement>(null);
//   const [checked, setChecked] = useState(rest.checked || false);
//   const theme = useTheme();
//   useEffect(() => {
//     if (typeof indeterminate === "boolean") {
//       if (!rest.checked && indeterminate) {
//         ref.current.indeterminate = true;
//         setChecked(false);
//       } else {
//         ref.current.indeterminate = false;
//         setChecked(rest.checked || false);
//       }
//     }
//   }, [indeterminate, rest.checked]);

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (!indeterminate) {
//       setChecked(event.target.checked);
//     }
//     if (rest.onChange) {
//       rest.onChange(event);
//     }
//   };

//   return (
//     <FormControlLabel
//       control={
//         <Radio
//           inputRef={ref}
//           checked={checked}
//           onChange={handleInputChange}
//           sx={{
//             "& .MuiSvgIcon-root": {
//               color: indeterminate
//                 ? theme.palette.primary[1100]
//                 : theme.palette.primary[1100],
//             },
//           }}
//         />
//       }
//       label={rest.label}
//       className={className + " cursor-pointer"}
//     />
//   );
// }
