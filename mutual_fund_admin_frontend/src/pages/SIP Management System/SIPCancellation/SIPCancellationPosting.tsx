import { Box } from "@mui/material";

import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import DateField from "components/DateField/DateField";
import RoundedButton from "components/Button/Button";
import PostingTable from "components/Table/PostingTable";
import PostingRemarks from "components/PostingRemarks/PostingRemarks";
import { SipCancellationPostingHeaders } from "constants/SIPCancellationTable/SipCancellationPostingHeaders";
import DateFormatter from "utils/DateFormatter";
import ErrorBar from "components/Snackbar/ErrorBar";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";

import {
  useAuthorizeCancelSipMutation,
  useGetCancellationPostingDetail,
} from "services/SIP Cancellation/sipCancellationServices";

import SuccessBar from "components/Snackbar/SuccessBar";
import { PaginationState } from "@tanstack/react-table";
import dayjs from "dayjs";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ExportButtonSip from "components/Button/ExportSipButton";

export interface CancellationPostingData {
  startDate: string;
  endDate: string;
  postingRemark: string;
}

//  const getTodayDate = () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0');
//   const day = String(today.getDate()).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// }

const DateFormatterCancellation = {
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

const schema = yup
  .object({
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    postingRemark: yup.string().label("Remarks"),
  })
  .required();

const CancellationPosting = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
      postingRemark: "",
    },
    resolver: yupResolver(schema),
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loadClicked, setLoadClicked] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [resetCheckBox, setResetCheckBox] = useState(false);

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: CancellationPostingdata,
    isSuccess: CancellationPostingDatasuccess,
    refetch: CancellationPostingDataRefetch,
  } = useGetCancellationPostingDetail(
    searchData?.from_date,
    searchData?.to_date
  );

  const totalPage = Math.ceil(CancellationPostingdata?.meta?.records / 10);

  const { mutate: CancellationPostingMutate } = useAuthorizeCancelSipMutation();

  const handleLoad = (data) => {
    if (data?.startDate && data?.endDate) {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterCancellation.format(
        toDate.toISOString()
      );

      if (formattedFromDate && formattedToDate) {
        setSearchData({
          from_date: formattedFromDate,
          to_date: formattedToDate,
        });
      }
      setLoadClicked(true);
    } else {
      setErrorMsgs("Both start and end dates must be selected.");
      setSnackbarErrorOpen(true);
    }
  };

  useEffect(() => {
    CancellationPostingDataRefetch();
    if (CancellationPostingDatasuccess && loadClicked) {
      setTableData(CancellationPostingdata?.responseData?.results ?? []);
      if (CancellationPostingdata?.responseData?.results.length === 0) {
        setErrorMsgs(
          "There is no SIP Amendment List Available for the given Date."
        );
        setSnackbarErrorOpen(true);
      }
    }
  }, [
    CancellationPostingDatasuccess,
    loadClicked,
    CancellationPostingdata,
    searchData,
    CancellationPostingDataRefetch,
  ]);

  useEffect(() => {
    setTableData(CancellationPostingdata?.responseData?.results ?? []);
    if (CancellationPostingdata?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (CancellationPostingdata?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [CancellationPostingdata, CancellationPostingDatasuccess]);

  const handleAuthorize = (data: CancellationPostingData) => {
    const tempData = selectedRows.map((item) => item.id);
    if (tempData.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsgs("You must select at least one SIP");
      return;
    }
    const finalData = {
      sip_ids: tempData,
      remarks: data.postingRemark,
    };
    CancellationPostingMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        CancellationPostingDataRefetch(), 
        setSuccessMsgs("SIP Amendment Posting Authorized successfully");
        setSnackbarOpen(true);
      },
      onError: () => {
        setSnackbarErrorOpen(true);
        setErrorMsgs("Error Occured in Authorizing SIP Amendment Posting ");
      },
    });
  };

  // useEffect(() => {
  //   if (CancellationPostingSuccess) {
  //     setSuccessMsgs("SIP Amendment Posting Authorized successfully");
  //     setSnackbarOpen(true);
  //   }
  // }, [CancellationPostingSuccess]);

  // useEffect(() => {
  //   if (CancellationPostingerror) {
  //     setErrorMsgs("Error Occured in Authorizing SIP Amendment Posting ");
  //   }
  // }, [CancellationPostingerror]);

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(handleLoad)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <DistributionSchemeField
          distribution={false}
          control={control}
          label1="Distribution Center (Request)"
        />

        <DateField
          control={control}
          dateLabel1="Date (From)"
          dateLabel2="Date (To)"
        />

        <RoundedButton title1="Load" />
      </Box>

      <Box mt={2}>
        {tableData.length > 0 ? (
          <>
            <Box
              component="form"
              onSubmit={handleSubmit(handleAuthorize)}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <HeaderDesc title="Table" />
                <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                  <ExportButtonSip
                    exportUrl={`${BASE_URL}/sip-up/api/v1/sip/sip-list/`}
                    fileName={`SIP Cancellation Posting.csv`}
                    fromDate={searchData.from_date}
                    toDate={searchData.to_date}
                    sipStatus="cancelled-entry"
                  />
                </Box>
              </Box>
              <PostingTable
                data={tableData}
                columns={SipCancellationPostingHeaders}
                setSelectedRows={setSelectedRows}
                pagination={pagination}
                setPagination={setPagination}
                next={next}
                prev={prev}
                pageCount={totalPage}
                resetSelectionTrigger={resetCheckBox}
              />

              {selectedRows.length > 0 && (
                <>
                  <PostingRemarks control={control} errors={errors} />
                  <RoundedButton
                    title1="Authorize"
                    // title2="Reject"
                    // onClick2={handleReject}
                  />
                </>
              )}

              <SuccessBar
                snackbarOpen={snackbarOpen}
                setSnackbarOpen={setSnackbarOpen}
                message={successMsgs}
              />
              <ErrorBar
                snackbarOpen={snackbarErrorOpen}
                setSnackbarOpen={setSnackbarErrorOpen}
                message={errorMsgs}
              />
            </Box>
          </>
        ) : (
          <Box>
            <ErrorBar
              snackbarOpen={snackbarErrorOpen}
              setSnackbarOpen={setSnackbarErrorOpen}
              message={errorMsgs}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default CancellationPosting;

// import {
//   Box,
//   // useTheme,
// } from "@mui/material";
// import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
// // import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import PostingTable from "components/Table/PostingTable";
// import { useForm } from "react-hook-form";
// import DateFormatter from "utils/DateFormatter";
// import RoundedButton from "components/Button/Button";
// import PostingRemarks from "components/PostingRemarks/PostingRemarks";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import {
//   useAuthorizeCancelSipMutation,
//   useGetSipCancelPostingDetail,
// } from "services/SIP Cancellation/sipCancellationServices";
// import { SipCancellationPostingHeaders } from "constants/SIPCancellationTable/SipCancellationPostingHeaders";
// import { useState, useEffect } from "react";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";
// import { PaginationState } from "@tanstack/react-table";
// import DateField from "components/DateField/DateField";

// const schema = yup.object({
//   distributionCenter: yup.string().required(),
//   schemeName: yup.string().required(),
//   postingRemark: yup.string().required().label("Remarks").optional(),
//   startDate: yup.string().required(),
//   endDate: yup.string().required(),
//   boid_no: yup.string().length(16).optional(),
// });

// const SIPCancellationPosting = () => {
//   // const theme = useTheme();
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       distributionCenter: "Navya Advisors",
//       schemeName: "NAVYA LARGE CAP FUND",
//       startDate: "",
//       endDate: "",
//     },
//     resolver: yupResolver(schema),
//   });

//   const [selectedRows, setSelectedRows] = useState([]);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [enableBetweenDates, setEnableBetweenDates] = useState(false);
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });
//   const [searchData, setSearchData] = useState({
//     from_date: "",
//     to_date: "",
//     boid_no: "",
//   });

