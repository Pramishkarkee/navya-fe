import { useCallback, useEffect, useState } from "react";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import RedemptionReceiptTable from "components/Table/RedemptionReceiptTable";
import { useGetSipInstallmentListApproved } from "services/SIP Payment/sipPaymentServices";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import TypographyLabel from "components/InputLabel/TypographyLabel";

interface IFormInput {
  distributionCenter: string;
  schemeName: string;
  radioValue: string;
}
type OnlineSIPPayment = {
  regNo: number;
  interval: number;
  actionDate: string;
  payment_status: string;
  applied_unit: number;
  payment_date: string;
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const UnitRedemptionTxnReceipts = () => {
  const theme = useTheme();
  const [tableData, setTableData] = useState([]);

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [boid, setBoid] = useState("");

  const {
    data: onlineSIPPaymentDataApproved,
    isSuccess: onlineSIPPaymentDataSuccess,
    refetch
  } = useGetSipInstallmentListApproved(pagination.pageIndex + 1, boid);

  const totalPage = Math.ceil(onlineSIPPaymentDataApproved?.count / 10);

  const { handleSubmit, control } = useForm<IFormInput>({
    defaultValues: {
      distributionCenter: "Navya Advisors",
      schemeName: "Navya Large Cap Fund",
      radioValue: "Purchase",
    },
  });

  useEffect(() => {
    if (onlineSIPPaymentDataApproved?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (onlineSIPPaymentDataApproved?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [onlineSIPPaymentDataApproved, onlineSIPPaymentDataSuccess]);

  useEffect(() => {}, [pagination]);

  useEffect(() => {
    if (onlineSIPPaymentDataSuccess) {
      setTableData(onlineSIPPaymentDataApproved?.results?.data);
      setNext(onlineSIPPaymentDataApproved?.next === null);
      setPrev(onlineSIPPaymentDataApproved?.previous === null);
    }
  }, [onlineSIPPaymentDataApproved, onlineSIPPaymentDataSuccess]);

  const OnlineSIPPaymentHeaders: ColumnDef<OnlineSIPPayment>[] = [
    {
      header: "S.No",
      accessorKey: "SN",
      cell: (data) => {
        return (
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
              {data.row.index + 1}
            </Typography>
          </Box>
        );
      },
    },
    {
      header: "SIP Registration No.",
      size: 1,
      accessorKey: "regNo",
      cell: (data) => {
        return (
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
              {data.row.original.regNo}
            </Typography>
          </Box>
        );
      },
    },
    {
      header: "Installment No.",
      size: 1,
      accessorKey: "interval",
      cell: (data) => {
        return (
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
              {data.row.original.interval}
            </Typography>
          </Box>
        );
      },
    },
    {
      header: "Applied Units",
      // size: 1,
      accessorKey: "applied_unit",
      cell: (data) => {
        return (
          <Box>
            <Typography
              textAlign="right"
              width="40%"
              sx={{ fontSize: "14px", fontWeight: "400" }}
            >
              {data.row.original.applied_unit}
            </Typography>
          </Box>
        );
      },
    },
    {
      header: "Payment Date",
      accessorKey: "payment_data",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data?.row?.original?.payment_date.split("T")[0]}
          </Typography>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "payment_status",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.payment_status}
          </Typography>
        );
      },
    },
  ];

  const debounceSetBoid = useCallback(
    debounce((value) => {
      setBoid(value);
    }, 500),
    [boid]
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(() => {})}
      sx={{ width: { xs: "100%", sm: "100%", md: "100%", lg: "90%" } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <DistributionSchemeField
            control={control}
            label1="Distribution Center"
          />
        </Box>
        <Box sx={{ width: { lg: "30%", md: "50%" } }}>
          <TypographyLabel title="Enter BOID" />
          <TextField
            size="small"
            placeholder="Search..."
            fullWidth
            // value={boid}
            onChange={(e) => debounceSetBoid(e.target.value)}
            // onChange={handleChange}
          />
        </Box>

        {tableData.length > 0 ? (
          <Box
            sx={{
              mt: 2,
              width: { xs: "100%", sm: "100%", md: "110%", lg: "120%" },
            }}
          >
            <RedemptionReceiptTable
              columns={OnlineSIPPaymentHeaders}
              data={tableData}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPage}
            />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <RedemptionReceiptTable
              columns={OnlineSIPPaymentHeaders}
              data={[]}
            />
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                marginTop: "30px",
                marginLeft: "40px",
              }}
            >
              <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} />
              <Typography>No Details available.</Typography>
              <Typography
              onClick= {() =>  {
                setBoid("");
                return(refetch())}}
                sx={{
                  color: theme.palette.primary[700],
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset Filters
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UnitRedemptionTxnReceipts;

// import { useCallback, useEffect, useState } from "react";
// import { Box,  TextField,  Typography, useTheme } from "@mui/material";
// import { useForm } from "react-hook-form";
// import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
// // import RoundedButton from "components/Button/Button";
// import RedemptionReceiptTable from "components/Table/RedemptionReceiptTable";
// // import { UnitRedemptionTransactionReceiptHeader } from "constants/UnitTransactionReceipt/UnitRedemptionTransactionReceiptHeader";
// import {
//   // useGetUnitRedemptionReceipts,
//   useGetSipInstallmentListApproved
//   // useGetUnitRedemptionReceiptsSearch,
// } from "services/SIP Payment/sipPaymentServices";
// import { ColumnDef, PaginationState } from "@tanstack/react-table";
// // import ExportButton from "components/Button/ExportButton";
// import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import RoundedButton from "components/Button/Button";

// interface IFormInput {
//   distributionCenter: string;
//   schemeName: string;
//   radioValue: string;
// }
// type OnlineSIPPayment = {
//   regNo: number;
//   interval: number;
//   actionDate: string;
//   payment_status: string;
//   applied_unit: number;
//   payment_date: string;
//   // sipAmt: string;
// };

// const debounce = (func, delay) => {
//   let timeoutId;
//   return (...args) => {
//       if (timeoutId) clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//           func(...args);
//       }, delay);
//   };
// };

// const UnitRedemptionTxnReceipts = () => {
//   const theme = useTheme();
//   const [tableData, setTableData] = useState([]);
//   // const [filteredListData, setFilteredListData] = useState<any[]>([]);
//   // const [boidNumber, setBoidNumber] = useState("");

//   const [next, setNext] = useState<boolean>();
//   const [prev, setPrev] = useState<boolean>();
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const [boid, setBoid] = useState('');

//   // const BASE_URL = import.meta.env.VITE_BASE_URL;

//   const {
//     data: onlineSIPPaymentDataApproved,
//     isSuccess: onlineSIPPaymentDataSuccess,
//     // isError: unitPurchaseReceiptsError,
//     // refetch: unitPurchaseReceiptsRefetch,
//   } = useGetSipInstallmentListApproved(pagination.pageIndex + 1 , boid);

//   // const {
//   //   data: unitRedemptionReceiptsSearchData,
//   //   isSuccess: unitRedemptionReceiptsSearchSuccess,
//   //   refetch: refetchUnitRedemptionReceiptsSearch,
//   // } = useGetUnitRedemptionReceiptsSearch(boidNumber);

//   const totalPage = Math.ceil(onlineSIPPaymentDataApproved?.count / 10);

//   const { handleSubmit, control , setValue , register} = useForm<IFormInput>({
//     defaultValues: {
//       distributionCenter: "Navya Advisors",
//       schemeName: "NAVYA LARGE CAP FUND",
//       radioValue: "Purchase",
//     },
//   });

//   // useEffect(() => {
//   //   if (unitPurchaseReceiptSuccess) {
//   //     setSnackbarOpen(true);
//   //     setMessage("Unit Purchase Authorized Successfully");
//   //   }
//   //   if (unitPurchaseReceiptsError) {
//   //     setSnackbarErrorOpen(true);
//   //     setErrorMsg("Error in authorizing unit purchase.");
//   //   }
//   // }, [unitPurchaseReceiptSuccess, unitPurchaseReceiptsError, unitPurchaseReceiptData]);

//   useEffect(() => {
//     if (onlineSIPPaymentDataApproved?.next === null) {
//       setNext(true);
//     } else {
//       setNext(false);
//     }
//     if (onlineSIPPaymentDataApproved?.previous === null) {
//       setPrev(true);
//     } else {
//       setPrev(false);
//     }
//   }, [onlineSIPPaymentDataApproved, onlineSIPPaymentDataSuccess]);

//   useEffect(() => {
//     // unitPurchaseReceiptsRefetch();
//   }, [pagination]);

//   useEffect(() => {
//     if (onlineSIPPaymentDataSuccess) {
//       setTableData(onlineSIPPaymentDataApproved?.results?.data);
//       setNext(onlineSIPPaymentDataApproved?.next === null);
//       setPrev(onlineSIPPaymentDataApproved?.previous === null);
//     }
//   }, [onlineSIPPaymentDataApproved, onlineSIPPaymentDataSuccess]);

//   // useEffect(() => {
//   //   if (boidNumber) {
//   //     handleSearch();
//   //   } else {
//   //     refetchUnitRedemptionReceiptsSearch();
//   //   }
//   // }, [boidNumber]);

//   // useEffect(() => {
//   //   if (unitRedemptionReceiptsSearchSuccess) {
//   //     setFilteredListData(unitRedemptionReceiptsSearchData?.results ?? []);
//   //   } else {
//   //     setFilteredListData(unitRedemptionTxnReceiptData?.results ?? []);
//   //   }
//   // }, [
//   //   unitRedemptionReceiptsSearchData,
//   //   unitRedemptionReceiptsSearchSuccess,
//   //   unitRedemptionTxnReceiptData,
//   // ]);

//   // useEffect(() => {
//   //   const filteredData = boidNumber
//   //     ? filteredListData.filter((row) => row.boid_number === boidNumber)
//   //     : filteredListData;

//   //   setTableData(filteredData);
//   // }, [filteredListData, boidNumber]);

//   // const handleSearch = async () => {
//   //   if (boidNumber) {
//   //     try {
//   //       await refetchUnitRedemptionReceiptsSearch();
//   //     } catch (error) {
//   //       console.error("Error fetching search data:", error);
//   //     }
//   //   }
//   // };
//   // const handleReset = () => {
//   //   setBoidNumber("");
//   //   setFilteredListData(unitRedemptionReceiptsSearchData?.results ?? []);

//   // }

//   const OnlineSIPPaymentHeaders: ColumnDef<OnlineSIPPayment>[] =
//   [
//     // {
//     //   id: "select",
//     //   header: ({ table }) => (
//     //     <IndeterminateCheckbox
//     //       {...{
//     //         checked: table.getIsAllRowsSelected(),
//     //         indeterminate: table.getIsSomeRowsSelected(),
//     //         onChange: table.getToggleAllRowsSelectedHandler(),
//     //       }}
//     //     />
//     //   ),
//     //   cell: ({ row }) => (
//     //     <div className="px-1">
//     //       <IndeterminateCheckbox
//     //         {...{
//     //           checked: row.getIsSelected(),
//     //           disabled: !row.getCanSelect(),
//     //           indeterminate: row.getIsSomeSelected(),
//     //           onChange: row.getToggleSelectedHandler(),
//     //         }}
//     //       />
//     //     </div>
//     //   ),
//     // },
//     {
//       header: "S.No",
//       accessorKey: "SN",
//       cell: (data) => {
//         return (
//           <Box>
//             <Typography>{data.row.index + 1}</Typography>
//           </Box>
//         );
//       },
//     },
//     {
//       header: "SIP Registration No.",
//       size: 1,
//       accessorKey: "regNo",
//       cell: (data) => {
//         return (
//           <Box>
//             <Typography>{data.row.original.regNo}</Typography>
//           </Box>
//         );
//       },
//     },
//     {
//       header: "Installment No.",
//       size: 1,
//       accessorKey: "interval",
//       cell: (data) => {
//         return (
//           <Box>
//             <Typography>{data.row.original.interval}</Typography>
//           </Box>
//         );
//       },
//     },
//     {
//       header: "Applied Units",
//       // size: 1,
//       accessorKey: "applied_unit",
//       cell: (data) => {
//         return (
//           <Box>
//             <Typography textAlign="right" width="40%">
//               {data.row.original.applied_unit}
//             </Typography>
//           </Box>
//         );
//       },
//     },
//     {
//       header: "Payment Date",
//       accessorKey: "payment_data",
//       cell: (data) => {
//         return <Typography>{data?.row?.original?.payment_date.split('T')[0]}</Typography>;
//       },
//     },
//     {
//       header: "Status",
//       accessorKey: "payment_status",
//       cell: (data) => {
//         return <Typography>{data.row.original.payment_status}</Typography>;
//       },
//     },
//   ];

// //   const debouncesetBoid = useCallback(
// //     debounce((value) => {
// //         setBoid(value);
// //     }, 500),
// //     []
// // );

// const handleSearch = (data) => {
//   setBoid(data.id || "");
// };

// const debounceSetBoid = useCallback(debounce((value) => {
//   setBoid(value);
//   // setValue("boid", value);
// }, 500), [setValue]);

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit(() => { })}
//       sx={{ width: { xs: "100%", sm: "100%", md: "100%", lg: "90%" } }}
//     >
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//         <Box>
//           <DistributionSchemeField
//             control={control}
//             label1="Distribution Center"
//           />
//         </Box>
//         <Box sx={{ width: { lg: "30%", md: "50%" } }}>
//             <TypographyLabel title="Enter BOID" />
//             <TextField
//             // {...register("boid")}
//               size="small"
//               placeholder="Search..."
//               fullWidth
//               value={boid}
//               onChange={(e) => debounceSetBoid(e.target.value)}
//               onClick={handleSubmit(handleSearch)}

//             />
//           </Box>
//           {/* <Box sx={{}}>
//             <RoundedButton title1="Search" />
//           </Box> */}
//         {/* <Box>
//           <OwnerInformation dpOptions={BankOptions} control={control} />
//         </Box> */}
//         {/* <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           <Box>
//             <Typography sx={{ fontWeight: 500 }}>Request Type</Typography>
//           </Box>
//           <Box>
//             <RadioButtons control={control} />
//           </Box>
//         </Box> */}

//         {/* <Box sx={{ width: "100%" }}>
//           <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
//             Enter BOID to search
//           </Typography>
//           <TextField
//             size="small"
//             placeholder="BOID Number"
//             value={boidNumber}
//             // onClick={handleSearch}
//             onChange={(e) => {
//               setBoidNumber(e.target.value);
//             }}
//           />
//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <RoundedButton title1="Search" onClick1={handleSearch} />
//             <Box sx={{ display: "flex" }}>
//               <ExportButton
//                 boidNumber={boidNumber}
//                 exportUrl={`${BASE_URL}/sip-up/api/v1/unit-purchase/reedm-list/`}
//                 fileName={`Unit Redemption Transaction Receipts${boidNumber ? ` - ${boidNumber}` : ""
//                   }.csv`}
//               />
//             </Box>
//           </Box>
//         </Box> */}
//         {/* {tableData.length > 0 || filteredListData.length > 0 ? ( */}
//         {tableData.length > 0 ? (
//           <Box
//             sx={{ mt:2 , width: { xs: "100%", sm: "100%", md: "110%", lg: "120%" } }}
//           >
//             <RedemptionReceiptTable
//               columns={OnlineSIPPaymentHeaders}
//               data={tableData}
//               pagination={pagination}
//               setPagination={setPagination}
//               next={next}
//               prev={prev}
//               pageCount={totalPage}
//             />
//           </Box>
//         ) : (
//           <Box sx={{mt:2}}>
//             <RedemptionReceiptTable
//               columns={OnlineSIPPaymentHeaders}
//               data={[]}
//             />
//             <Box
//               sx={{

//                 fontSize: "16px",
//                 fontWeight: 600,
//                 lineHeight: "19px",
//                 color: "#212121",
//                 textAlign: "center",
//                 marginTop: "30px",
//                 marginLeft: "40px",
//               }}
//             >
//               <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} />
//               <Typography>No Details available.</Typography>
//               <Typography
//                 // onClick={handleReset}
//                 sx={{ color: theme.palette.primary[1100], fontWeight: 600, cursor: "pointer" }}
//               >
//                 Reset Filters
//               </Typography>
//             </Box>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default UnitRedemptionTxnReceipts;
