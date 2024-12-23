import { Box } from "@mui/material";

import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import DateField from "components/DateField/DateField";
import RoundedButton from "components/Button/Button";
import PostingTable from "components/Table/PostingTable";
import PostingRemarks from "components/PostingRemarks/PostingRemarks";
import { AmendmentPostingTableHeaders } from "constants/SIPAmendmentTable/AmendmentPostingTable";
import DateFormatter from "utils/DateFormatter";
import ErrorBar from "components/Snackbar/ErrorBar";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import {
  useGetAmendmentPostingDetail,
  usePatchAmendmentPosting,
  usePatchAmendmentPostingReject,
} from "services/SIP Amendment/SipAmendmentPostingServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import { PaginationState } from "@tanstack/react-table";
import dayjs from "dayjs";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ExportButtonSip from "components/Button/ExportSipButton";

export interface AmendmentPostingData {
  startDate: string;
  endDate: string;
  postingRemark: string;
}

const DateFormatterAmendment = {
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

const AmendmentPosting = () => {
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
  const [isAmendmentSuccess, setIsAmendmentSuccess] = useState(false);
  const [resetCheckBox, setResetCheckBox] = useState(false);

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: amendmentPostingdata,
    isSuccess: amendmentPostingDatasuccess,
    isLoading: amendmentPostingDetailLoading,
    refetch: amendmentPostingDataRefetch,
  } = useGetAmendmentPostingDetail(searchData?.from_date, searchData?.to_date);

  const totalPage = Math.ceil(amendmentPostingdata?.count / 10);

  const { mutate: amendmentPostingMutate } = usePatchAmendmentPosting();

  const { mutate: amendmentPostingReject } = usePatchAmendmentPostingReject();

  const handleLoad = (data) => {
    if (data?.startDate && data?.endDate) {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterAmendment.format(
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
    amendmentPostingDataRefetch();
    if (amendmentPostingDatasuccess && loadClicked && !isAmendmentSuccess) {
      if (
        (!amendmentPostingdata?.results ||
          amendmentPostingdata?.results.length === 0) &&
        !amendmentPostingDetailLoading
      ) {
        setErrorMsgs(
          "There is no SIP Amendment List Available for the given Date."
        );
        setSnackbarErrorOpen(true);
      } else {
        setTableData(amendmentPostingdata?.results ?? []);
      }
    }
  }, [
    amendmentPostingDatasuccess,
    loadClicked,
    amendmentPostingdata,
    searchData,
    amendmentPostingDataRefetch,
    amendmentPostingDetailLoading,
  ]);

  useEffect(() => {
    setTableData(amendmentPostingdata?.results ?? []);
    if (amendmentPostingdata?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (amendmentPostingdata?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [amendmentPostingdata, amendmentPostingDatasuccess]);

  const handleAuthorize = (data: AmendmentPostingData) => {
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
    amendmentPostingMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        amendmentPostingDataRefetch();
        setSuccessMsgs("SIP Amendment Posting Authorized successfully");
        setSnackbarOpen(true);
        setIsAmendmentSuccess(true);
      },
      onError: () => {
        setSnackbarErrorOpen(true);
        setErrorMsgs("Error Occured in Authorizing SIP Amendment Posting ");
      },
    });
  };

  // useEffect(() => {
  //   if (amendmentPostingSuccess) {
  //     setSuccessMsgs("SIP Amendment Posting Authorized successfully");
  //     setSnackbarOpen(true);
  //     setSnackbarErrorOpen(false);
  //   }
  // }, [amendmentPostingSuccess]);

  // useEffect(() => {
  //   if (amendmentPostingerror) {
  //     setErrorMsgs("Error Occured in Authorizing SIP Amendment Posting ");
  //   }
  // }, [amendmentPostingerror]);

  const handleReject = (data) => {
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
    amendmentPostingReject(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        amendmentPostingDataRefetch();
        setSuccessMsgs("SIP Amendment Posting Rejected.");
        setSnackbarOpen(true);
        setIsAmendmentSuccess(true);
      },
      onError: () => {
        setSnackbarErrorOpen(true);
        setErrorMsgs("Error Occured in Rejecting SIP Amendment Posting ");
      },
    });
  };

  // useEffect(() => {
  //   if (amendmentRejectSuccess) {
  //     setSuccessMsgs("SIP Amendment Posting Rejected.");
  //     setSnackbarOpen(true);
  //   }
  // }, [amendmentRejectSuccess]);

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
        <Box width="60%">
          <DateField
            control={control}
            dateLabel1="Date (From)"
            dateLabel2="Date (To)"
          />
        </Box>
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <HeaderDesc title="Table" />
                <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                  <ExportButtonSip
                    exportUrl={`${BASE_URL}/sip-up/api/v1/sip/sip-amendment-list/`}
                    fileName={`Amendment Posting.csv`}
                    fromDate={searchData.from_date}
                    toDate={searchData.to_date}
                  />
                </Box>
              </Box>
              <PostingTable
                data={tableData}
                columns={AmendmentPostingTableHeaders}
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
                    title2="Reject"
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
          </Box>
        )}
      </Box>
    </>
  );
};

export default AmendmentPosting;
