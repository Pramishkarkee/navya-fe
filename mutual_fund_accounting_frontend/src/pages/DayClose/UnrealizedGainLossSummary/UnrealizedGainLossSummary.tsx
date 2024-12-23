import React, { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Empty } from "antd";
import { PaginationState } from "@tanstack/react-table";
import { Box, Button, Modal, Typography, useTheme } from "@mui/material";

import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import SuccessBar from "components/Snackbar/SuccessBar";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import { PostingTable } from "components/Table/PostingTable";
import { UnrealizedGainLossTableHeader } from "constants/UnrealizedGainLoss/UnrealizedGainLossTableHeader";
import {
  useGetUnrealizedGainLossSummary,
  usePostUnrealizedGainLossSummary,
} from "services/UnrealizedGainLosssummary/UnrealizedGainLossServices";

export interface GainLossData {
  unrealized_gain_loss: string;
  close_price: number;
  effective_rate: number;
  units: number;
  investment_amount: number;
  stock_type: string;
  market_value: number;
  change_price: number;
  business_date: string;
  stock_symbol: string;
  stock_name: string;
}

const UnrealizedGainLossSummary = () => {
  const theme = useTheme();
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successMsgs, setSuccessMsgs] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [tableData, setTableData] = useState<GainLossData[]>([]);
  const [selectedRows, setSelectedRows] = useState<GainLossData[]>([]);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] =
    useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: unrealizedGainLossData } = useGetUnrealizedGainLossSummary(
    pagination.pageIndex + 1,
    pageSize
  );
  const { mutate: unrealizedgainLossMutate } =
    usePostUnrealizedGainLossSummary();

  const totalPageCount = Math.ceil(
    unrealizedGainLossData?.meta?.count / pageSize
  );

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleAuthorize = () => {
    const tempData = {
      symbol: selectedRows[0]?.stock_symbol,
      stock_type: selectedRows[0]?.stock_type,
    };
    unrealizedgainLossMutate(tempData, {
      onSuccess: () => {
        setSuccessMsgs("Unrealized Gain/Loss authorized successfully.");
        setSuccessSnackbarOpen(true);
        setConfirmOpen(false);
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response) {
          setErrorMsgs(
            error.response.data.error
              ? error.response.data.error
              : error.response.data.details
              ? error.response.data.details
              : "Error occured while authorizing Unrealized Gain/Loss."
          );
        }

        setErrorSnackbarOpen(true);
      },
    });
  };

  useEffect(() => {
    setTableData(unrealizedGainLossData?.responseData);
    if (unrealizedGainLossData?.meta?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (unrealizedGainLossData?.meta?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [unrealizedGainLossData]);

  return (
    <React.Fragment>
      <SuccessBar
        snackbarOpen={successSnackbarOpen}
        setSnackbarOpen={setSuccessSnackbarOpen}
        message={successMsgs}
      />
      <ErrorBar
        snackbarOpen={errorSnackbarOpen}
        setSnackbarOpen={setErrorSnackbarOpen}
        message={errorMsgs}
      />

      <Box sx={{ mt: 2 }}>
        <HeaderDesc title="Unrealized Gain/Loss Summary" />
      </Box>
      <Box
        sx={{
          mt: 2,
          width: { sm: "100%", md: "105%", lg: "160%", xl: "165%" },
          maxWidth: "1500px",
        }}
      >
        {tableData?.length > 0 ? (
          <PostingTable
            next={next}
            prev={prev}
            data={tableData ?? []}
            pagination={pagination}
            setPageSize={setPageSize}
            pageCount={totalPageCount}
            setPagination={setPagination}
            setSelectedRows={setSelectedRows}
            columns={UnrealizedGainLossTableHeader}
          />
        ) : (
          <>
            <PostingTable
              data={[]}
              setSelectedRows={setSelectedRows}
              columns={UnrealizedGainLossTableHeader}
            />
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                marginTop: "30px",
              }}
            >
              <Empty imageStyle={{}} description="No Data Available" />
            </Box>
          </>
        )}
      </Box>
      {selectedRows?.length !== 0 && (
        <Box mt={2}>
          <RoundedButton
            title1="Authorize"
            onClick1={() => setConfirmOpen(true)}
          />
          {confirmOpen && (
            <Modal open={confirmOpen} onClose={handleConfirmClose}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "30%",
                  bgcolor: "background.paper",
                  borderRadius: "8px",
                  p: 4,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" component="h2">
                  Authorize Confirmation
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Are you sure you want to Authorize
                  <Typography sx={{ fontWeight: 500 }}>
                    {selectedRows[0]?.stock_symbol}
                  </Typography>
                </Typography>
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    sx={{
                      backgroundColor: theme.palette.secondary.main,
                      "&:hover": {
                        bgcolor: theme.palette.primary.main,
                      },
                    }}
                    variant="contained"
                    onClick={handleAuthorize}
                  >
                    Authorize
                  </Button>
                  <Button
                    sx={{
                      color: theme.palette.secondary.main,
                      "&:hover": {
                        bgcolor: theme.palette.primary.mediumColor,
                      },
                    }}
                    variant="outlined"
                    onClick={handleConfirmClose}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </React.Fragment>
  );
};

export default UnrealizedGainLossSummary;
