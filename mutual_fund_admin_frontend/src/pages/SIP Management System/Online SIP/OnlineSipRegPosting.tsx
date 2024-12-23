import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import RoundedButton from "components/Button/Button";
import PostingRemarks from "components/PostingRemarks/PostingRemarks";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import PostingTable from "components/Table/PostingTable";

import { SIPRegistrationPostingTableHeaders } from "constants/SIPRegistrationTable/SIPRegististrationPostingTableHeader";
import {
  useAuthorizeSipMutation,
  useGetPendigOnlineSipList,
  useGetSipByBoid,
} from "services/SIP/sipPostingServices";

import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { PaginationState } from "@tanstack/react-table";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ExportButtonSip from "components/Button/ExportSipButton";
import DateField from "components/DateField/DateField";
import DateFormatter from "utils/DateFormatter";
import dayjs from "dayjs";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";

interface IFormInput {
  distributionCenter: string;
  schemeName: string;
  postingRemark: string;
  startDate: any;
  endDate: any;
}

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

const SIPRegistrationEntryPosting = () => {
  const theme = useTheme();
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [boid, setBoid] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const [loadClicked, setLoadClicked] = useState(false);
  const [resetCheckBox, setResetCheckBox] = useState(false);

  const schema = yup
    .object({
      distributionCenter: yup.string(),
      schemeName: yup.string(),
      postingRemark: yup.string(),
      startDate: yup.date().required(),
      endDate: yup.date().required(),
    })
    .required();

  const {
    control,
    reset,
    handleSubmit,
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

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  const { mutate: authorizeSipMutate } = useAuthorizeSipMutation();

  const {
    data: PendingSipListData,
    isSuccess: pendingSipListSuccess,
    refetch: sipListRefetch,
  } = useGetPendigOnlineSipList(
    pagination.pageIndex + 1,
    searchData?.from_date,
    searchData?.to_date
  );

  const {
    data: pendingSipListDataByBoid,
    isSuccess: pendingSipListDataSuccess,
    refetch: pendingSipListDataRefetch,
  } = useGetSipByBoid(boid);

  const totalPage = Math.ceil(PendingSipListData?.meta?.records / 10);

  useEffect(() => {
    if (pendingSipListDataSuccess && searchClicked) {
      setFilteredTableData(
        pendingSipListDataByBoid?.responseData?.results ?? []
      );
    } else if (pendingSipListSuccess && loadClicked) {
      setFilteredTableData(PendingSipListData?.responseData?.results ?? []);
    } else {
      setFilteredTableData(PendingSipListData?.responseData?.results ?? []);
    }

    if (
      loadClicked &&
      pendingSipListSuccess &&
      PendingSipListData?.responseData?.results.length === 0
    ) {
      setSnackbarErrorOpen(true);
      setErrorMsg("No data found for the selected date range");
    }

    if (
      searchClicked &&
      pendingSipListDataSuccess &&
      pendingSipListDataByBoid?.responseData?.results.length === 0
    ) {
      setSnackbarErrorOpen(true);
      setErrorMsg("No data found for the entered BOID");
    }
  }, [
    searchClicked,
    PendingSipListData?.responseData?.results,
    // PendingSipListData?.results,
    loadClicked,
    pendingSipListDataByBoid?.responseData?.results,
    pendingSipListDataSuccess,
    pendingSipListSuccess,
  ]);

  const handleAuthorize = (data) => {
    const tempData = selectedRows?.map((item) => item?.id);

    if (tempData.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsg("You must select at least one SIP");
      return;
    }

    const finalData = {
      sip_ids: tempData,
      remarks: data.postingRemark,
    };

    authorizeSipMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        setSnackbarOpen(true);
        setMessage("SIP Authorized Successfully");
        sipListRefetch();
        reset();
      },
      onError: (authorizeSipError) => {
        setSnackbarErrorOpen(true);
        setErrorMsg("SIP Authorization Failed");
      },
    });
  };

  const handleReject = () => {
    // Handle reject functionality
  };

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
      // sipListRefetch();
    } else {
      setSnackbarErrorOpen(true);
      setErrorMsg("Both start and end dates must be selected.");
    }
  };

  useEffect(() => {
    if (loadClicked) {
      sipListRefetch();
    }
  }, [loadClicked, searchData, sipListRefetch]);

  // useEffect(() => {
  //   if (authorizeSipSuccess) {
  //     setSnackbarOpen(true);
  //     setMessage("SIP Authorized Successfully");
  //     // sipListRefetch();
  //     // reset();
  //   }
  // }, [authorizeSipSuccess, authorizeSipData, sipListRefetch, reset]);

  // useEffect(() => {
  //   if (isAuthorizeError) {
  //     setSnackbarErrorOpen(true);
  //     setErrorMsg("Error in authorizing");
  //   }
  // }, [isAuthorizeError, authorizeSipError]);

  const handleSearch = () => {
    if (boid.length === 16) {
      pendingSipListDataRefetch();
      setSearchClicked(true);
    } else {
      setSnackbarErrorOpen(true);
      setErrorMsg("BOID must be 16 digits long");
    }
  };

  useEffect(() => {
    if (!boid) {
      setFilteredTableData([]);
      setSearchClicked(false);
    }
  }, [boid]);

  useEffect(() => {
    setTableData(PendingSipListData?.responseData?.results || []);

    if (PendingSipListData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (PendingSipListData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [PendingSipListData, pendingSipListSuccess]);

  const handleReset = () => {
    reset();
    setBoid("");
    setSearchData({ from_date: "", to_date: "" });
    sipListRefetch();
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Box component="form" onSubmit={handleSubmit(handleLoad)}>
            <DistributionSchemeField
              distribution={false}
              control={control}
              label1="Distribution Center"
            />
            <Box mt={1}>
              <DateField
                control={control}
                dateLabel1="Date (From)"
                dateLabel2="Date (To)"
              />
            </Box>

            <RoundedButton title1="Load" />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TypographyLabel title=" Search BOID" />
            <TextField
              size="small"
              placeholder="Enter BOID"
              value={boid}
              onChange={(e) => setBoid(e.target.value)}
            />
            <RoundedButton title1="Search" onClick1={handleSearch} />
          </Box>
        </Box>
        <Box></Box>

        {/* {filteredTableData.length > 0 && ( */}
        <Box component="form" onSubmit={handleSubmit(handleAuthorize)}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <HeaderDesc title="Table" />
            <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
              <ExportButtonSip
                boidNumber={boid}
                exportUrl={`${BASE_URL}/sip-up/api/v1/sip/sip-list/`}
                fileName={`Verify Online SIP${boid ? ` - ${boid}` : ""}.csv`}
              />
            </Box>
          </Box>
          <Box>
            {/* {(boid || searchData) && (searchClicked || loadClicked) ? ( */}
            {(boid || searchData) && (searchClicked || loadClicked) ? (
              <>
                <PostingTable
                  columns={SIPRegistrationPostingTableHeaders}
                  data={filteredTableData}
                  setSelectedRows={setSelectedRows}
                />
                {/* { */}
                {filteredTableData.length === 0 && (
                  // (filteredTableData || PendingSipListData?.responseData?.results).length === 0 && (
                  <>
                    {/* <PostingTable
                        columns={SIPRegistrationPostingTableHeaders}
                        data={[]}
                        setSelectedRows={setSelectedRows}
                      /> */}
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
                      <CloudRoundedIcon
                        sx={{ color: "#E0E0E0", fontSize: "12rem" }}
                      />
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
              </>
            ) : (
              <PostingTable
                columns={SIPRegistrationPostingTableHeaders}
                data={
                  PendingSipListData?.responseData?.results ||
                  [] ||
                  pendingSipListDataByBoid?.responseData?.results ||
                  []
                }
                setSelectedRows={setSelectedRows}
                pagination={pagination}
                setPagination={setPagination}
                next={next}
                prev={prev}
                pageCount={totalPage}
                resetSelectionTrigger={resetCheckBox}
              />
            )}
          </Box>
          {selectedRows.length > 0 && (
            <>
              <Box sx={{ width: "80%", mt: 2 }}>
                <PostingRemarks control={control} errors={errors} />
              </Box>
              <Box>
                <RoundedButton
                  title1="Authorize"
                  // title2="Reject"
                  onClick2={handleReject}
                />
              </Box>
            </>
          )}
        </Box>
        {/* // )} */}
      </Box>

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
    </>
  );
};

export default SIPRegistrationEntryPosting;

// import React, { useState, useEffect } from "react";
// import { Box, TextField } from "@mui/material";
// import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
// import RoundedButton from "components/Button/Button";
// import PostingRemarks from "components/PostingRemarks/PostingRemarks";

// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// import PostingTable from "components/Table/PostingTable";

// //tasntack query
// import { SIPRegistrationPostingTableHeaders } from "constants/SIPRegistrationTable/SIPRegististrationPostingTableHeader";
// import {
//   useAuthorizeSipMutation,
//   useGetPendigOnlineSipList,
//   useGetSipByBoid,
// } from "services/SIP/sipPostingServices";

// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";
// import { PaginationState } from "@tanstack/react-table";
// import TypographyLabel from "components/InputLabel/TypographyLabel";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import ExportButtonSip from "components/Button/ExportSipButton";
// import DateField from "components/DateField/DateField";
// import DateFormatter from "utils/DateFormatter";
// import dayjs from "dayjs";

// interface IFormInput {
//   distributionCenter: string;
//   schemeName: string;
//   postingRemark: string;
//   startDate: any;
//   endDate: any;
// }

// const DateFormatterUnit = {
//   format: (dateString: string): string => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
//   },
// };

// const SIPRegistrationEntryPosting = () => {
//   // const queryClient = useQueryClient();

//   const [tableData, setTableData] = useState([]);
//   const [filteredTableData, setFilteredTableData] = useState([]);

//   const [selectedRows, setSelectedRows] = useState([]);

//   const [next, setNext] = useState<boolean>();
//   const [prev, setPrev] = useState<boolean>();
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const [boid, setBoid] = useState<string>();
//   const [snaackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [searchClicked, setSearchClicked] = useState<boolean>(false);
//   const [loadClicked, setLoadClicked] = useState(false);

//   const schema = yup
//     .object({
//       distributionCenter: yup.string(),
//       schemeName: yup.string(),
//       postingRemark: yup.string().required().label("Remarks"),
//       startDate: yup.date().required(),
//       endDate: yup.date().required(),
//     })
//     .required();

//   const {
//     control,
//     reset,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<IFormInput>({
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
//     data: authorizeSipData,
//     isSuccess: authorizeSipSuccess,
//     mutate: authorizeSipMutate,
//     isError: isAuthorizeError,
//     error: authorizeSipError,
//   } = useAuthorizeSipMutation();

//   const {
//     data: PendingSipListData,
//     error: PendingSipError,
//     isSuccess: pendingSipListSuccess,
//     refetch: sipListRefetch,
//   } = useGetPendigOnlineSipList(pagination.pageIndex + 1 , searchData?.from_date, searchData?.to_date);

//   const { data: pendingSipListDataByBoid,  isSuccess : pendingSipListDataSuccess , refetch : pendingSipListDataRefetch} = useGetSipByBoid(boid);

//   const totalPage = Math.ceil(PendingSipListData?.meta?.records / 10);

//   useEffect(() => {
//     if (pendingSipListDataSuccess) {
//       setFilteredTableData(pendingSipListDataByBoid?.responseData?.results ?? []);
//     } else if (pendingSipListSuccess && loadClicked) {
//       setFilteredTableData(PendingSipListData?.responseData?.results ?? []);
//     } else {
//       setFilteredTableData(PendingSipListData?.results ?? []);
//     }
//   }, [PendingSipListData?.responseData?.results, PendingSipListData?.results, loadClicked, pendingSipListDataByBoid?.responseData?.results, pendingSipListDataSuccess, pendingSipListSuccess]);

//   const handleAuthorize = (data) => {
//     const tempData = selectedRows?.map((item) => item?.id);
//     // const tempIntervals = selectedRows?.map((item) => item.interval)

//     if (tempData.length === 0) {
//       setSnackbarErrorOpen(true);
//       setErrorMsg("You must select at least one SIP");
//       return;
//     }

//     const finalData = {
//       sip_ids: tempData,
//       // intervals: tempIntervals
//       remarks: data.postingRemark,
//     };

//     authorizeSipMutate(finalData);
//   };

//   const handleReject = () => {
//     // console.log("Reject");
//   };

//   const handleLoad = (data: IFormInput) => {
//     if (data.startDate && data.endDate) {
//       const fromDate = new Date(data.startDate);
//       const toDate = new Date(data.endDate);

//       const formattedFromDate = DateFormatter.format(fromDate.toISOString());
//       const formattedToDate = DateFormatterUnit.format(toDate.toISOString());

//       setSearchData({
//         from_date: formattedFromDate,
//         to_date: formattedToDate,
//       });

//       setLoadClicked(true);
//     } else {
//       console.log("Both start and end dates must be selected.");
//     }
//   };

//   useEffect(() => {
//     if (authorizeSipSuccess) {
//       setSnackbarOpen(true);
//       setMessage("SIP Authorized Successfully");
//       sipListRefetch();
//       // setLoadClicked(true);
//       reset();
//     }
//   }, [authorizeSipSuccess, authorizeSipData, sipListRefetch, reset]);

//   useEffect(() => {
//     if (isAuthorizeError) {
//       setSnackbarErrorOpen(true);
//       setErrorMsg("Error in authorizing");
//     }
//   }, [isAuthorizeError, authorizeSipError]);

//   const handleSearch = () => {
//     if (boid) {
//       setFilteredTableData(
//         pendingSipListDataByBoid?.responseData?.results || []
//       );
//       setSearchClicked(true);
//     }
//   };

//   useEffect(() => {
//     if (!boid) {
//       setFilteredTableData([]);
//       setSearchClicked(false);
//     }
//   }, [boid]);

//   useEffect(() => {
//     setTableData(PendingSipListData?.responseData?.results || []);

//     if (PendingSipListData?.responseData?.next === null) {
//       setNext(true);
//     } else {
//       setNext(false);
//     }
//     if (PendingSipListData?.responseData?.previous === null) {
//       setPrev(true);
//     } else {
//       setPrev(false);
//     }
//   }, [PendingSipListData, pendingSipListSuccess]);

//   return (
//     <>
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//         <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>

//         <Box component="form" onSubmit={handleSubmit(handleLoad)}>
//         <DistributionSchemeField distribution={false} control={control} label1="Distribution Center" />
//         <DateField control={control} dateLabel1="Date (From)" dateLabel2="Date (To)" />
//         <RoundedButton title1="Load" />

//       </Box>
//           <Box>
//             <TypographyLabel title="BOID" />
//             <TextField
//               size="small"
//               placeholder="Enter boid"
//               fullWidth
//               value={boid}
//               onChange={(e) => setBoid(e.target.value)}
//             />
//           </Box>
//         </Box>
//         <Box>
//           <RoundedButton title1="Search" onClick1={handleSearch} />
//         </Box>

//         {tableData.length > 0 && (
//           <Box component="form" onSubmit={handleSubmit(handleAuthorize)}>
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <HeaderDesc title="Table" />
//               <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
//                 <ExportButtonSip
//                   boidNumber={boid}
//                   exportUrl="https://api-mf.navyaadvisors.com/sip-up/api/v1/sip/sip-list/"
//                   fileName={`Verify Online Sip${boid ? ` - ${boid}` : ''}.csv`}
//                 />
//               </Box>

//             </Box>
//             <Box>
//               {filteredTableData.length > 0 ? (
//                 <PostingTable
//                   columns={SIPRegistrationPostingTableHeaders}
//                   data={filteredTableData}
//                   setSelectedRows={setSelectedRows}
//                 />
//               ) : (
//                 <PostingTable
//                   columns={SIPRegistrationPostingTableHeaders}
//                   data={PendingSipListData?.responseData?.results || []}
//                   setSelectedRows={setSelectedRows}
//                   pagination={pagination}
//                   setPagination={setPagination}
//                   next={next}
//                   prev={prev}
//                   pageCount={totalPage}
//                 />
//               )}
//             </Box>
//             <Box sx={{ width: "80%", mt: 2 }}>
//               <PostingRemarks control={control} errors={errors} />
//             </Box>

//             <Box>
//               <RoundedButton
//                 title1="Authorize"
//                 title2="Reject"
//                 onClick2={handleReject}
//               />
//             </Box>
//           </Box>
//         )}
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
//     </>
//   );
// };

// export default SIPRegistrationEntryPosting;

// import { Box } from "@mui/material"
// import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField"
// import DateField from "components/DateField/DateField"
// import RoundedButton from "components/Button/Button"
// import PostingTable from "components/Table/PostingTable"
// import PostingRemarks from "components/PostingRemarks/PostingRemarks"
// import { useForm } from "react-hook-form"
// import { OnlineSIPPaymentPostingTableHeader } from "constants/OnlineSIPTable/PaymentPostingTableHeader"

// import SIPRegistrationEntryPosting from "../SIP Registration/SIPRegistrationEntryPosting"

// const OnlineSipRegPosting = () => {

//     const { control } = useForm()

//     const handleLoad = () => {
//         // console.log('handle load clicked')
//     }

//     const handleAuthorize = () => {
//         // console.log("authorize dclicked")
//     }

//     const handleReject = () => {
//         // console.log("reject clicked")
//     }

//     const RegPostingData = [
//         {
//             sn: 1,
//             boid: 12341234,
//             name: "Dinesh Khadka",
//             appliedUnits: 123,
//             appliedDate: '2024-03-10',
//             amount: 1000,
//             transactionID: 'TXN000001',

//         }
//     ]

//     return (
//         // <Box sx={{
//         //     display: 'flex',
//         //     flexDirection: 'column',
//         //     gap: 1.5
//         // }}>
//         //     <DistributionSchemeField
//         //         control={control}
//         //         label1="Distribution Center (Request)"
//         //     />

//         //     <DateField
//         //         dateLabel1="Date (From)"
//         //         dateLabel2="Date (To)"
//         //     />

//         //     <RoundedButton
//         //         title1="Load"
//         //         onClick1={handleLoad}
//         //     />

//         //     <Box>
//         //         <PostingTable columns={OnlineSIPPaymentPostingTableHeader} data={RegPostingData} />
//         //     </Box>

//         //     <PostingRemarks control={control} />

//         //     <RoundedButton
//         //         title1="Authorize"
//         //         onClick1={handleAuthorize}
//         //         title2="Reject"
//         //         onClick2={handleReject}
//         //     />

//         // </Box>

//         <SIPRegistrationEntryPosting />
//     )
// }

// export default OnlineSipRegPosting
