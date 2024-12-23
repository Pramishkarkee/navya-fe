// import React, { useState } from "react";
// import { Box, Typography } from "@mui/material";
// import { ColumnDef } from "@tanstack/react-table";
// import { Visibility } from "@mui/icons-material";
// import { colorTokens } from "../../theme";

// type InterestCollectionTableHeaders = {
//     id: number,
//     intrest_name: string,
//     deposit_amount: string,
//     interest_rate: number,
//     interest_due: string,

//     value_per_unit: string,
//     applied_units: string,
//     maturity_date: string,

// };

// const calculateInterestAmount = (depositAmount: string, interestRate: number) => {
//     const principal = parseFloat(depositAmount);
//     const rate = parseFloat(interestRate.toString());
//     const interestAmount = principal * (rate / 100);
//     return interestAmount.toFixed(2);
// };

// export const InterestCollectionList: ColumnDef<InterestCollectionTableHeaders>[] = [

//     {
//         header: "ID",
//         accessorKey: "id",
//         cell: (data) => {
//             return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.id}</Typography>;
//         },
//     },

//     {
//         header: " Name",
//         accessorKey: "intrest_name",
//         cell: (data) => {
//             return (
//                 <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.intrest_name}</Typography>
//             );
//         },
//     },
//     {
//         header: "Deposit Amount",
//         accessorKey: "deposit_amount",
//         cell: (data) => {
//             return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.deposit_amount}</Typography>;
//         },
//     },
//     {
//         header: "Interest Rate",
//         accessorKey: "interest_rate",
//         cell: (data) => {
//             return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.interest_rate}</Typography>;
//         },
//     },
//     {
//         header: "Interest Due",
//         accessorKey: "interest_due",
//         cell: (data) => {
//             const depositAmount = data.row.original.deposit_amount;
//             const interestRate = data.row.original.interest_rate;
//             const interestAmount = calculateInterestAmount(depositAmount, interestRate);
//             return (

//                 <Typography sx={{ fontSize: "0.85rem" }}>{interestAmount}</Typography>
//             );
//         },
//     },

//     {
//         header: "Maturity Date",
//         accessorKey: "maturity_date",
//         cell: (data) => {
//             return <Typography sx={{ fontSize: "0.85rem" }}>{data.row.original.maturity_date}</Typography>;
//         },
//     },

//     {
//         header: "Actions",
//         accessorKey: "actions",
//         cell: (data) => {
//             const [open, setOpen] = useState(false);
//             const handleView = () => {
//                 setOpen(true);
//             };
//             return (
//                 <>
//                     <Box>

//                         <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>

//                             <Box
//                                 onClick={handleView}
//                                 sx={{
//                                     display: "flex",
//                                     flexDirection: "row",
//                                     alignItems: "center",
//                                     gap: 0.6,
//                                     color: colorTokens.mainColor[1100],
//                                     "&:hover": {
//                                         textDecoration: "underline",
//                                         cursor: "pointer",
//                                     },
//                                 }}
//                             >
//                                 <Visibility sx={{ fontSize: "0.9rem" }} />
//                                 <Typography sx={{ fontSize: "1rem" }}>View Details</Typography>
//                             </Box>

//                         </Box>
//                     </Box>
//                 </>
//             );
//         },
//     },
// ];
