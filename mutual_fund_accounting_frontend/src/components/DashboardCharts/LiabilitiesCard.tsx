import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
} from "@mui/material";
import React from "react";
import { useGetLiabilitiesData } from "services/Dashboard/DashboadServices";

const LiabilitiesCard = () => {
  const theme = useTheme();
  const { data: LiabilitiesData } = useGetLiabilitiesData();

  const totalAmount = LiabilitiesData?.meta?.total_amount || 0;
  const percentageChange = LiabilitiesData?.meta?.percentage_change || 0;
  const changeAmount = LiabilitiesData?.meta?.change || 0;
  const currentLiabilities =
    LiabilitiesData?.responseData?.[0]?.current_liabilities?.[0] || {};
  const nonCurrentLiabilities =
    LiabilitiesData?.responseData?.[0]?.non_current_liabilities || 0;

  const data = {
    title: "Liabilities",
    totalAmount: `NPR ${totalAmount.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`,
    percentageChange: `${percentageChange}% This Month`,
    particulars: [
      {
        label: "Current Liabilities",
        value: `${(
          currentLiabilities.other_current_liabilities +
          currentLiabilities.fee_payables +
          currentLiabilities.provisions
        ).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}`,
        subAssets: [
          {
            label: "Other Current Liabilities",
            value: ` ${
              currentLiabilities.other_current_liabilities?.toLocaleString(
                undefined,
                { maximumFractionDigits: 2, minimumFractionDigits: 2 }
              ) || 0
            }`,
          },
          {
            label: "Fee Payables",
            value: ` ${
              currentLiabilities.fee_payables?.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }) || 0
            }`,
          },
          {
            label: "Provisions",
            value: ` ${
              currentLiabilities.provisions?.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }) || 0
            }`,
          },
        ],
      },
      {
        label: "Non Current Liabilities",
        value: ` ${nonCurrentLiabilities?.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}`,
      },
    ],
  };

  return (
    <Box
      sx={{
        // width: "100%",
        border: "2px solid #D4D4D4",
        borderRadius: "15px",
        p: 2,
        // textAlign: "left",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          // alignItems:'center',
        }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 500,
            // mb: 0.5,
          }}
        >
          {data.title}
        </Typography>

        <Box>
          <Typography
            sx={{
              fontSize: "20px",
              textAlign: "right",
              fontWeight: 500,
              mb: 2,
            }}
          >
            {data.totalAmount}
          </Typography>

          {/* <Typography
            sx={{
              mb: 2,
              textAlign: "right",
              fontSize: "14px",
              color: changeAmount > 0 ? "#16A34A" : 
                     changeAmount < 0 ? "#DC2626" : 
                     "black",
            }}
          >
            {changeAmount > 0
              ? `+${changeAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })} (${data.percentageChange})`
              : `${changeAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })} (${data.percentageChange})`}
          </Typography> */}
        </Box>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableBody>
            {data.particulars.map((item, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell align="left">
                    <Typography>{item.label}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{item.value}</Typography>
                  </TableCell>
                </TableRow>

                {item.subAssets?.map((subItem, subIndex) => (
                  <TableRow key={`${index}-${subIndex}`}>
                    <TableCell align="left" sx={{ pl: 4 }}>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: theme.palette.grey[600],
                        }}
                      >
                        {subItem.label}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: theme.palette.grey[600],
                        }}
                      >
                        {subItem.value}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <Box sx={{ textAlign: "center", mt: 2 }}>
        <Link href="#" variant="body2" color="primary">
          View More
        </Link>
      </Box> */}
    </Box>
  );
};

export default LiabilitiesCard;

// import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Link } from "@mui/material";
// import {useGetAssetAllocationData} from "services/Dashboard/DashboadServices"

// const AssetCard = () => {

//   const { data : AssetAllocationData } = useGetAssetAllocationData();

//   const data = {
//     title: "Assets",
//     totalAmount: "₹ 300,000,000",
//     percentageChange: "+0.23 (1.12%) This Month",
//     particulars: [
//       { label: "Current Assets", value: "₹ 300,000,000" },
//       { label: "Operating Assets", value: "₹ 10,000,000" },
//       { label: "Fixed Assets", value: "₹ 10,000,000" },
//     ],
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 400,
//         width: "100%",
//         border: "1px solid #E0E0E0",
//         borderRadius: 2,
//         p: 2,
//         boxShadow: 2,
//         bgcolor: "white",
//         textAlign: "left",
//       }}
//     >
//       {/* Title */}
//       <Typography variant="subtitle2" color="primary" sx={{ fontWeight: "bold", mb: 1 }}>
//         {data.title}
//       </Typography>

//       {/* Total Amount */}
//       <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//         {data.totalAmount}
//       </Typography>

//       {/* Percentage Change */}
//       <Typography variant="body2" color="green" sx={{ mb: 2 }}>
//         {data.percentageChange}
//       </Typography>

//       {/* Asset Details in Table */}
//       <TableContainer>
//         <Table size="small">
//           <TableBody>
//             {data.particulars.map((item, index) => (
//               <TableRow key={index}>
//                 <TableCell align="left">
//                   <Typography variant="body2" color="textSecondary">
//                     {item.label}
//                   </Typography>
//                 </TableCell>
//                 <TableCell align="right">
//                   <Typography variant="body2" color="textPrimary">
//                     {item.value}
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* View More Link */}
//       <Box sx={{ textAlign: "center", mt: 2 }}>
//         <Link href="#" variant="body2" color="primary">
//           View More
//         </Link>
//       </Box>
//     </Box>
//   );
// };

// export default AssetCard;

// // import React, { useEffect, useState } from "react";
// // import Highcharts from "highcharts";
// // import HighchartsReact from "highcharts-react-official";
// // import { Box, Typography, useTheme } from "@mui/material";
// // import {useGetPayableReceivableData} from "services/Dashboard/DashboadServices"

// // const AssetsCard = () => {
// //   const theme = useTheme();
// //   const [payable, setPayable] = useState(79451.23);
// //   const [receivable, setReceivable] = useState(129451.23);
// //   const totalAmount = payable + receivable;

// //   const { data : PayableReceivablesData } = useGetPayableReceivableData();

// //   useEffect(() => {
// //     if(PayableReceivablesData){
// //       setPayable(PayableReceivablesData?.responseData[0]?.payable);
// //       setReceivable(PayableReceivablesData?.responseData[0]?.receivables);
// //     }
// //   }, [PayableReceivablesData])

// //   return (
// //     <>
// //     <Box sx={{
// //        padding: 2,
// //        borderRadius: "15px",
// //        border: "2px solid #D4D4D4",
// //         width: "100%",
// //     }}>
// //     <Typography
// //             sx={{
// //               fontSize: "20px",
// //               fontWeight: 500,
// //               mb: 0.5,
// //             }}
// //           >
// //            Assets
// //           </Typography>

// //     <Box sx={{
// //       display: "flex",
// //       alignItems: "center",
// //       justifyContent: "center",

// //       }}>

// //     </Box>
// //     </Box>

// //     </>

// //   );
// // };

// // export default AssetsCard;