//   const { amendmentPostingDatasuccess, amendmentPostingdata, refetch } =
//     useGetSipCancelPostingDetail(
//       searchData?.from_date,
//       searchData?.to_date,
//       searchData?.boid_no,
//       enableBetweenDates
//     );

//   const {
//     mutate: sipCancelPostingMutate,
//     isSuccess: authorizeCancelSipSuccess,
//   } = useAuthorizeCancelSipMutation();

//   useEffect(() => {
//     if (amendmentPostingdata || amendmentPostingDatasuccess) {
//       setEnableBetweenDates(false);
//     }
//   }, [amendmentPostingdata, amendmentPostingDatasuccess]);

//   const handleAuthorize = (data) => {
//     const tempData = selectedRows?.map((item) => item?.id);

//     if (tempData.length === 0) {
//       setErrorMsg("You must select at least one SIP");
//       setSnackbarErrorOpen(true);
//       return;
//     }

//     const finalData = {
//       sip_ids: tempData,
//       remarks: data.postingRemark,
//     };

//     sipCancelPostingMutate(finalData);
//   };

//   useEffect(() => {
//     if (authorizeCancelSipSuccess) {
//       setMessage("SIP Authorized Successfully");
//       setSnackbarOpen(true);
//       reset();
//       refetch();
//     }
//   }, [authorizeCancelSipSuccess, refetch, reset]);

