import { useEffect, useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import OwnerInformation from "components/OwnerInformation/OwnerInformation";
// import PostingTable from "components/Table/PostingTable";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import RoundedButton from "components/Button/Button";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useGetFilteredSipList,
  useCancelSipMutation,
} from "services/SIP Cancellation/sipCancellationServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import ReceiptTable from "components/Table/TanstackTable";
import ErrorBar from "components/Snackbar/ErrorBar";
import ExportButtonSip from "components/Button/ExportSipButton";

type SIPCancellationHeader = {
  id: number;
  share_holder_number: number;
  full_name: string;
  // boid: number;
  holder_type: string;
  // schemeName: string;
  // distributionCenter: string;
  sip_start_date: string;
  amount: string;
  action: any;
};

type SipData = {
  amount?: string;
  applied_unit?: number;
  boid_no?: string;
  citizen_file_path?: string;
  citizen_sip_id?: string;
  created_at?: string;
  created_by?: string | null;
  db_center?: string | null;
  email?: string;
  enrolled_drep?: boolean;
  full_name?: string;
  id?: number;
  phone?: string;
  portal?: string;
  ref_id?: string;
  remarks?: string;
  return_amount?: string;
  scheme_name?: string;
  share_holder_number?: string;
  sip_end_date?: string;
  sip_identifier?: string;
  sip_interval?: string;
  sip_model?: string;
  sip_start_date?: string;
  sip_status?: string;
  sip_term?: string;
  sip_term_type?: string;
  time_period?: string;
  updated_at?: string;
};

