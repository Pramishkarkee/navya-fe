import { Typography, Box, Modal, Button, Grid, useTheme } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  useCancelFixedDeposit,
  useSettleFixedDepositData,
} from "services/Fixed Deposit/FixedDepositService";
import { colorTokens } from "../../theme";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";

// Modal component to display fixed deposit details and handle cancellation
const FixedDepositDetailsModal = ({ open, setOpen, data }) => {
  const [successbarOpen, setSuccessbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);

  const [successbarSettelOpen, setSuccessbarSettelOpen] =
    useState<boolean>(false);
  const [errorbarSettelOpen, setErrorbarSettelOpen] = useState<boolean>(false);

  const {
    mutate: cancelDeposit,
    isSuccess,
    isError,
  } = useCancelFixedDeposit(data["Deposit ID"]);

  const {
    mutate: settleDeposit,
    isSuccess: settelSuccess,
    isError: settelError,
  } = useSettleFixedDepositData(data["Deposit ID"]);

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      setSuccessbarOpen(true);
    }
    if (isError) {
      setOpen(false);
      setErrorbarOpen(true);
    }
  }, [isError, isSuccess, setOpen]);

  useEffect(() => {
    if (settelSuccess) {
      setOpen(false);
      setSuccessbarSettelOpen(true);
    }
    if (settelError) {
      setOpen(false);
      setErrorbarSettelOpen(true);
    }
  }, [settelError, settelSuccess, setOpen]);

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [confirmSettleOpen, setConfirmSettleOpen] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [settlementErrorMessage, setSettlementErrorMessage] =
    useState<string>("");

  const handleClose = () => setOpen(false);

  const handleCancel = () => {
    setConfirmOpen(true);
  };

  const handleSettle = () => {
    setConfirmSettleOpen(true);
  };
  const handleConfirmCancel = (value) => {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const formattedDate = formatDate(today);

    const payload = {
      is_cancelled: "true",
      cancelled_date: formattedDate,
      cancellation_charge: Number(value),
    };

    cancelDeposit(payload, {
      onSuccess: () => {
        setSuccessbarOpen(true);
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(
            error.response.data.details
              ? error.response.data.details
              : "Error occured while cancelling fixed deposit"
          );
        }
        setErrorbarOpen(true);
      },
    });
    setConfirmOpen(false);
    setOpen(false);
  };

  const handleConfirmSettle = () => {
    settleDeposit(data["Deposit ID"], {
      onSuccess: () => {
        setSuccessbarSettelOpen(true);
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          setSettlementErrorMessage(
            error.response.data.details
              ? error.response.data.details
              : "Error occured while settling fixed deposit"
          );
        }
        setErrorbarSettelOpen(true);
      },
    });
    setConfirmSettleOpen(false);
    setOpen(false);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleConfirmSettleClose = () => {
    setConfirmSettleOpen(false);
  };

  const theme = useTheme();

  return (
    <>
      <SuccessBar
        snackbarOpen={successbarOpen}
        message={"Successfully Cancled!"}
        setSnackbarOpen={setSuccessbarOpen}
      />
      <ErrorBar
        snackbarOpen={errorbarOpen}
        setSnackbarOpen={setErrorbarOpen}
        message={errorMessage}
      />

      <SuccessBar
        snackbarOpen={successbarSettelOpen}
        message={"Successfully Settled!"}
        setSnackbarOpen={setSuccessbarSettelOpen}
      />
      <ErrorBar
        snackbarOpen={errorbarSettelOpen}
        message={settlementErrorMessage}
        setSnackbarOpen={setErrorbarSettelOpen}
      />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            bgcolor: "background.paper",
            borderRadius: "8px",
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Deposit Details
          </Typography>

          {/* {Object.entries(data).map(([key, value]) => (
          <Typography key={key} sx={{ mt: 2 }}>
            {key}: {String(value)}
          </Typography>
        ))} */}

          <Grid
            container
            sx={{ mt: 2.5, columnGap: { xs: 4, lg: 6 }, rowGap: 1.5 }}
          >
            {Object.entries(data).map(([key, value]) => (
              <Grid
                item
                xs={5.5}
                key={key}
                sx={{
                  borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
                }}
              >
                <Typography
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontWeight: "bold" }}>{key} </span>
                  <span style={{ color: theme.palette.secondary[700] }}>
                    {" "}
                    {String(value)}{" "}
                  </span>
                </Typography>
              </Grid>
            ))}
          </Grid>

          {data.Status === "Matured" ? (
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <InfoIcon color="disabled" />
              <Typography sx={{ color: colorTokens.grey[500] }}>
                This fixed deposit has reached it’s maturity date. It can now be
                settled
              </Typography>
            </Box>
          ) : null}

          <Button
            variant="contained"
            sx={{
              mt: 2,
              mx: 2,
              backgroundColor: theme.palette.secondary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.main,
              },
            }}
            onClick={handleCancel}
          >
            Cancel Fixed Deposit
          </Button>

          {data.Status === "Matured" ? (
            <Button
              variant="outlined"
              sx={{
                mt: 2,
                color: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.mediumColor,
                },
              }}
              onClick={handleSettle}
            >
              Settle Fixed Deposit
            </Button>
          ) : null}
        </Box>
      </Modal>

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
            Confirmation
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to cancel this Fixed Deposit?
          </Typography>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
            <Button
              sx={{
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                },
              }}
              variant="contained"
              onClick={() => handleConfirmCancel(data["Cancellation Charge"])}
            >
              Confirm
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

      <Modal open={confirmSettleOpen} onClose={handleConfirmSettleClose}>
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
            Confirmation
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to Settle this Fixed Deposit?
          </Typography>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
            <Button
              sx={{
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                },
              }}
              variant="contained"
              onClick={handleConfirmSettle}
            >
              Confirm
            </Button>
            <Button
              sx={{
                color: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.mediumColor,
                },
              }}
              variant="outlined"
              onClick={handleConfirmSettleClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

// Function to calculate interest amount
const calculateInterestAmount = (depositAmount, interestRate) => {
  const principal = parseFloat(depositAmount);
  const rate = parseFloat(interestRate);
  const interestAmount = principal * (rate / 100);
  return interestAmount.toFixed(2);
};
export interface FDTableList {
  id: number;
  tax_on_interest_rate: string;
  deposit_method: string;
  account_number: string;
  transfer_charges: string;
  deposit_amount: string;
  interest_interval: string;
  interest_rate: string;
  deposit_date: string;
  maturity_date: string;
  cancellation_charge: string;
  remarks: any;
  cancelled_date: any;
  created_at: string;
  updated_at: string;
  bank: string;
  bank_account: number;
  collection_account: number;
  deposit_from: number;
  remaining_days: number;
  fix_deposit_amount: number;
  fix_deposit_start_date: string;
  fix_deposit_end_date: string;
  intervals: string;
  accured_intrest: number;
  reaming_days: number;
}

// Column definitions for the table
export const FixedDepositTableEntryHeader: ColumnDef<FDTableList>[] = [
  {
    header: "Deposit ID",
    accessorKey: "id",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
        >
          {data?.row?.original?.id}
        </Typography>
      );
    },
  },
  {
    header: "FD Name",
    accessorKey: "account_number",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
        >
          {data?.row?.original?.account_number ?? "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Bank Name",
    accessorKey: "bank_name",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
        >
          {data?.row?.original?.bank ?? "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Deposit Date",
    accessorKey: "deposit_date",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            textAlign: "left",
            width: "max-content",
          }}
        >
          {data?.row?.original?.fix_deposit_start_date ?? "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Maturity Date",
    accessorKey: "maturity_date",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            textAlign: "left",
            width: "max-content",
          }}
        >
          {data?.row?.original?.fix_deposit_end_date ?? "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Days until Maturity",
    accessorKey: "days_until_interest",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
        >
          {data?.row?.original?.reaming_days ?? "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Interest Rate (%)",
    accessorKey: "interest_rate",
    cell: (data) => {
      return (
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
        >
          {data?.row?.original?.interest_rate ?? "N/A"}
        </Typography>
      );
    },
  },
  {
    header: "Deposit Amount",
    accessorKey: "deposit_amount",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            textAlign: "right",
            width: "90px",
          }}
        >
          {Number(data?.row?.original?.fix_deposit_amount).toLocaleString() ??
            "N/A"}
        </Typography>
      );
    },
  },

  {
    header: "Accrued Interest",
    accessorKey: "interest_amount",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            textAlign: "right",
            width: { lg: "45px", xl: "92px" },
          }}
        >
          {data?.row?.original?.accured_intrest?.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }) ?? "N/A"}
        </Typography>
      );
    },
  },

  {
    header: "Cancellation Charge (%)",
    accessorKey: "cancellation_charge",
    cell: (data) => {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            textAlign: "right",
            width: { lg: "55px", xl: "130px" },
          }}
        >
          {data?.row?.original?.cancellation_charge
            ? Number(data?.row?.original?.cancellation_charge).toFixed(2)
            : "N/A"}{" "}
        </Typography>
      );
    },
  },

  {
    header: "Actions",
    accessorKey: "actions",
    cell: (data) => {
      const [open, setOpen] = useState<boolean>(false);

      const handleView = () => {
        setOpen(true);
      };

      const depositAmount = data.row.original.fix_deposit_amount;
      const interestRate = data.row.original.interest_rate;
      const interestAmount = calculateInterestAmount(
        depositAmount,
        interestRate
      );

      const remainingDays = data.row.original.reaming_days;
      let depositStatus = "Matured";
      if (remainingDays > 0) {
        depositStatus = "Active";
      }
      const interestFrequency =
        data.row.original.intervals === "monthly"
          ? "Monthly"
          : data.row.original.intervals === "quarterly"
          ? "Quarterly"
          : data.row.original.intervals === "semi-annually"
          ? "Semi-Annually"
          : "Annually";

      const modalData = {
        "Deposit ID": data.row.original.id.toString(),
        "Deposit Amount": data.row.original.fix_deposit_amount || "N/A",
        "Interest Rate": data.row.original.interest_rate || "N/A",
        "Interest Amount": interestAmount || "N/A",
        "Bank Name": data.row.original.bank || "N/A",
        "Cancellation Charge":
          data.row.original.cancellation_charge === null
            ? "N/A"
            : data.row.original.cancellation_charge,
        "Deposit Date": data.row.original.fix_deposit_start_date || "N/A",
        "Maturity Date": data.row.original.fix_deposit_end_date || "N/A",
        "Days Until Next Interest": data.row.original.reaming_days ?? "N/A",
        Interval: interestFrequency || "N/A",
        Status: depositStatus,
      };

      // const transformData = (obj) => {
      //   return Object.fromEntries(
      //     Object.entries(obj).map(([key, value]) => [key, value === null ? 'N/A' : value])
      //   );
      // };

      // const rawData = {
      //   "Deposit ID": data.row.original.id.toString(),
      //   "Deposit Amount": data.row.original.fix_deposit_amount,
      //   "Interest Rate": data.row.original.interest_rate,
      //   "Interest Amount": interestAmount,
      //   "Bank Name": data.row.original.bank,
      //   "Cancellation Charge": data.row.original.cancellation_charge,
      //   "Deposit Date": data.row.original.fix_deposit_start_date,
      //   "Maturity Date": data.row.original.fix_deposit_end_date,
      //   "Days Until Next Interest": data.row.original.reaming_days,
      //   Interval: data.row.original.intervals,
      //   Status: depositStatus,
      // };

      // const modalData = transformData(rawData);

      return (
        <>
          <FixedDepositDetailsModal
            open={open}
            setOpen={setOpen}
            data={modalData}
          />
          <Box
            onClick={handleView}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              gap: 0.6,
              color: colorTokens.mainColor[1100],
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            <Visibility sx={{ fontSize: "14px", fontWeight: 600 }} />
            <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
              View
            </Typography>
          </Box>
        </>
      );
    },
  },
];
