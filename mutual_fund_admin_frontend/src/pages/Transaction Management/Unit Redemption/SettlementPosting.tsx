import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { PaginationState } from "@tanstack/react-table";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import SuccessBar from "components/Snackbar/SuccessBar";
import PostingTable from "components/Table/PostingTable";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { UnitRedemptionSettlementTableHeader } from "constants/UnitRedeemption/SettlementTableHeader";

const StaticData = [
  {
    purchase_date: "2024-12-10",
    redeemed_lot_units: 100,
    cgt_pct: 0.05,
    cgt_amt: 120,
    exit_load_pct: 0.05,
    exit_load_amt: "10",
    final_sold_amt: 12000,
  },
  {
    purchase_date: "2024-12-10",
    redeemed_lot_units: 100,
    cgt_pct: 0.05,
    cgt_amt: 120,
    exit_load_pct: 0.05,
    exit_load_amt: "10",
    final_sold_amt: 12000,
  },
  {
    purchase_date: "2024-12-10",
    redeemed_lot_units: 100,
    cgt_pct: 0.05,
    cgt_amt: 120,
    exit_load_pct: 0.05,
    exit_load_amt: "10",
    final_sold_amt: 12000,
  },
];

const RedemptionSettlementPosting = () => {
  const theme = useTheme();
  const [boid, setBoid] = useState<string>("");
  // const [search, setSearch] = useState<string>("");
  const [tempBoid, setTempBoid] = useState<string>("");
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successMsgs, setSuccessMsgs] = useState<string>("");
  const [transactionID, setTransactionID] = useState<string>("");
  const [tempTransactionID, setTempTransactionID] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | string>(dayjs());

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] =
    useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);

  const handleSearch = () => {
    if (tempTransactionID) {
      setTransactionID(tempTransactionID);
    } else if (tempBoid && tempBoid.length === 16) {
      setBoid(tempBoid);
    } else {
      setErrorMsgs("Please enter a valid BOID number.");
      setSnackbarErrorOpen(true);
    }
  };

  const handleApproveSettlement = () => {
    console.log("Settlement Approve click!!!!");
  };

  return (
    <React.Fragment>
      <SuccessBar
        snackbarOpen={snackbarSuccessOpen}
        message={successMsgs}
        setSnackbarOpen={setSnackbarSuccessOpen}
      />
      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsgs}
      />

      <Box sx={{ mt: 2 }}>
        <HeaderDesc title="Search for Entries" />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 2,
          }}
        >
          <Box>
            <TypographyLabel title="BOID" />
            <TextField
              size="small"
              placeholder="BOID Number"
              value={boid}
              onChange={(e) => setBoid(e.target.value)}
            />
          </Box>
          <Box>
            <TypographyLabel title="Transaction ID" />
            <TextField
              size="small"
              placeholder="Transaction ID"
              value={tempTransactionID}
              onChange={(e) => setTempTransactionID(e.target.value)}
            />
          </Box>
          <RoundedButton title1="Search Entries" onClick1={handleSearch} />
        </Box>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <HeaderDesc title="Redemption Entries" />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{ textField: { size: "small" } }}
                sx={{}}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            <PostingTable
              data={StaticData}
              columns={UnitRedemptionSettlementTableHeader}
              setSelectedRows={setSelectedRows}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
            />
          </Box>
          <HeaderDesc title="Redemption Settlement Details" />
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: "repeat(4, 1fr)",
              p: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                Transaction ID
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>TXN11082312</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                Transaction Method
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>Fund Transfer</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                Total Redemption Units
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>120</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                Total Invested Amount
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>44000</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                Total Current Value
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>50000</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                Total Exit Load
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>NPR 60 (2%)</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                DP Charges
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>NPR 5</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                SEBON Fee
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>0.00</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                Amount Payable Pre Tax
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>50000</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                Total Capital Gain
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>6000</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                Gain/Loss Status
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>Gain</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.grey[500],
                }}
              >
                Total Net Payable
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>49500</Typography>
            </Box>
          </Box>

          <RoundedButton
            title1="Approve Settlement Entry"
            onClick1={handleApproveSettlement}
          />
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default RedemptionSettlementPosting;
