// import React, { useEffect, useState } from "react";
// import { Box, Typography, useTheme } from "@mui/material";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import ReceiptTable from "components/Table/TanstackTable";
// import { ColumnDef, PaginationState } from "@tanstack/react-table";
// import {
//     useGetSchemeFinalizationSummary,
//   } from "services/MutualFundSetup/MutualFundSetupServices";
// import { Empty } from "antd";

// type MutualFundSetup = {
//     boid: string;
//     name: string;
//     unit_held: number;
//     phone_number: string;
//     total_amount: number;
//     amount: number;  
//   };
  
// const PrimarySchemeDetails: React.FC = () => {

// const theme = useTheme();
// const [next, setNext] = useState<boolean>(false);
// const [prev, setPrev] = useState<boolean>(false);
// const [finalizedData, setFinalizedData] = useState([]);
// const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

// const { data: FinalizeSummaryData } = useGetSchemeFinalizationSummary(
//     pagination.pageIndex + 1
//   );

// const totalPageCount = FinalizeSummaryData?.responseData?.count / 10;

// useEffect(() => {
//     setFinalizedData(FinalizeSummaryData?.responseData?.results ?? []);

//     if(FinalizeSummaryData?.responseData?.next === null){
//         setNext(true);
//     }else {
//         setNext(false);
//     }
//     if(FinalizeSummaryData?.responseData?.previous === null){
//         setPrev(true);
//     } else {
//         setPrev(false);
//     }
// }, [FinalizeSummaryData]);

// console.log("finalizedData", finalizedData);

// const SchemeFinalizationTableHeader: ColumnDef<MutualFundSetup>[] = [
//     {
//       header: "BOID",
//       accessorKey: "boid",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//             {data.row.original.boid}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Name",
//       accessorKey: "name",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//             {data.row.original.name}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Unit Held",
//       accessorKey: "unit_held",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//             {data.row.original.unit_held}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Phone Number",
//       accessorKey: "phone_number",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//             {data.row.original.phone_number}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Total Amount",
//       accessorKey: "total_amount",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//             {data.row.original.total_amount}
//           </Typography>
//         );
//       },
//     },
//     {
//       header: "Actions",
//       accessorKey: "amount",
//       cell: (data) => {
//         return (
//           <Typography sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}>
//             {data.row.original.amount}
//           </Typography>
//         );
//       },
//     },
//   ];

//   return (
//     <>
//       <Box>
//         <HeaderDesc title="Scheme Summary" />
//         <Box sx={{
//             mt: 1.5, 
//             width: "80%",
//             display: "grid",
//             gridTemplateColumns: "repeat(3, 1fr)",
//             gap: "10px",
//             marginBottom: "20px",
//             fontFamily: "",
//         }}>
//         <Box>
//           <Typography sx={{ fontSize: "15px", color: theme.palette.grey[500] }}>
//             Scheme Name
//           </Typography>
//           <Typography sx={{ fontWeight: 500 }}>NAVYA GROWTH FUND</Typography>
//         </Box>
//         <Box>
//           <Typography sx={{ fontSize: "15px", color: theme.palette.grey[500] }}>
//             Scheme Number
//           </Typography>
//           <Typography sx={{ fontWeight: 500 }}>1220</Typography>
//         </Box>
//         <Box>
//           <Typography sx={{ fontSize: "15px", color: theme.palette.grey[500] }}>
//             Scheme Type
//           </Typography>
//           <Typography sx={{ fontWeight: 500 }}>Close-Ended</Typography>
//         </Box>
//         <Box>
//           <Typography sx={{ fontSize: "15px", color: theme.palette.grey[500] }}>
//             Maturity Date
//           </Typography>
//           <Typography sx={{ fontWeight: 500 }}>01/01/2025</Typography>
//         </Box>
//         <Box>
//           <Typography sx={{ fontSize: "15px", color: theme.palette.grey[500] }}>
//             NAV Calculation
//           </Typography>
//           <Typography sx={{ fontWeight: 500 }}>Weekly</Typography>
//         </Box>
//         <Box>
//           <Typography sx={{ fontSize: "15px", color: theme.palette.grey[500] }}>
//             Authorized Capital
//           </Typography>
//           <Typography sx={{ fontWeight: 500 }}>10,000,000</Typography>
//         </Box>
//         <Box>
//           <Typography sx={{ fontSize: "15px", color: theme.palette.grey[500] }}>
//             Scheme Size
//           </Typography>
//           <Typography sx={{ fontWeight: 500 }}>15,000,000</Typography>
//         </Box>
//         <Box>
//           <Typography sx={{ fontSize: "15px", color: theme.palette.grey[500] }}>
//             Allotment Date
//           </Typography>
//           <Typography sx={{ fontWeight: 500 }}>01/01/2025</Typography>
//         </Box>
//         <Box>
//           <Typography sx={{ fontSize: "15px", color: theme.palette.grey[500] }}>
//             Allotted Capital
//           </Typography>
//           <Typography sx={{ fontWeight: 500 }}>850,000,000</Typography>
//         </Box>
//         <Box>
//           <Typography sx={{ fontSize: "15px", color: theme.palette.grey[500] }}>
//             Total Subscribed Units
//           </Typography>
//           <Typography sx={{ fontWeight: 500 }}>850,000,000</Typography>
//         </Box>
//         <Box>
//           <Typography sx={{ fontSize: "15px", color: theme.palette.grey[500] }}>
//             Number of Shareholders
//           </Typography>
//           <Typography sx={{ fontWeight: 500 }}>34,500</Typography>
//         </Box>
//         </Box>

//         <Box>
//           <HeaderDesc title="Shareholders" />
//           {finalizedData?.length === 0 ? (
//           <Box sx={{width:'80%'}}>
//             <ReceiptTable
//             columns={SchemeFinalizationTableHeader}
//             data={[]}
//             />
//              <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 ml: { md: 5, lg: 20 },
//                 // mt: 5,
//               }}
//             >
//               <Empty
//                 imageStyle={{ height: 150, width: 150 }}
//                 description="No Data Available"
//               />
//             </Box> 
//           </Box>  
//             ) : (
//           <ReceiptTable
//             columns={SchemeFinalizationTableHeader}
//             data={finalizedData ?? []}
//             pagination={pagination}
//             setPagination={setPagination}
//             next={next}
//             prev={prev}
//             pageCount={totalPageCount}
//             />
//         )}

           
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default PrimarySchemeDetails;