//   const handleLoad = (data) => {
//     if (data?.startDate && data?.endDate) {
//       const fromDate = new Date(data?.startDate);
//       const toDate = new Date(data?.endDate);
//       toDate.setDate(toDate.getDate() + 1);

//       if (fromDate && toDate) {
//         setEnableBetweenDates(true);
//       }

//       const formattedFromDate = DateFormatter.format(fromDate.toISOString());
//       const formattedToDate = DateFormatter.format(toDate.toISOString());

//       if (formattedFromDate && formattedToDate) {
//         setSearchData({
//           from_date: formattedFromDate,
//           to_date: formattedToDate,
//           boid_no: data?.boid_no,
//         });
//       }
//     } else {
//       setErrorMsg("Both start and end dates must be selected.");
//       setSnackbarErrorOpen(true);
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//       <Box>
//         <DistributionSchemeField
//           distribution={true}
//           label1="Distribution Center"
//           control={control}
//         />
//       </Box>

//       <Box
//         component="form"
//         onSubmit={handleSubmit(handleLoad)}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 1.5,
//         }}
//       >
//         <DateField
//           control={control}
//           dateLabel1="Date (From)"
//           dateLabel2="Date (To)"
//         />

//         <RoundedButton title1="Load" />
//       </Box>

//       {amendmentPostingDatasuccess && amendmentPostingdata?.length > 0 && (
//         <Box component="form" onSubmit={handleSubmit(handleAuthorize)}>
//           <Box>
//             <PostingTable
//               columns={SipCancellationPostingHeaders}
//               data={amendmentPostingdata}
//               setSelectedRows={setSelectedRows}
//               pagination={pagination}
//               setPagination={setPagination}
//             />
//           </Box>
//           <Box sx={{ width: "80%", mt: 2 }}>
//             <PostingRemarks control={control} errors={errors} />
//           </Box>
//           <Box>
//             <RoundedButton title1="Authorize" />
//           </Box>
//         </Box>
//       )}

//       {amendmentPostingdata?.length === 0 && amendmentPostingDatasuccess && (
//         <ErrorBar
//           snackbarOpen={true}
//           setSnackbarOpen={setSnackbarErrorOpen}
//           message="There is no SIP Amendment List available for the given date range."
//         />
//       )}

//       <SuccessBar
//         snackbarOpen={snackbarOpen}
//         setSnackbarOpen={setSnackbarOpen}
//         message={message}
//       />
//       <ErrorBar
//         snackbarOpen={snackbarErrorOpen}
//         setSnackbarOpen={setSnackbarErrorOpen}
//         message={errorMsg}
//       />
//     </Box>
//   );
// };

// export default SIPCancellationPosting;
