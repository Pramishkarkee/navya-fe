import { Box, TextField, Typography, useTheme } from "@mui/material";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import RoundedButton from "components/Button/Button";
import PostingRemarks from "components/PostingRemarks/PostingRemarks";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import PostingTable from "components/Table/PostingTable";
import {
  useGetOnlineUnitPurchaseList,
  useGetOnlineUnitPurchaseSearchList,
  useMutationUnitPurchasePosting,
  useMutationUnitPurchaseRejectPosting,
} from "services/Transaction Management/Unit Purchase/unitPostingServices";

import { UnitPurchasePostingHeader } from "constants/Unit Purchase/UnitPurchasePostingHeaders";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PaginationState } from "@tanstack/react-table";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ExportButton from "components/Button/ExportButton";
import DateField from "components/DateField/DateField";
import dayjs from "dayjs";
import DateFormatter from "utils/DateFormatter";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";


const DateFormatterUnit = {
  format: (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  },
};

interface IFormInput {
  distributionCenter: string;
  schemeName: string;
  postingRemark: string;
  startDate: any;
  endDate: any;
}

const UnitPurchasePosting = () => {
  const theme = useTheme();
  const [selectedRows, setSelectedRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadClicked, setLoadClicked] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredListData, setFilteredListData] = useState<any[]>([]);
  const [boidNumber, setBoidNumber] = useState("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [resetCheckBox, setResetCheckBox] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const schema = yup
    .object({
      distributionCenter: yup.string().required(),
      schemeName: yup.string().required(),
      postingRemark: yup.string(),
      startDate: yup.date().required(),
      endDate: yup.date().required(),
      boidNumber: yup.string().length(16),
    })
    .required();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      distributionCenter: "Navya Advisors",
      schemeName: "Navya Large Cap Fund",
      startDate: dayjs(),
      endDate: dayjs(),
      postingRemark: "",
    },
    resolver: yupResolver(schema) as any,
  });

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  const {
    // data: unitPostingData,
    // isSuccess: unitPostingSuccess,
    mutate: unitPostingMutate,
    // isError: unitPostingError,
  } = useMutationUnitPurchasePosting();

  const {
    // data: unitPostingRejectData,
    // isSuccess: unitPostingRejectSuccess,
    mutate: unitPostingRejectMutate,
    // error: unitPostingRejectError,
  } = useMutationUnitPurchaseRejectPosting();

  const { data: unitPurchaseListData, isSuccess: unitPurchaseListSuccess } =
    useGetOnlineUnitPurchaseList(
      pagination.pageIndex + 1,
      searchData?.from_date,
      searchData?.to_date
    );

  const {
    data: onlineTransactionPostingSearchData,
    isSuccess: onlineTransactionPostingSearchDataSuccess,
    refetch: refetchOnlineTransactionPostingSearchData,
  } = useGetOnlineUnitPurchaseSearchList(boidNumber);

  const totalPage = Math.ceil(
    unitPurchaseListData?.meta?.records / unitPurchaseListData?.meta?.per_page
  );

  const handleLoad = (data: IFormInput) => {
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterUnit.format(toDate.toISOString());

      setSearchData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });

      setLoadClicked(true);
    } else {
      console.log("Both start and end dates must be selected.");
    }
  };

  useEffect(() => {
    if (unitPurchaseListSuccess) {
      setTableData(unitPurchaseListData?.responseData?.results ?? []);
      setNext(unitPurchaseListData?.responseData?.next === null);
      setPrev(unitPurchaseListData?.responseData?.previous === null);
    }
  }, [unitPurchaseListData, unitPurchaseListSuccess]);

  // useEffect(() => {
  //   if (unitPostingSuccess) {
  //     setSnackbarOpen(true);
  //     setMessage("Unit Purchase Authorized Successfully");
  //   }
  //   if (unitPostingError) {
  //     setSnackbarErrorOpen(true);
  //     setErrorMsg("Error in authorizing unit purchase.");
  //   }
  // }, [unitPostingSuccess, unitPostingError, unitPostingData]);

  // useEffect(() => {
  //   if (unitPostingRejectSuccess) {
  //     setSnackbarOpen(true);
  //     setMessage("Unit Purchase Rejected Successfully");
  //     setTableData((prevTableData) =>
  //       prevTableData.filter((row) => !selectedRows.includes(row))
  //     );
  //     setSelectedRows([]);
  //   }

  //   if (unitPostingRejectError) {
  //     setSnackbarErrorOpen(true);
  //     setErrorMsg("Error in rejecting unit purchase.");
  //   }
  // }, [unitPostingRejectSuccess, unitPostingRejectError, unitPostingRejectData]);

  useEffect(() => {
    if (boidNumber) {
      refetchOnlineTransactionPostingSearchData();
    }
  }, [boidNumber, refetchOnlineTransactionPostingSearchData]);

  useEffect(() => {
    if (onlineTransactionPostingSearchDataSuccess) {
      setFilteredListData(
        onlineTransactionPostingSearchData?.responseData?.results ?? []
      );
    } else if (unitPurchaseListSuccess && loadClicked) {
      setFilteredListData(unitPurchaseListData?.responseData?.results ?? []);
    } else {
      setFilteredListData(unitPurchaseListData?.responseData?.results ?? []);
    }
  }, [
    onlineTransactionPostingSearchData,
    onlineTransactionPostingSearchDataSuccess,
    unitPurchaseListData,
    unitPurchaseListSuccess,
    loadClicked,
  ]);

  const handleAuthorize = () => {
    const tempData = selectedRows.map((item) => item.id);

    if (tempData.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsg("You must select at least one SIP");
      return;
    }
    const finalData = {
      id: tempData,
    };
    unitPostingMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        setSnackbarOpen(true);
        setMessage("Unit Purchase Authorized Successfully");
      },
      onError: () => {
        setSnackbarErrorOpen(true);
        setErrorMsg("Error in authorizing unit purchase.");
      },
    });
  };

  const handleReject = () => {
    const tempData = selectedRows.map((item) => item.id);

    if (tempData.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsg("You must select at least one SIP");
      return;
    }

    const finalData = {
      id: tempData,
    };

    // Call the reject mutation
    unitPostingRejectMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        setSnackbarOpen(true);
        setMessage("Unit Purchase Rejected Successfully");
        setTableData((prevTableData) =>
          prevTableData.filter((row) => !selectedRows.includes(row))
        );
        setSelectedRows([]);
      },
      onError: () => {
        setSnackbarErrorOpen(true);
        setErrorMsg("Error in rejecting unit purchase.");
      },
    });

    // Update the table data after rejection
    // setFilteredListData((prevData) =>
    //   prevData.filter(
    //     (row) => !selectedRows.some((selected) => selected.id === row.id)
    //   )
    // );

    // Clear selected rows
    setSelectedRows([]);
  };

  const handleSearch = () => {
    if (boidNumber) {
      refetchOnlineTransactionPostingSearchData();
    }
  };
  const handleReset = () => {
    setTableData(unitPurchaseListData?.responseData?.results ?? []);
    setFilteredListData(unitPurchaseListData?.responseData?.results ?? []);
    setLoadClicked(false);
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setBoidNumber("");
  };
  return (
    <>
      <SuccessBar
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        message={message}
      />
      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsg}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleLoad)}
          sx={{ display: "flex", flexDirection: "column", gap: 0 }}
        >
          <DistributionSchemeField
            distribution={false}
            control={control}
            label1="Distribution Center"
          />

          <Box sx={{ width: "100%", mt: 2 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              Enter BOID Number
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <TextField
                size="small"
                placeholder="BOID Number"
                value={boidNumber}
                onChange={(e) => setBoidNumber(e.target.value)}
              />
              <RoundedButton title1="Search" onClick1={handleSearch} />
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
            />
            <RoundedButton title1="Load" />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <HeaderDesc title="Table Data" />
          <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
            <ExportButton
              boidNumber={boidNumber}
              exportUrl={`${BASE_URL}/sip-up/api/v1/unit-purchase/list/`}
              fileName={`Online Transaction Posting${
                boidNumber ? ` - ${boidNumber}` : ""
              }.csv`}
            />
          </Box>
        </Box>

        {filteredListData.length > 0 ? (
          <PostingTable
            columns={UnitPurchasePostingHeader}
            data={filteredListData}
            setSelectedRows={setSelectedRows}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPage}
            resetSelectionTrigger={resetCheckBox}
          />
        ) : (
          <>
            <PostingTable
              columns={UnitPurchasePostingHeader}
              data={[]}
              setSelectedRows={setSelectedRows}
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
                onClick={handleReset}
                sx={{
                  color: theme.palette.primary[700],
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset Filters
              </Typography>
            </Box>
          </>
        )}
        {selectedRows.length > 0 && (
          <>
            <PostingRemarks control={control} errors={errors} />
            <RoundedButton
              title1="Authorize"
              title2="Reject"
              onClick1={handleSubmit(handleAuthorize)}
              onClick2={handleSubmit(handleReject)}
            />
          </>
        )}
      </Box>
    </>
  );
};

export default UnitPurchasePosting;

// import { Box, TextField, Typography } from "@mui/material";
// import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
// import RoundedButton from "components/Button/Button";
// import PostingRemarks from "components/PostingRemarks/PostingRemarks";
// import { useForm } from "react-hook-form";
// import { useEffect, useState } from "react";
// import PostingTable from "components/Table/PostingTable";
// import {
//   useGetOnlineUnitPurchaseList,
//   useGetOnlineUnitPurchaseSearchList,
//   useMutationUnitPurchasePosting,
// } from "services/Transaction Management/Unit Purchase/unitPostingServices";

// import { UnitPurchasePostingHeader } from "constants/Unit Purchase/UnitPurchasePostingHeaders";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";

// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { PaginationState } from "@tanstack/react-table";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import ExportButton from "components/Button/ExportButton";
// import DateField from "components/DateField/DateField";
// import dayjs from "dayjs";
// import DateFormatter from "utils/DateFormatter";

// interface IFormInput {
//   distributionCenter: string;
//   schemeName: string;
//   postingRemark: string;
// }
// const DateFormatterUnit = {
//   format: (dateString: string): string => {
//     const date = new Date(dateString);
//     const day = date.getDate() ;
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     return `${year}-${month < 10 ? "0" + month : month}-${
//       day < 10 ? "0" + day : day
//     }`;
//   },
// };

// const UnitPurchasePosting = () => {
//   const [selectedRows, setSelectedRows] = useState([]);

//   const [snaackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [loadClicked, setLoadClicked] = useState(false);
//   // const [tableData, setTableData] = useState([]);

//   const [filteredListData, setFilteredListData] = useState<any[]>([]);
//   const [boidNumber, setBoidNumber] = useState("");

//   const [next, setNext] = useState<boolean>();
//   const [prev, setPrev] = useState<boolean>();
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const schema = yup
//     .object({
//       distributionCenter: yup.string().required(),
//       schemeName: yup.string().required(),
//       postingRemark: yup.string().label("Remarks"),
//       startDate: yup.object().required(),
//       endDate: yup.object().required(),
//       // boidNumber : yup.string().length(16),
//     })
//     .required();

//   const {
//     handleSubmit,
//     control,
//     reset,
//     formState: { isSubmitSuccessful, errors },
//   } = useForm({
//     defaultValues: {
//       distributionCenter: "Navya Advisors",
//       schemeName: "NAVYA LARGE CAP FUND",
//       startDate: dayjs(),
//       endDate: dayjs(),
//       postingRemark: "",
//     },
//     resolver: yupResolver(schema),
//   });

//   const [searchData, setSearchData] = useState({
//     from_date: "",
//     to_date: "",
//   });

//   const {
//     data: unitPostingData,
//     isSuccess: unitPostingSuccess,
//     mutate: unitPostingMutate,
//     isError: unitPostingError,
//   } = useMutationUnitPurchasePosting();

//   const {
//     data: unitPurchaseListData,
//     isSuccess: unitPurchaseListSuccess,
//     // refetch: refetchUnitPurchaseListData,
//   } = useGetOnlineUnitPurchaseList(pagination.pageIndex + 1 , searchData?.from_date, searchData?.to_date );

//   console.log(unitPurchaseListData?.results , "...unitPurchaseListData ")

//   const {
//     data: onlineTransactionPostingSearchData,
//     isSuccess: onlineTransactionPostingSearchDataSuccess,
//     refetch: refetchOnlineTransactionPostingSearchData
//   } = useGetOnlineUnitPurchaseSearchList(boidNumber);

//   console.log(onlineTransactionPostingSearchData?.results , "...onlineTransactionPostingSearchData ")

//   const totalPage = Math.ceil(unitPurchaseListData?.count / 10);

//   // const handleSearch = (data: IFormInput) => {
//   //   const filteredData = unitPurchaseListData?.filter(
//   //     (item: any) => item.distribution_center === data.distributionCenter
//   //   );
//   //   setFilteredListData(filteredData ?? []);
//   // };

//   const handleLoad = (data) => {
//     if (data?.startDate && data?.endDate) {
//       const fromDate = new Date(data?.startDate);
//       const toDate = new Date(data?.endDate);

//       const formattedFromDate = DateFormatter.format(fromDate.toISOString());
//       const formattedToDate = DateFormatterUnit.format(
//         toDate.toISOString()
//       );

//       if (formattedFromDate && formattedToDate) {
//         setSearchData({
//           from_date: formattedFromDate,
//           to_date: formattedToDate,
//         });
//       }
//       setLoadClicked(true);
//     } else {
//       // setErrorMsgs("Both start and end dates must be selected.");
//       // setSnackbarErrorOpen(true);
//       console.log("Both start and end dates must be selected.");
//     }
//   };

//   useEffect(() => {
//     // setTableData(unitPurchaseListData?.results ?? []);
//     if (unitPurchaseListData?.next === null) {
//       setNext(true);
//     } else {
//       setNext(false);
//     }
//     if (unitPurchaseListData?.previous === null) {
//       setPrev(true);
//     } else {
//       setPrev(false);
//     }
//   }, [unitPurchaseListData, unitPurchaseListSuccess]);

//   useEffect(() => {
//     if (unitPostingSuccess) {
//       setSnackbarOpen(true);
//       setMessage("Unit Purchase Authorized Successfully");
//     }
//     if (unitPostingError) {
//       setSnackbarErrorOpen(true);
//       setErrorMsg("Error in authorizing unit purchase.");
//     }
//   }, [unitPostingSuccess, unitPostingError, unitPostingData]);

//   useEffect(() => {
//     if (unitPostingError) {
//       setSnackbarErrorOpen(true);
//       setErrorMsg("Error in authorizing unit purchase.");
//     }
//   }, [unitPostingError]);

//   // useEffect(() => {
//   //   if (isSubmitSuccessful) {
//   //     reset();
//   //   }
//   // }, [isSubmitSuccessful, reset]);

//   // useEffect(() => {
//   //   if (boidNumber) {
//   //     handleSearch();
//   //   } else {
//   //     // refetchOnlineTransactionPostingSearchData();
//   //     onlineTransactionPostingSearchData
//   //   }
//   // }, [boidNumber, onlineTransactionPostingSearchData]);

//   // useEffect(() => {
//   //   refetchUnitPurchaseListData();
//   //   if (unitPurchaseListSuccess && loadClicked) {
//   //     setTableData(unitPostingData?.results ?? []);

//   //     if (
//   //       !unitPostingData?.results ||
//   //       unitPostingData?.results.length === 0
//   //     ) {
//   //       setErrorMsg(
//   //         "There is no Unit List Available for the given Date."
//   //       );
//   //       setSnackbarErrorOpen(true);
//   //     }
//   //   }
//   // }, [
//   //   unitPurchaseListSuccess,
//   //   loadClicked,
//   //   unitPostingData,
//   //   searchData,
//   //   refetchUnitPurchaseListData,
//   // ]);

//   useEffect(() => {
//     if (onlineTransactionPostingSearchDataSuccess) {
//       setFilteredListData(onlineTransactionPostingSearchData?.results ?? []);
//     }
//     else if (unitPurchaseListSuccess && loadClicked) {
//       setFilteredListData(unitPurchaseListData?.results ?? []);
//     }
//     else {
//       setFilteredListData(unitPurchaseListData?.results ?? []);
//     }
//   }, [loadClicked, onlineTransactionPostingSearchData, onlineTransactionPostingSearchDataSuccess, unitPurchaseListData, unitPurchaseListSuccess]);

//   const handleAuthorize = () => {
//     const tempData = selectedRows?.map((item) => item.id);

//     if (tempData.length === 0) {
//       setSnackbarErrorOpen(true);
//       setErrorMsg("You must select at least one SIP");
//       return;
//     }
//     const finalData = {
//       id: tempData,
//     };
//     unitPostingMutate(finalData);
//   };

//   const handleReject = () => {
//     // console.log("Reject Clicked");
//   };

//   // const handleSearch = async () => {
//   //   if (boidNumber) {
//   //     try {
//   //       // await refetchOnlineTransactionPostingSearchData();
//   //       onlineTransactionPostingSearchData

//   //     } catch (error) {
//   //       console.error("Error fetching search data:", error);
//   //     }
//   //   }
//   // };

//   const handleSearch = () => {
//     if (boidNumber) {
//       // setFilteredListData(onlineTransactionPostingSearchData?.results || []);
//       refetchOnlineTransactionPostingSearchData();
//       // setSearchClicked(true);
//     }
//   };

//   return (
//     <Box

//       sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//     >

//       <Box component='form' onSubmit={handleSubmit(handleLoad)}>
//       <Box >
//         <DistributionSchemeField
//           distribution={false}
//           control={control}
//           label1="Distribution Center"
//         />
//       </Box>
//       <DateField
//           control={control}
//           dateLabel1="Date (From)"
//           dateLabel2="Date (To)"
//         />

//         <RoundedButton title1="Load" />

//       </Box>

//       <Box sx={{ width: "100%" }}>
//         <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
//           Enter Number to search
//         </Typography>
//         <Box sx={{display:'flex' , gap:3}}>
//         <TextField
//           size="small"
//           placeholder="BOID Number"
//           value={boidNumber}
//           // onClick={handleSearch}
//           onChange={(e) => {
//             setBoidNumber(e.target.value);
//           }}
//         />
//         <Box>
//           <RoundedButton title1="Search" onClick1={handleSearch} />
//         </Box>
//         </Box>
//       </Box>
//       <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//         <HeaderDesc title="Table" />
//         <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
//           <ExportButton
//             boidNumber={boidNumber}
//             exportUrl="https://api-mf.navyaadvisors.com/sip-up/api/v1/unit-purchase/list/"
//             fileName={`Online Transaction Posting${boidNumber ? ` - ${boidNumber}` : ''}.csv`}
//           />
//         </Box>

//       </Box>
//       {unitPurchaseListData?.results?.length > 0 ? (
//       <>
//         <Box
//          component="form"
//          onSubmit={handleSubmit(handleAuthorize)}>
//         <PostingTable
//           columns={UnitPurchasePostingHeader}
//           data={
//             filteredListData.length > 0
//             ? filteredListData
//             : unitPurchaseListData?.results ?? []
//           }
//           // data = {unitPurchaseListData?.results ?? []}
//           setSelectedRows={setSelectedRows}
//           pagination={pagination}
//           setPagination={setPagination}
//           next={next}
//           prev={prev}
//           pageCount={totalPage}
//         />
//       </Box>
//       <Box>
//         <PostingRemarks control={control} errors={errors} />
//       </Box>
//       <Box>
//         <RoundedButton
//           title1="Authorize"
//           title2="Reject"
//           // onClick1={handleAuthorize}
//           onClick2={handleReject}
//         />
//       </Box>
//       <SuccessBar
//         snackbarOpen={snaackbarOpen}
//         setSnackbarOpen={setSnackbarOpen}
//         message={message}
//       />
//       <ErrorBar
//         snackbarOpen={snackbarErrorOpen}
//         setSnackbarOpen={setSnackbarErrorOpen}
//         message={errorMsg}
//       />
//       </>
//     ) : (
//       // <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
//       //   No data available
//       // </Typography>
//       <ErrorBar
//         snackbarOpen={snackbarErrorOpen}
//         setSnackbarOpen={setSnackbarErrorOpen}
//         message={errorMsg}
//       />
//     )}
//     </Box>
//   );
// };

// export default UnitPurchasePosting;

// import { Box } from "@mui/material";
// import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
// import DateField from "components/DateField/DateField";
// import PostingRemarks from "components/PostingRemarks/PostingRemarks";
// import RoundedButton from "components/Button/Button";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import { useForm } from "react-hook-form";
// import dayjs, { Dayjs } from "dayjs";
// import { distributionCenterOptions } from "constants/Distribution Center Data/distCenterOptions";
// import PostingTable from "components/Table/PostingTable";
// import { UnitTransactionPostingTableHeader } from "constants/UnitTransactionPosting/UnitTransactionPostingTableHeader";
// // import { useMutation } from "node_modules/@tanstack/react-query/build/modern/useMutation.d.cts";
// import {
//   useGetOnlineTxnPostingList,
//   useMutationOnlineTxnPosting,
// } from "services/Transaction Management/OnlineTxnPosting/OnlineTxnPostingServices";
// import UnitPurchasePosting from "../Unit Purchase/UnitPurchasePosting";

// interface IFormInput {
//   distributionCenter: string;
//   schemeName: string;
//   startDate: Dayjs;
//   endDate: Dayjs;
//   postingRemark: string;
// }

// const OnlineTxnPosting = () => {
//   const { control, handleSubmit } = useForm<IFormInput>({
//     defaultValues: {
//       distributionCenter: "Navya Advisors",
//       schemeName: "NAVYA LARGE CAP FUND",
//       startDate: dayjs(),
//       endDate: dayjs(),
//       postingRemark: "",
//     },
//   });

//   const { data: onlineTxnDataList } = useGetOnlineTxnPostingList();

//   const handleSearch = () => {
//     // console.log("Refresh Clicked");
//   };
//   const handleAuthorize = (data: IFormInput) => {
//     // console.log("Authorize Clicked", data);
//   };
//   const handleReject = () => {
//     // console.log("Reject Clicked");
//   };
//   return (
//     <UnitPurchasePosting />
//     // <Box
//     //   component="form"
//     //   onSubmit={handleSubmit(handleAuthorize)}
//     //   sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//     // >
//     //   <Box sx={{}}>
//     //     <DistributionSchemeField
//     //       control={control}
//     //       label1="Distribution Center (Request)"
//     //     />
//     //   </Box>
//     //   <Box sx={{}}>
//     //     <DateField
//     //       control={control}
//     //       dateLabel1="Date (From)"
//     //       dateLabel2="Date (To)"
//     //     />
//     //   </Box>
//     //   <Box>
//     //     <RoundedButton title1="Search" onClick1={handleSearch} />
//     //   </Box>
//     //   <Box>
//     //     <HeaderDesc title="Table" />
//     //     <Box>
//     //       <PostingTable
//     //         columns={UnitTransactionPostingTableHeader}
//     //         data={onlineTxnDataList ?? []}
//     //       />
//     //     </Box>
//     //   </Box>
//     //   <Box sx={{}}>
//     //     <PostingRemarks control={control} />
//     //   </Box>
//     //   <Box>
//     //     <RoundedButton
//     //       title1="Authorize"
//     //       title2="Reject"
//     //       // onClick1={handleAuthorize}
//     //       onClick2={handleReject}
//     //     />
//     //   </Box>
//     // </Box>
//   );
// };

// export default OnlineTxnPosting;
