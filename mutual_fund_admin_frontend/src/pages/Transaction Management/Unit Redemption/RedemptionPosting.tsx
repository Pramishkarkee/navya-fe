import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";

import debounce from "utils/Debounce";
import SearchText from "components/Button/Search";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import SuccessBar from "components/Snackbar/SuccessBar";
import PostingTable from "components/Table/PostingTable";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ExportButton from "components/Button/ExportButton";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import DistributionSchemeField from "components/DistributionSchemeField/DistributionSchemeField";
import {
  useGetTotalUnitRedemptionDetailList,
  usePutUnitRedemptionPostingApprove,
  usePutUnitRedemptionPostingReject,
} from "services/unitRedemption/UnitRedemptionServices";

import { distributionCenterOptions } from "constants/Distribution Center Data/distCenterOptions";
import { UnitRedeemptionPostingHeader } from "constants/UnitRedeemption/UnitRedeemptionPostingTableHeader";

interface IFormInput {
  distributionCenter: string;
  schemeName: string;
  startDate: Dayjs;
  endDate: Dayjs;
  postingRemark: string;
  id: any;
}
interface RedemptionPostingProps {
  setBoid: any;
  boid_no?: string;
  id?: any;
}
const RedemptionPosting = ({ boid_no }: RedemptionPostingProps) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [boid, setBoid] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successMsgs, setSuccessMsgs] = useState<string>("");
  const [internalBoid, setInternalBoid] = useState<string>("");
  const [transactionID, setTransactionID] = useState<string>("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isRedemptionSuccess, setIsRedemptionSuccess] =
    useState<boolean>(false);
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [resetCheckBox, setResetCheckBox] = useState<boolean>(false);
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] =
    useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [isAuthorizedOrRejected, setIsAuthorizedOrRejected] =
    useState<boolean>(false);

  const {
    data: unitRedemptionDetailList,
    isSuccess: unitRedemptionDetailListSuccess,
  } = useGetTotalUnitRedemptionDetailList({
    boid_number: boid,
    pageIndex: pagination.pageIndex + 1,
  });

  const { mutate: unitRedemptionPostingMutate } =
    usePutUnitRedemptionPostingApprove();

  const { mutate: unitRedemptionPostingRejectMutate } =
    usePutUnitRedemptionPostingReject();

  const totalPage = Math.ceil(unitRedemptionDetailList?.count / 10);

  const { control, handleSubmit, reset, register, setValue } =
    useForm<IFormInput>({
      defaultValues: {
        distributionCenter: distributionCenterOptions[0],
        schemeName: "Navya Large Cap Fund",
        startDate: dayjs(),
        endDate: dayjs(),
        postingRemark: "",
        id: "",
      },
    });

  useEffect(() => {
    if (boid_no) {
      setInternalBoid(boid_no);
    }
  }, [setInternalBoid, boid_no]);

  const handleSearch = () => {
    if (internalBoid && internalBoid.length === 16) {
      setBoid(internalBoid);
    } else {
      setErrorMsgs("Please enter a valid BOID number.");
      setSnackbarErrorOpen(true);
    }
  };

  useEffect(() => {
    if (unitRedemptionDetailList) {
      setTableData(unitRedemptionDetailList.results);
      setNext(unitRedemptionDetailList.next !== null);
      setPrev(unitRedemptionDetailList.previous !== null);
      if (
        unitRedemptionDetailList?.results?.length === 0 &&
        !isAuthorizedOrRejected
      ) {
        setErrorMsgs("No details available for the given BOID.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [isRedemptionSuccess, unitRedemptionDetailList]);

  useEffect(() => {
    if (unitRedemptionDetailList?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (unitRedemptionDetailList?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [unitRedemptionDetailList, unitRedemptionDetailListSuccess]);

  const handleAuthorize = () => {
    const tempData = selectedRows?.map((item) => item.id);

    if (tempData.length === 0) {
      setErrorMsgs("You must select at least one SIP");
      setSnackbarErrorOpen(true);
      return;
    }
    const finalData = {
      id: tempData,
    };
    unitRedemptionPostingMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        setSuccessMsgs("Unit Redemption Authorized Successfully");
        setSnackbarSuccessOpen(true);
        setIsRedemptionSuccess(true);
        setIsAuthorizedOrRejected(true);
      },
      onError: (error) => {
        setSnackbarErrorOpen(true);

        const errorMessage =
          axios.isAxiosError(error) && error.response
            ? error.response.data?.details
              ? error.response.data.details
              : "Error on submitting"
            : "Network error occurred.";

        setErrorMsgs(errorMessage);
        setSnackbarErrorOpen(true);
      },
    });
    reset();
  };

  const handleReject = () => {
    const tempData = selectedRows?.map((item) => item.id);

    if (tempData.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsgs("You must select at least one SIP");
      return;
    }
    const finalData = {
      id: tempData,
    };
    unitRedemptionPostingRejectMutate(finalData, {
      onSuccess: () => {
        setResetCheckBox(true);
        setSnackbarSuccessOpen(true);
        setSuccessMsgs("Unit Redemption Rejected Successfully");
        setIsAuthorizedOrRejected(true);
      },
      onError: (unitRedemptionPostingRejectError) => {
        setSnackbarErrorOpen(true);

        if (
          axios.isAxiosError(unitRedemptionPostingRejectError) &&
          unitRedemptionPostingRejectError.response
        ) {
          let errorMessage = "An unknown error occurred.";

          if (unitRedemptionPostingRejectError.response) {
            if (
              unitRedemptionPostingRejectError.response.data &&
              unitRedemptionPostingRejectError.response.data.detail
            ) {
              errorMessage =
                unitRedemptionPostingRejectError.response.data.detail;
            } else {
              errorMessage = "Failed to extract error details.";
            }
          }
          setErrorMsgs(errorMessage);
        } else {
          setErrorMsgs("Network error occurred.");
        }
        setSnackbarErrorOpen(true);
      },
    });
  };

  const debouncedSetValue = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 500),
    [setValue]
  );

  return (
    <>
      <SuccessBar
        snackbarOpen={snackbarSuccessOpen}
        setSnackbarOpen={setSnackbarSuccessOpen}
        message={successMsgs}
      />

      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsgs}
      />

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box>
          <DistributionSchemeField
            distribution={false}
            control={control}
            label1="Distribution Center (Request)"
          />
        </Box>
        <HeaderDesc title="Search for Entries" />
        <Box sx={{ width: "100%" }}>
          <TypographyLabel title="BOID" />
          <TextField
            size="small"
            placeholder="BOID Number"
            value={internalBoid}
            onChange={(e) => setInternalBoid(e.target.value)}
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <TypographyLabel title="Transaction ID" />

          <TextField
            size="small"
            placeholder="Transaction ID"
            value={transactionID}
            onChange={(e) => setTransactionID(e.target.value)}
          />
        </Box>

        <Box>
          <RoundedButton
            title1="Search Entries"
            onClick1={handleSubmit(handleSearch)}
          />
        </Box>

        <Box>
          {tableData.length > 0 && (
            <Box component="form" id="redemptionForm">
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <HeaderDesc title="Redemption Entries" />
                <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                  <ExportButton
                    boidNumber={boid}
                    exportUrl={`${BASE_URL}/sip-up/api/v1/unit-purchase/total-redemption-details-list/`}
                    fileName={`Unit Redemption Posting${
                      boid ? ` - ${boid}` : ""
                    }.csv`}
                  />
                </Box>
              </Box>
              <Box>
                <SearchText
                  title="Search"
                  {...register("id")}
                  onChange={(e) => debouncedSetValue(e.target.value)}
                />
              </Box>
              <Box mt={1}>
                <PostingTable
                  data={tableData}
                  columns={UnitRedeemptionPostingHeader}
                  setSelectedRows={setSelectedRows}
                  pagination={pagination}
                  setPagination={setPagination}
                  next={next}
                  prev={prev}
                  pageCount={totalPage}
                  resetSelectionTrigger={resetCheckBox}
                />
              </Box>
              {selectedRows.length > 0 && (
                <>
                  <Box sx={{ width: "100%" }}>
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        Posting Remarks
                      </Typography>
                      <TextField
                        size="medium"
                        placeholder="Remarks"
                        {...control.register("postingRemark")}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <RoundedButton
                      title1="Authorize"
                      title2="Reject"
                      onClick1={handleSubmit(handleAuthorize)}
                      onClick2={handleSubmit(handleReject)}
                    />
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default RedemptionPosting;
