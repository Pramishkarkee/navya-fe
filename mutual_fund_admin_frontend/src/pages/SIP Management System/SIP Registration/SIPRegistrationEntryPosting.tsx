import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import RoundedButton from "components/Button/Button";
import PostingRemarks from "components/PostingRemarks/PostingRemarks";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import PostingTable from "components/Table/PostingTable";

//tasntack query
import { SIPRegistrationPostingTableHeaders } from "constants/SIPRegistrationTable/SIPRegististrationPostingTableHeader";
import {
  useAuthorizeSipMutation,
  useGetPendigSipList,
  useGetPendingSipListByBoid,
  useRejectSipMutation,
} from "services/SIP/sipPostingServices";

import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { PaginationState } from "@tanstack/react-table";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ExportButtonSip from "components/Button/ExportSipButton";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import DateField from "components/DateField/DateField";

import dayjs from "dayjs";
import DateFormatter from "utils/DateFormatter";
import axios from "axios";

// interface SipPostInput {
//   distributionCen: string;
//   schemeName: string;
//   postingRemark: string;
// }

const SIPRegistrationEntryPosting = () => {
  const theme = useTheme();
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [snaackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [boid, setBoid] = useState<string>();
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const [resetCheckBox, setResetCheckBox] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const schema = yup
    .object({
      distributionCenter: yup.string(),
      schemeName: yup.string(),
      startDate: yup.object().required(),
      endDate: yup.object().required(),
      postingRemark: yup.string().label("Remarks").optional(),
    })
    .required();

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      distributionCenter: "Navya Advisors",
      schemeName: "Navya Large Cap Fund",
      startDate: dayjs(),
      endDate: dayjs(),
      postingRemark: "",
    },
    resolver: yupResolver(schema),
  });

  const remarkData = watch("postingRemark");

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  // const [loadDate, setLoadDate] = useState(false);

  const { mutate: authorizeSipMutate } = useAuthorizeSipMutation();

  const { mutate: rejectSipMutate } = useRejectSipMutation();

  const {
    data: PendingSipListData,
    isSuccess: pendingSipListSuccess,
    refetch: sipListRefetch,
  } = useGetPendigSipList(
    pagination.pageIndex + 1,
    searchData.from_date,
    searchData.to_date
  );

  const { data: pendingSipListByBoid } = useGetPendingSipListByBoid(boid);

  const totalPage = Math.ceil(PendingSipListData?.meta?.records / 10);

  const handleAuthorize = (data) => {
    const tempData = selectedRows?.map((item) => item?.id);
    // const tempIntervals = selectedRows?.map((item) => item.interval)

    if (tempData.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsg("You must select at least one SIP");
      return;
    }

    const finalData = {
      sip_ids: tempData,
      // intervals: tempIntervals
      remarks: data.postingRemark,
    };

    authorizeSipMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        setMessage("SIP Authorized Successfully");
        setSnackbarOpen(true);
      },
      onError: (error) => {
        console.log(error, "error");

        if (axios.isAxiosError(error) && error.response) {
          setErrorMsg(
            error.response.data.details
              ? error.response.data.details[0]
              : error.response.data.responseData.remarks
              ? "Posting Remarks is required for authorization"
              : "Error occured while authorizing SIP!"
          );
        }
        setSnackbarErrorOpen(true);
      },
    });
  };

  const handleReject = () => {
    const tempData1 = selectedRows?.map((item) => item?.id);

    if (tempData1.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsg("You must select at least one SIP");
      return;
    }
    const finalData = {
      sip_ids: tempData1,
      remarks: remarkData,
    };
    rejectSipMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        setMessage("SIP Rejected Successfully");
        setSnackbarOpen(true);
      },
      onError: (error) => {
        console.log(error, "error");

        if (axios.isAxiosError(error) && error.response) {
          setErrorMsg(
            error.response.data.details
              ? error.response.data.details[0]
              : error.response.data.responseData.remarks
              ? "Posting Remarks is required for rejection"
              : "Error occured while rejecting SIP!"
          );
        }
        setSnackbarErrorOpen(true);
      },
    });
  };

  const handleSearch = () => {
    if (boid) {
      searchData.from_date = "";
      searchData.to_date = "";
      setFilteredTableData(pendingSipListByBoid?.responseData?.results || []);
      setSearchClicked(true);
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

  const handleLoad = (data) => {
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterUnit.format(toDate.toISOString());

      setSearchClicked(false);
      setSearchData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });
    } else {
      console.log("Both start and end dates must be selected.");
    }
  };

  const handleReset = () => {
    setBoid("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
    sipListRefetch();
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <DistributionSchemeField
            distribution={false}
            label1="Distribution Center"
            control={control}
          />

          <Box
            sx={{ my: 3 }}
            component="form"
            onSubmit={handleSubmit(handleLoad)}
          >
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
            />
            <RoundedButton title1="Load" />
          </Box>

          <Box sx={{ width: "70%" }}>
            <TypographyLabel title="BOID" />
            <TextField
              size="small"
              placeholder="Enter boid"
              sx={{ width: "43%" }}
              value={boid}
              onChange={(e) => setBoid(e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={{ mb: 3 }}>
          <RoundedButton title1="Search" onClick1={handleSearch} />
        </Box>

        {tableData.length > 0 && (
          <Box component="form" onSubmit={handleSubmit(handleAuthorize)}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <HeaderDesc title="Table" />
              <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                <ExportButtonSip
                  boidNumber={boid}
                  exportUrl={`${BASE_URL}/sip-up/api/v1/sip/sip-list/`}
                  fileName={`SIP Registration Posting${
                    boid ? ` - ${boid}` : ""
                  }.csv`}
                  sipStatus="pending"
                  fromDate={searchData.from_date}
                  toDate={searchData.to_date}
                  portal="Office"
                />
              </Box>
            </Box>

            <Box>
              {boid && searchClicked ? (
                <>
                  <PostingTable
                    columns={SIPRegistrationPostingTableHeaders}
                    data={filteredTableData ?? []}
                    setSelectedRows={setSelectedRows}
                  />
                  {filteredTableData.length === 0 && (
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
                      <Typography>
                        No data available for the given BOID
                      </Typography>
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
                  )}
                </>
              ) : (
                <PostingTable
                  columns={SIPRegistrationPostingTableHeaders}
                  data={tableData}
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

            {/* <Box>
              {PendingSipListData?.responseData?.results?.length > 0 ? (
                  <PostingTable
                  columns={SIPRegistrationPostingTableHeaders}
                  data={tableData}
                  setSelectedRows={setSelectedRows}
                  pagination={pagination}
                  setPagination={setPagination}
                  next={next}
                  prev={prev}
                  pageCount={totalPage}
                />
              ) : (
                <>
                  <PostingTable
                    columns={SIPRegistrationPostingTableHeaders}
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
                      <CloudRoundedIcon
                        sx={{ color: "#E0E0E0", fontSize: "12rem" }}
                      />
                      <Typography>
                        No data available for the given BOID
                      </Typography>
                    </Box>
                  
                </>
              
              )}
            </Box> */}

            {selectedRows.length > 0 && (
              <>
                <Box sx={{ width: "80%", mt: 2 }}>
                  <PostingRemarks control={control} errors={errors} />
                </Box>
                <Box>
                  <RoundedButton
                    title1="Authorize"
                    title2="Reject"
                    onClick2={handleReject}
                  />
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>

      <SuccessBar
        snackbarOpen={snaackbarOpen}
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