const SIPCancellationEntry = () => {
  const theme = useTheme();

  const [searchData, setSearchData] = useState({});
  const [sipList, setSipList] = useState([]);
  const [sipData, setSipData] = useState<SipData>({});
  const [sipId, setSipId] = useState<number>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchClicked, setSearchClicked] = useState<boolean>(false);

  const schema = yup
    .object({
      distributionCenter: yup.string().required(),
      schemeName: yup.string().required(),
      boid: yup.string().required().length(16).label("BOID"),
    })
    .required();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      distributionCenter: "Navya Advisors",
      schemeName: "Navya Large Cap Fund",
      boid: "",
    },
    resolver: yupResolver(schema),
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: sipListData,
    isSuccess: sipListSuccess,
    refetch: sipListDataRefetch,
  } = useGetFilteredSipList(searchData, pagination.pageIndex + 1);

  const totalPage = Math.ceil(sipListData?.meta?.records / 10);

  const {
    mutate: cancelSipMutate,
    data: cancelSipData,
    isSuccess: cancelSipSuccess,
  } = useCancelSipMutation(sipId);

  useEffect(() => {
    // sipListDataRefetch();
    if (sipListData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (sipListData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [sipListData, sipListSuccess]);

  useEffect(() => {
    if (sipListData && sipListSuccess && searchClicked) {
      setSipList(sipListData?.responseData?.results);

      if (
        (searchClicked && !sipListData?.responsedata?.results) ||
        sipListData?.responsedata?.results.length === 0
      ) {
        setErrorMessage("There is no SIP List Available for the given BOID.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [sipListData, sipListSuccess, searchClicked]);

  useEffect(() => {
    setTimeout(() => {
      setSearchClicked(false);
    }, 1000);
  }, [searchClicked]);

  useEffect(() => {
    if (cancelSipSuccess) {
      setSipList([]);
      setSipData({});
      setMessage("Cancellation entry was successful.");
      setSnackbarOpen(true);
      setSearchClicked(false);
    }
  }, [cancelSipData, cancelSipSuccess]);

  const handleSearch = (data) => {
    // console.log("Search Data", data.boid);
    // setBoid(data.boid);
    setSearchData(data);
    setSearchClicked(true);
  };

  // useEffect(() => {
  //   if (searchClicked) {
  //     sipListDataRefetch();
  //   }
  // }
  //   , [searchClicked, sipListDataRefetch]);

  const handleCancelSIP = () => {
    cancelSipMutate();
    setSearchClicked(false);
    setSnackbarErrorOpen(false);
  };

  // const handleReset = () => {
  //   console.log("Reset Clicked");
  // };

  const SIPCancellationEntryTableHeader: ColumnDef<SIPCancellationHeader>[] = [
    {
      header: "SIP No.",
      accessorKey: "sipNo",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.id}
          </Typography>
        );
      },
    },
    {
      header: "Holder Number",
      accessorKey: "holderNumber",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.share_holder_number}
          </Typography>
        );
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.full_name}
          </Typography>
        );
      },
    },
    // {
    //   header: "BOID",
    //   accessorKey: "boid",
    //   cell: (data) => {
    //     return <Typography>{data.row.original.boid_no}</Typography>;
    //   },
    // },
    {
      header: "Holder Type",
      accessorKey: "holde_type",
      cell: (data) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
              textTransform: "capitalize",
            }}
          >
            {data.row.original.holder_type
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ") || "-"}
          </Typography>
        );
      },
    },
    {
      header: "SIP Start Date",
      accessorKey: "",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {data.row.original.sip_start_date}
          </Typography>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {" "}
            {data.row.original.amount}{" "}
          </Typography>
        );
      },
    },

    // {
    //   header: "Scheme Name",
    //   accessorKey: "schemeName",
    //   cell: (data) => {
    //     return <Typography>{data.row.original.schemeName}</Typography>;
    //   },
    // },
    // {
    //   header: "Distriution Center",
    //   accessorKey: "distriutionCenter",
    //   cell: (data) => {
    //     return <Typography>{data.row.original.distribution_center}</Typography>;
    //   },
    // },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => {
        const theme = useTheme();

        const handleViewDetails = (sip) => {
          // console.log("sip details", sip);
          setSipData(sip);
          setSipId(sip.id);
        };

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 0.6,
              color: theme.palette.primary.fullDarkmainColor,
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            <Typography
              onClick={() => handleViewDetails(data.row.original)}
              sx={{
                fontSize: "14px",
                color: theme.palette.primary.fullDarkmainColor,
                fontWeight: "400",
              }}
            >
              Details
            </Typography>
          </Box>
        );
      },
    },
  ];

  const nepaliTime = new Date(sipData.created_at).toLocaleTimeString("ne-NP", {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // const transactionDate = new Date(sipData?.created_at);
  // const nepaliTime = transactionDate.toLocaleTimeString("en-US");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleSearch)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box>
          <DistributionSchemeField
            label1="Distribution Center"
            control={control}
          />
        </Box>
        <Box sx={{ width: "71%" }}>
          <OwnerInformation
            control={control}
            errors={errors}
            searchButton
            onClickSearch={handleSearch}
          />
        </Box>
      </Box>

      {sipList.length > 0 ? (
        <Box sx={{}}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <HeaderDesc title={"SIP Entries"} />
              <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                <ExportButtonSip
                  boidNumber={watch("boid")}
                  exportUrl={`${BASE_URL}/sip-up/api/v1/sip/sip-list/`}
                  fileName={`SIP Cancellation Entry$.csv`}
                  sipStatus="success"
                />
              </Box>
            </Box>
          </Box>
          <ReceiptTable
            data={sipList ?? []}
            columns={SIPCancellationEntryTableHeader}
            pagination={pagination}
            setPagination={setPagination}
            next={next}
            prev={prev}
            pageCount={totalPage}
          />
        </Box>
      ) : (
        <Box>
          <ErrorBar
            snackbarOpen={snackbarErrorOpen}
            setSnackbarOpen={setSnackbarErrorOpen}
            message={errorMessage}
          />
        </Box>
      )}

      {Object.keys(sipData)?.length > 0 && (
        <Box sx={{ width: { md: "100%", lg: "90%", xl: "70%" } }}>
          <Stack spacing={2}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "12px",
                border: `1px solid ${theme.palette.primary.dark}`,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    lineHeight: "17px",
                    borderBottom: 1,
                    borderColor: theme.palette.primary.dark,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#000000",
                    padding: 1,
                  }}
                >
                  Entry Details
                </Typography>
              </Box>

              <Box
                sx={{
                  padding: 2,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    SIP Registration Number
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {sipData.id}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    Contact Number
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {sipData.phone}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    Email
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {sipData.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    Name
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {sipData.full_name}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    SIP Amount
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {sipData.amount}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    Payment By
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {sipData.full_name}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    Model of SIP
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {sipData.sip_model}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    SIP Interval
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {sipData.sip_model === "Limited"
                      ? sipData.sip_interval
                      : "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    SIP Term
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {sipData.sip_model === "Limited"
                      ? sipData.time_period
                      : "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    SIP Portal Type
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {sipData.portal === "Office"
                      ? "Counter"
                      : sipData.portal === "Online"
                      ? "Online"
                      : "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    SIP Registration Date
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {sipData.sip_start_date}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    SIP Registration Timestamp
                  </Typography>
                  <Typography sx={{ fontSize: "15px" }}>
                    {nepaliTime}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Stack>

          <Box>
            <RoundedButton
              title1="Cancel SIP"
              // title2="Reset"
              onClick1={handleCancelSIP}
              // onClick2={handleReset}
            />
          </Box>
        </Box>
      )}

      <SuccessBar
        snackbarOpen={snackbarOpen}
        message={message}
        setSnackbarOpen={setSnackbarOpen}
      />
    </Box>
  );
};

export default SIPCancellationEntry;
