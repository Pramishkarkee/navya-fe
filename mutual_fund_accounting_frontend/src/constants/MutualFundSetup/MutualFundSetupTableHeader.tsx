// import { Delete, Edit } from "@mui/icons-material";
// import { Box, Typography, } from "@mui/material";
// import { ColumnDef } from "@tanstack/react-table";
// // import BankDetailsModal from "components/Modal/BankDetailsModal";
// // import EditModal from "components/Modal/EditModel";
// // import SuccessBar from "components/Snackbar/SuccessBar";
// import { useState } from "react";
// import { colorTokens } from "../../theme";
// import EditSchemeModal from "pages/Parameters Setup/MutualFundAndSchemeSetup/EditMutualFundScheme";
// import { useDeleteMutualSetup } from "services/MutualFundSetup/MutualFundSetupServices";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";
// // import EditStockModal from "EditStockList";


// type MutualFundEntry = {
//     id: number;
//     scheme_name: string;
//     scheme_number: number;
//     scheme_type: string;
//     maturity_date: string;
//     nav_calculation_method: string;
//     scheme_size: number;
//     total_seed_capital: number;
//     allotment_date: string;
//     alloted_capital: number;
// };

// export const MutualFundSetupTableEntryHeader: ColumnDef<MutualFundEntry>[] = [
//     {
//         header: "ID",
//         accessorKey: "id",
//         cell: (data) => {
//             return <Typography>{data?.row?.original?.id}</Typography>;
//         },
//     },
//     {
//         header: "Scheme Name",
//         accessorKey: "scheme_name",
//         cell: (data) => {
//             return <Typography>{data?.row?.original?.scheme_name}</Typography>;
//         },
//     },
//     {
//         header: "Scheme Number",
//         accessorKey: "scheme_number",
//         cell: (data) => {
//             return <Typography >{data?.row?.original?.scheme_number}</Typography>;
//         },
//     },
//     {
//         header: "Scheme Type",
//         accessorKey: "scheme_type",
//         cell: (data) => {
//             return <Typography align="left">{data?.row?.original?.scheme_type}</Typography>;
//         },
//     },
//     {
//         header: "Maturatiy Date",
//         accessorKey: "maturity_date",
//         cell: (data) => {
//             return <Typography align="left">{data?.row?.original?.maturity_date ?? "N/A"}</Typography>;
//         },
//     },
//     {
//         header: "NAV Method",
//         accessorKey: "nav_calculation_method",
//         cell: (data) => {
//             return <Typography align="left" >{data?.row?.original?.nav_calculation_method}</Typography>;
//         },
//     },
//     {
//         header: "Scheme Size",
//         accessorKey: "scheme_size",
//         cell: (data) => {
//             return <Typography>{data?.row?.original?.scheme_size}</Typography>;
//         },
//     },
//     {
//         header: "Seed Capital",
//         accessorKey: "total_seed_capital",
//         cell: (data) => {
//             return <Typography align="left">{data?.row?.original?.total_seed_capital}</Typography>;
//         },
//     },
//     {
//         header: "Allotment Date",
//         accessorKey: "allotment_date",
//         cell: (data) => {
//             return <Typography align="left">{data?.row?.original?.allotment_date}</Typography>;
//         },
//     },
//     {
//         header: "Allotment Capital",
//         accessorKey: "alloted_capital",
//         cell: (data) => {
//             return <Typography align="left">{data?.row?.original?.alloted_capital}</Typography>;
//         },
//     },
//     {
//         header: "Actions",
//         accessorKey: "actions",
//         cell: (data) => {


//             return (
//                 <Box sx={{ display: "flex", justifyContent: "center" }}>
//                     <ActionCell data={data} />
//                 </Box>
//             );
//         }
//     }
// ];

// // eslint-disable-next-line react-refresh/only-export-components
// const ActionCell = ({ data }) => {
//     const [editOpen, setEditOpen] = useState(false);
//     const [successBarOpen, setSuccessBarOpen] = useState(false);
//     const [errorBarOpen, setErrorBarOpen] = useState(false);

//     const { mutate: deleteMutualSetup } = useDeleteMutualSetup(data.row.original.id);

//     const handleDelete = () => {
//         const deleteId = data.row.original.id;
//         deleteMutualSetup(deleteId, {
//             onSuccess: () => {
//                 setSuccessBarOpen(true);
//                 console.log("Deleted successfully!");
//             },
//             onError: (error) => {
//                 setErrorBarOpen(true);
//                 console.error("Failed to delete:", error);
//             },
//         });
//     };
//     const handleEdit = () => {
//         handleSave(data.row.original);
//         setEditOpen(true);
//     };

//     const handleSave = (updatedData: MutualFundEntry) => {
//         console.log("Updated Data:", updatedData);
//     };

//     return (
//         <>
//             <SuccessBar
//                 snackbarOpen={successBarOpen}
//                 setSnackbarOpen={setSuccessBarOpen}
//                 message="Deleted Successfully!"
//             />
//             <ErrorBar
//                 snackbarOpen={errorBarOpen}
//                 setSnackbarOpen={setErrorBarOpen}
//                 message="Failed to Delete!"
//             />
//             <Box>
//                 <EditSchemeModal
//                     open={editOpen}
//                     setOpen={setEditOpen}
//                     data={data.row.original}
//                     onSave={handleSave} />
//                 <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>


//                     <Box
//                         onClick={handleEdit}
//                         sx={{
//                             display: "flex",
//                             flexDirection: "row",
//                             alignItems: "center",
//                             gap: 0.6,
//                             color: colorTokens.mainColor[1100],
//                             "&:hover": {
//                                 cursor: "pointer",
//                             },
//                         }}
//                     >
//                         <Edit sx={{ fontSize: "16px" }} />
//                         <Typography fontSize="13px" fontWeight={600} sx={{ userSelect: "none" }}>
//                             Edit
//                         </Typography>
//                     </Box>

//                     <Box
//                         onClick={handleDelete}
//                         sx={{
//                             display: "flex",
//                             flexDirection: "row",
//                             alignItems: "center",
//                             gap: 0.6,
//                             color: colorTokens.mainColor[1100],
//                             "&:hover": {
//                                 cursor: "pointer",
//                             },
//                         }}
//                     >
//                         <Delete sx={{ fontSize: "16px" }} />
//                         <Typography fontSize="13px" fontWeight={600} sx={{ userSelect: "none" }}>
//                             Delete
//                         </Typography>
//                     </Box>
//                 </Box>
//             </Box>
//         </>
//     );
// };