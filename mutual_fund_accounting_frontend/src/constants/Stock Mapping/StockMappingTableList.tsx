// /* eslint-disable react-hooks/rules-of-hooks */
// import { Edit } from "@mui/icons-material";
// import { Box, Button, Modal, Typography, useTheme } from "@mui/material";
// import { ColumnDef } from "@tanstack/react-table";
// // import BankDetailsModal from "components/Modal/BankDetailsModal";
// // import EditModal from "components/Modal/EditModel";
// // import SuccessBar from "components/Snackbar/SuccessBar";
// import { useState } from "react";
// import { colorTokens } from "../../theme";
// import EditStockModal from "pages/Parameters Setup/Stocks/Stock Mapping/EditStockList";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useDeleteStockDetails } from "services/Stock Mapping/StockMappingService";

// // import EditStockModal from "EditStockList";

// type StockMappingEntry = {
//   id: number;
//   symbol: number;
//   stock_name: string;
//   face_value: string;
//   price_per_share: string;
//   stock_description: string;
//   stock_paid_up_capital: string;
//   current_units: number;
//   effective_rate: number;
//   total_investment: number;
// };

// export const StockMappingTableListEntryHeader: ColumnDef<StockMappingEntry>[] =
//   [
//     {
//       header: "ID",
//       accessorKey: "id",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "0.85rem", textAlign: "left" }}>
//             {data?.row?.original?.id}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Symbol",
//       accessorKey: "symbol",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "0.85rem", textAlign: "left" }}>
//             {data?.row?.original?.symbol}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Stock Name",
//       accessorKey: "stock_name",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "0.85rem", textAlign: "left" }}>
//             {data?.row?.original?.stock_name}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Face Value",
//       accessorKey: "face_value",
//       cell: (data) => {
//         return (
//           <Typography
//             sx={{
//               fontSize: "0.85rem",
//               // width: "60%",
//               // display: "flex",
//               // justifyContent: "flex-end",
//             }}
//           >
//             {Number(data?.row?.original?.face_value).toLocaleString()}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Number of Share",
//       accessorKey: "price_per_share",
//       cell: (data) => {
//         return (
//           <Typography
//             sx={{
//               fontSize: "0.85rem",
//               // width: "80%",
//               // display: "flex",
//               // justifyContent: "flex-end",
//             }}
//           >
//             {Number(data?.row?.original?.price_per_share).toLocaleString()}
//           </Typography>
//         );
//       },
//     },
//     // {
//     //   header: "Stock Description",
//     //   accessorKey: "stock_description",
//     //   cell: (data) => {
//     //     return (
//     //       <Typography sx={{ fontSize: "0.85rem", }}>
//     //         {data?.row?.original?.stock_description}
//     //       </Typography>
//     //     );
//     //   },
//     // },
//     {
//       header: "Paid Up Capital",
//       accessorKey: "stock_paid_up_capital",
//       cell: (data) => {
//         return (
//           <Typography
//             sx={{
//               fontSize: "0.85rem",
//               // width: "80%",
//               // display: "flex",
//               // justifyContent: "flex-end",
//             }}
//           >
//             {Number(
//               data?.row?.original?.stock_paid_up_capital
//             ).toLocaleString()}
//           </Typography>
//         );
//       },
//     },
//     // {
//     //   header: "Current Units",
//     //   accessorKey: "current_units",
//     //   cell: (data) => {
//     //     return (
//     //       <Typography
//     //         sx={{
//     //           fontSize: "0.85rem",
//     //           width: "80%",
//     //           display: "flex",
//     //           justifyContent: "flex-end",
//     //         }}
//     //       >
//     //         {Number(data?.row?.original?.current_units).toLocaleString()}
//     //       </Typography>
//     //     );
//     //   },
//     // },
//     // {
//     //   header: "WACC Rate",
//     //   accessorKey: "effective_rate",
//     //   cell: (data) => {
//     //     const effectiveRate = data?.row?.original?.effective_rate || 0;

//     //     return (
//     //       <Typography
//     //         sx={{
//     //           fontSize: "0.85rem",
//     //           width: "80%",
//     //           display: "flex",
//     //           justifyContent: "flex-end",
//     //         }}
//     //       >
//     //         {Number(effectiveRate).toLocaleString()}
//     //       </Typography>
//     //     );
//     //   },
//     // },
//     // {
//     //   header: "Total Investment",
//     //   accessorKey: "total_investment",
//     //   cell: (data) => {
//     //     const totalInvestment = data?.row?.original?.total_investment || 0;

//     //     return (
//     //       <Typography
//     //         sx={{
//     //           fontSize: "0.85rem",
//     //           width: "80%",
//     //           display: "flex",
//     //           justifyContent: "flex-end",
//     //         }}
//     //       >
//     //         {Number(totalInvestment).toLocaleString()}
//     //       </Typography>
//     //     );
//     //   },
//     // },

//     {
//       header: "Actions",
//       accessorKey: "actions",
//       cell: (data) => {
//         const [editOpen, setEditOpen] = useState(false);
//         const theme = useTheme();

