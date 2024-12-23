import { Box, TextField, Typography, useTheme } from "@mui/material";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import DateField from "components/DateField/DateField";
import RoundedButton from "components/Button/Button";
import PostingTable from "components/Table/PostingTable";
import PostingRemarks from "components/PostingRemarks/PostingRemarks";
import DateFormatter from "utils/DateFormatter";
import ErrorBar from "components/Snackbar/ErrorBar";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { UnitPurchasePostingHeader } from "constants/Unit Purchase/UnitPurchasePostingHeaders";

import {
  useGetUnitPurchaseList,
  useGetUnitPurchaseSearchList,
  useMutationUnitPurchasePosting,
  useMutationUnitPurchaseRejectPosting,
} from "services/Transaction Management/Unit Purchase/unitPostingServices";

import SuccessBar from "components/Snackbar/SuccessBar";
import { PaginationState } from "@tanstack/react-table";
import dayjs from "dayjs";
import ExportButton from "components/Button/ExportButton";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";

export interface UnitPostingData {
  startDate: string;
  endDate: string;
  postingRemark: string;
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

const schema = yup
  .object({
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    postingRemark: yup.string().label("Remarks"),
  })
  .required();

const UnitPurchasePosting = () => {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startDate: dayjs(),
      endDate: dayjs(),
      postingRemark: "",
    },
    resolver: yupResolver(schema),
  });

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loadClicked, setLoadClicked] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [successMsgs, setSuccessMsgs] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);

  const [filteredListData, setFilteredListData] = useState<any[]>([]);
  const [boidNumber, setBoidNumber] = useState("");

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [resetCheckBox, setResetCheckBox] = useState(false);

  const {
    data: unitPurchaseListSearchData,
    isSuccess: unitPurchaseListSearchSuccess,
    // refetch: refetchUnitPurchaseListSearch
  } = useGetUnitPurchaseSearchList(boidNumber);

  const {
    data: unitPostingData,
    isSuccess: unitPostingDataSuccess,
    refetch: unitPostingDataRefetch,
  } = useGetUnitPurchaseList(
    searchData?.from_date,
    searchData?.to_date,
    pagination.pageIndex + 1
  );

  const totalPage = Math.ceil(
    unitPostingData?.meta?.records / unitPostingData?.meta?.per_page
  );

  const { mutate: unitPostingMutate } = useMutationUnitPurchasePosting();

  const { mutate: unitPostingRejectMutate } =
    useMutationUnitPurchaseRejectPosting();

  const handleLoad = (data) => {
    if (data?.startDate && data?.endDate) {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterUnit.format(toDate.toISOString());

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
    unitPostingDataRefetch();
    if (unitPostingDataSuccess && loadClicked) {
      setTableData(unitPostingData?.responseData?.results ?? []);

      if (
        !unitPostingData?.responseData?.results ||
        unitPostingData?.responseData?.results.length === 0
      ) {
        setErrorMsgs("There is no Unit List Available for the given Date.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [
    unitPostingDataSuccess,
    loadClicked,
    unitPostingData,
    searchData,
    unitPostingDataRefetch,
  ]);

  useEffect(() => {
    setTableData(unitPostingData?.responseData?.results ?? []);
    if (unitPostingData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (unitPostingData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [unitPostingData, unitPostingDataSuccess]);

  const handleAuthorize = () => {
    const tempData = selectedRows.map((item) => item.id);
    if (tempData.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsgs("You must select at least one SIP");
      return;
    }
    const finalData = {
      id: tempData,
      // remarks: data.postingRemark,
    };
    unitPostingMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        unitPostingDataRefetch();
        setSnackbarOpen(true);
        setSuccessMsgs("Unit Posting Authorized successfully");
        setTableData((prevTableData) =>
          prevTableData.filter((row) => !selectedRows.includes(row))
        );
        setSelectedRows([]);
      },

      onError: () => {
        setSnackbarErrorOpen(true);
        setErrorMsgs("Error Occured in Authorizing Unit Posting ");
        // if (axios.isAxiosError(unitPostingerror) && unitPostingerror.response) {
        //   const errorData = unitPostingerror.response.data;

        // }
      },
    });
    reset();
  };

  const handleReject = () => {
    const tempData = selectedRows.map((item) => item.id);
    if (tempData.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsgs("You must select at least one SIP");
      return;
    }
    const finalData = {
      id: tempData,
      // remarks: data.postingRemark,
    };
    unitPostingRejectMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        setSuccessMsgs("Unit Posting Rejected successfully");
        setSnackbarOpen(true);

        // setTableData((prevTableData) =>
        //   prevTableData.filter((row) => !selectedRows.includes(row))
        // );
      },

      onError: () => {
        setSnackbarErrorOpen(true);
        setErrorMsgs("Error Occured in Rejecting Unit Posting ");
      },
    });
    reset();
  };
  // useEffect(() => {
  //   if (unitPostingSuccess) {
  //     setSuccessMsgs("Unit Posting Authorized successfully");
  //     setSnackbarOpen(true);
  //   } else if (unitPostingerror) {
  //     setErrorMsgs("Error Occured in Authorizing Unit Posting ");
  //   }
  // }, [unitPostingSuccess]);

  // useEffect(() => {
  //   if (unitPostingerror) {
  //     setErrorMsgs("Error Occured in Authorizing Unit Posting ");
  //   }
  // }, [unitPostingerror]);

  // useEffect(() => {
  //   if (unitPostingRejectSuccess) {
  //     setSuccessMsgs("Unit Posting Rejected successfully");
  //     setSnackbarOpen(true);

  //     setTableData((prevTableData) =>
  //       prevTableData.filter((row) => !selectedRows.includes(row))
  //     );
  //   } else if (unitPostingRejecterror) {
  //     setErrorMsgs("Error Occured in Rejecting Unit Posting ");
  //   }
  // }, [unitPostingRejectSuccess, unitPostingRejecterror, selectedRows]);

  // useEffect(() => {
  //   if (isSubmitSuccessful) {
  //     reset();
  //   }
  // }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (boidNumber) {
      handleSearch();
    } else {
      // refetchUnitPurchaseListSearch();
      unitPostingDataRefetch();
    }
  }, [boidNumber, unitPostingDataRefetch]);

  useEffect(() => {
    if (unitPurchaseListSearchSuccess) {
      setFilteredListData(
        unitPurchaseListSearchData?.responseData?.results ?? []
      );
    } else {
      setFilteredListData(unitPostingData?.responseData?.results ?? []);
    }
  }, [
    unitPurchaseListSearchData,
    unitPurchaseListSearchSuccess,
    unitPostingData,
  ]);

  useEffect(() => {
    const filteredData = boidNumber
      ? filteredListData.filter((row) => row.boid_number === boidNumber)
      : filteredListData;

    setTableData(filteredData);
  }, [filteredListData, boidNumber]);

  const handleSearch = async () => {
    if (boidNumber) {
      try {
        const response = await unitPurchaseListSearchData;
        setFilteredListData(response.data.results || []);
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    }
  };
  const handleReset = () => {
    reset();
    setBoidNumber("");
    setTableData(unitPostingData?.responseData?.results ?? []);
    setFilteredListData(unitPostingData?.responseData?.results ?? []);
    setSearchData({ from_date: "", to_date: "" });
  };
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
        <Box sx={{ width: "100%" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            Enter Number to search
          </Typography>
          <TextField
            size="small"
            placeholder="BOID Number"
            value={boidNumber}
            onChange={(e) => {
              setBoidNumber(e.target.value);
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <RoundedButton title1="Search" onClick1={handleSearch} />
            <Box sx={{ display: "flex" }}>
              <ExportButton
                boidNumber={boidNumber}
                exportUrl={`${BASE_URL}/sip-up/api/v1/unit-purchase/list/`}
                fileName={`Unit Purchase Posting${
                  boidNumber ? ` - ${boidNumber}` : ""
                }.csv`}
                fromDate={searchData.from_date}
                toDate={searchData.to_date}
                portal="Office"
                isApproved="False"
                isRejected="False"
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt={2}>
        {tableData.length > 0 || filteredListData.length > 0 ? (
          <>
            <Box
              component="form"
              // onSubmit={handleSubmit(handleAuthorize)}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <PostingTable
                columns={UnitPurchasePostingHeader}
                data={tableData}
                pageCount={totalPage}
                pagination={pagination}
                setPagination={setPagination}
                next={next}
                prev={prev}
                setSelectedRows={setSelectedRows}
                resetSelectionTrigger={resetCheckBox}
              />

              {/* <PostingRemarks control={control} errors={errors} /> */}
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
                <CloudRoundedIcon
                  sx={{ color: "#E0E0E0", fontSize: "12rem" }}
                />
                <Typography>No Unit Posting Details available.</Typography>
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
          </Box>
        )}
      </Box>
    </>
  );
};

export default UnitPurchasePosting;
