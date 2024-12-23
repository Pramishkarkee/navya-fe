// import { Box } from "@mui/material";
// // import ReceiptTable from "components/Table/TanstackTable";
// import  { PostingTable }  from "components/Table/PostingTable";
// import { StockMappingTableListEntryHeader } from "constants/Stock Mapping/StockMappingTableList";
// import SearchText from "components/Button/Search";
// // import DownloadButton from "components/Button/DownloadExcel";
// import {
// //   useGetAllStockMappingList,
//   useGetStockMappingListDate,
// } from "services/Stock Mapping/StockMappingService";
// import { useCallback, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// // import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
// import DateField from "components/DateFilter/DateField";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import dayjs from "dayjs";
// import DateFormatter from "utils/DateFormatter";
// import RoundedButton from "components/Button/Button";
// // import PostingTable  from "components/Table/PostingTable";

// const debounce = (func, delay) => {
//   let timeoutId;
//   return (...args) => {
//     if (timeoutId) clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => {
//       func(...args);
//     }, delay);
//   };
// };
// const DateFormatterUnit = {
//   format: (dateString: string): string => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day
//       }`;
//   },
// };
// const schema = yup
//   .object({
//     startDate: yup.object().required(),
//     endDate: yup.object().required(),
//     id: yup.number(),
//   })
//   .required();

  

// const StockList = () =>  {
//   const { control, handleSubmit, register, setValue } = useForm({
//     defaultValues: {
//       startDate: dayjs(),
//       endDate: dayjs(),
//     },
//     resolver: yupResolver(schema),
//   });

// //   const theme = useTheme();
//   const [id, setId] = useState("");
//   const [displayData, setDisplayData] = useState([]);
//   const [loadClicked, setLoadClicked] = useState(false);
//   const [errorMsgs, setErrorMsgs] = useState("");
//   const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);

//   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
//   const [next, setNext] = useState(false);
//   const [prev, setPrev] = useState(false);

//   const [selectedRows, setSelectedRows] = useState([]);


//   const [searchData, setSearchData] = useState({
//     from_date: "",
//     to_date: "",
//   });

// //   const {
// //     data: stockMappingData,
// //     // isSuccess: stockMappingDataSuccess,
// //     refetch: refetchStockMapping,
// //   } = useGetAllStockMappingList();
//   // const { data: stockMappingDataId, isSuccess: stockMappingDataIdSuccess } = useStocMappingListID(id);
//   const {
//     data: stockMappingListDataByDate,
//     isSuccess: stockMappingListByDateSuccess,
//   } = useGetStockMappingListDate(
//     searchData?.from_date,
//     searchData?.to_date,
//     pagination.pageIndex + 1,
//     id
//   );

//   const totalPageCount = Math.ceil(
//     stockMappingListDataByDate?.responseData?.count / 10
//   );

//   const handleLoad = (data) => {
//     setId(data.id || "");
//     if (data?.startDate && data?.endDate) {
//       const fromDate = new Date(data?.startDate);
//       const toDate = new Date(data?.endDate);

//       const formattedFromDate = DateFormatter.format(fromDate.toISOString());
//       const formattedToDate = DateFormatterUnit.format(toDate.toISOString());

//       if (formattedFromDate && formattedToDate) {
//         setSearchData({
//           from_date: formattedFromDate,
//           to_date: formattedToDate,
//         });
//       }
//       setLoadClicked(true);
//     } else {
//       setErrorMsgs("Both start and end dates must be selected.");
//       setSnackbarErrorOpen(true);
//     }
//   };

//   useEffect(() => {
//     if (stockMappingListDataByDate?.responseData?.next === null) {
//       setNext(true);
//     } else {
//       setNext(false);
//     }
//     if (stockMappingListDataByDate?.responseData?.previous === null) {
//       setPrev(true);
//     } else {
//       setPrev(false);
//     }
//   }, [stockMappingListDataByDate]);

//   useEffect(() => {
//     if (id) {
//       setDisplayData(
//         stockMappingListDataByDate
//           ? stockMappingListDataByDate?.responseData?.results
//           : []
//       );
//     } else {
//       setDisplayData(stockMappingListDataByDate?.responseData?.results || []);
//     }
//   }, [id, stockMappingListDataByDate]);

//   useEffect(() => {
//     // refetchStockMapping();
//     if (stockMappingListByDateSuccess && loadClicked) {
//       setDisplayData(stockMappingListDataByDate?.responseData?.results ?? []);

//       if (
//         !stockMappingListDataByDate?.responseData?.results ||
//         stockMappingListDataByDate?.responseData?.results.length === 0
//       ) {
//         setErrorMsgs("There is no Unit List Available for the given Date.");
//         setSnackbarErrorOpen(true);
//       }
//     }
//   }, [
//     stockMappingListByDateSuccess,
//     loadClicked,
//     stockMappingListDataByDate,
//     searchData,
//     // refetchStockMapping,
//   ]);
//   // const handleSearch = (data) => {
//   //     setId(data.id || "");
//   // };

// //   const handleReset = () => {
// //     setSearchData({
// //       from_date: "",
// //       to_date: "",
// //     });
// //     setId("");
// //     setDisplayData(stockMappingData);
// //   };

// //   const handleDownloadExcel = () => {
// //     console.log("Implement logic to download Excel file");
// //   };

//   const debouncedSetId = useCallback(
//     debounce((value) => {
//       setId(value);
//       setValue("id", value);
//     }, 500),
//     [setValue]
//   );

//   const handleAuthorize = (data) => {
//     const tempData = selectedRows?.map((item) => item?.id);
//     // const tempIntervals = selectedRows?.map((item) => item.interval)

//     if (tempData.length === 0) {
//         console.log('no data selected')
//     //   setSnackbarErrorOpen(true);
//     //   setErrorMsg("You must select at least one SIP");
//       return;
//     }
// }

//   return (
//     <Box
//       sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 1 }}
//     >
//       <Box sx={{ display: "flex", alignItems: "center" }}>
//         <Box
//           component="form"
//           onSubmit={handleSubmit(handleLoad)}
//           sx={{ width: "100%", display: "flex", gap: 3, marginTop: 1, ml: -1 }}
//         >
//           <SearchText
//             title="Search"
//             {...register("id")}
//             onChange={(e) => debouncedSetId(e.target.value)}
//             onClick={handleSubmit(handleLoad)}
//           />
//           <Box sx={{ mt: -2 }}>
//             <DateField
//               control={control}
//               dateLabel1="Date (From)"
//               dateLabel2="Date (To)"
//             />
//           </Box>
//           <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
//         </Box>

//       </Box>
//       <Box>
        
//           <Box sx={{ width: { lg: "120%" } }}>
//             <PostingTable
//               data={displayData}
//               columns={StockMappingTableListEntryHeader}
//               setSelectedRows={setSelectedRows}
//               pagination={pagination}
//               setPagination={setPagination}
//               next={next}
//               prev={prev}
//               pageCount={totalPageCount}
//             />
           
//           </Box>
     
//       </Box>
//     </Box>
//   );
// }

// export default StockList;