//         const handleEdit = () => {
//           setEditOpen(true);
//         };

//         const handleSave = (updatedData: StockMappingEntry) => {
//           console.log("Updated Data:", updatedData);
//         };

//         return (
//           <>
//             <Box sx={{ display: "flex", justifyContent: "center" }}>
//               <EditStockModal
//                 open={editOpen}
//                 setOpen={setEditOpen}
//                 data={data.row.original}
//                 onSave={handleSave}
//               />

//               <Box sx={{ display: "flex", flexDirection: "row" }}>
//                 <Box
//                   onClick={handleEdit}
//                   sx={{
//                     display: "flex",
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: 0.2,
//                     // color: colorTokens.mainColor[1100],
//                     "&:hover": {
//                       cursor: "pointer",
//                     },
//                   }}
//                 >
//                   <Edit
//                     sx={{
//                       fontSize: "16px",
//                       color: theme.palette.grey[600],
//                       "&:hover": {
//                         color: theme.palette.grey[900],
//                       },
//                     }}
//                   />
//                   <Typography
//                     fontSize="13px"
//                     fontWeight={600}
//                     sx={{ userSelect: "none" }}
//                   >
//                     Edit
//                   </Typography>
//                 </Box>
//                 <ActionCell data={data} />
//               </Box>
//             </Box>
//           </>
//         );
//       },
//     },
//   ];

// const ActionCell = ({ data }) => {
//   const theme = useTheme();
//   const [successBarOpen, setSuccessBarOpen] = useState(false);
//   const [errorBarOpen, setErrorBarOpen] = useState(false);
//   const [successMsgs, setSuccessMsgs] = useState("");

//   const [confirmOpen, setConfirmOpen] = useState(false);

//   const { mutate: deleteStockSetup } = useDeleteStockDetails(
//     data?.row?.original?.id
//   );

//   // const handleDelete = () => {
//   //   const deleteId = data.row.original.id;
//   //   // deleteMarketCap(deleteId, {
//   //   //   onSuccess: () => {
//   //   //     setSuccessBarOpen(true);
//   //   //     console.log("Deleted successfully");
//   //   //   },
//   //   //   onError: (error) => {
//   //   //     setErrorBarOpen(true);
//   //   //     console.error("Failed to delete:", error);
//   //   //   },
//   //   // });
//   // };

//   const handleDelete = () => {
//     setConfirmOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     const stock_setup = data?.row?.original?.stock_setup;
//     deleteStockSetup(stock_setup, {
//       onSuccess: () => {
//         setConfirmOpen(false);
//         setSuccessBarOpen(true);
//         setSuccessMsgs(
//           `${data?.row?.original.stock_setup} Deleted successfully`
//         );
//       },
//       onError: (error) => {
//         setErrorBarOpen(true);
//         console.error("Failed to delete:", error);
//       },
//     });
//   };

//   const handleConfirmClose = () => {
//     setConfirmOpen(false);
//   };

//   return (
//     <>
//       <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
//         <SuccessBar
//           snackbarOpen={successBarOpen}
//           setSnackbarOpen={setSuccessBarOpen}
//           message="Deleted Successfully"
//         />
//         <ErrorBar
//           snackbarOpen={errorBarOpen}
//           setSnackbarOpen={setErrorBarOpen}
//           message="Failed to delete"
//         />

//         <Modal open={confirmOpen} onClose={handleConfirmClose}>
//           <Box
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               width: "30%",
//               bgcolor: "background.paper",
//               borderRadius: "8px",
//               p: 4,
//               textAlign: "center",
//             }}
//           >
//             <Typography variant="h6" component="h2">
//               Confirmation
//             </Typography>
//             <Typography sx={{ mt: 2 }}>
//               Are you sure you want to Delete
//               <Typography sx={{ fontWeight: 500 }}>
//                 {data.row.original.symbol}?
//               </Typography>
//             </Typography>
//             <Box
//               sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}
//             >
//               <Button
//                 sx={{
//                   backgroundColor: theme.palette.secondary.main,
//                   "&:hover": {
//                     bgcolor: theme.palette.primary.main,
//                   },
//                 }}
//                 variant="contained"
//                 onClick={() => handleConfirmDelete()}
//               >
//                 Confirm
//               </Button>
//               <Button
//                 sx={{
//                   color: theme.palette.secondary.main,
//                   "&:hover": {
//                     bgcolor: theme.palette.primary.mediumColor,
//                   },
//                 }}
//                 variant="outlined"
//                 onClick={handleConfirmClose}
//               >
//                 Cancel
//               </Button>
//             </Box>
//           </Box>
//         </Modal>

//         <Box
//           onClick={handleDelete}
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             alignItems: "center",
//             gap: 0.2,
//             "&:hover": {
//               // textDecoration: "underline",
//               cursor: "pointer",
//             },
//           }}
//         >
//           <DeleteIcon color="error" sx={{ fontSize: "14px" }} />
//           <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
//             Delete
//           </Typography>
//         </Box>
//       </Box>
//     </>
//   );
// };
