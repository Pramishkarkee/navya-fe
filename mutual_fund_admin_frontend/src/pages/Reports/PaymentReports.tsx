import React, { useCallback, useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import PaymentHistoryChart from "components/Reports/PaymentChart";
import SearchText from "components/Button/Search";
import debounce from "utils/Debounce";

import { useGetNAVHistory } from "services/Dashboard/dashboardServices";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReceiptTable from "components/Table/TanstackTable";
import { TransactionHistoryHeader } from "constants/ReportsTableHeader/TransactionHistoryTableHeader";
import { VendorDetailsHeader } from "constants/ReportsTableHeader/VendorDetailsTableHeader";

const StaticData = [
  {
    date_time: "2024-12-06",
    txn_id: "3654625",
    vendor: "esewa",
    boid: "1370025468798521",
    name: "Mohan",
    amount: 4000,
    phone: "9876543210",
  },
  {
    date_time: "2024-12-06",
    txn_id: "3654625",
    vendor: "esewa",
    boid: "1370025468798521",
    name: "Mohan",
    amount: 4000,
    phone: "9876543210",
  },
  {
    date_time: "2024-12-06",
    txn_id: "3654625",
    vendor: "esewa",
    boid: "1370025468798521",
    name: "Mohan",
    amount: 4000,
    phone: "9876543210",
  },
  {
    date_time: "2024-12-06",
    txn_id: "3654625",
    vendor: "esewa",
    boid: "1370025468798521",
    name: "Mohan",
    amount: 4000,
    phone: "9876543210",
  },
];

const StaticVendorData = [
  {
    vendor: "Esewa",
    volume: "25,400",
    txn: "5102",
    success_rate: "50%",
  },
  {
    vendor: "Esewa",
    volume: "25,400",
    txn: "5102",
    success_rate: "50%",
  },
  {
    vendor: "Esewa",
    volume: "25,400",
    txn: "5102",
    success_rate: "50%",
  },
  {
    vendor: "Esewa",
    volume: "25,400",
    txn: "5102",
    success_rate: "50%",
  },
  {
    vendor: "Esewa",
    volume: "25,400",
    txn: "5102",
    success_rate: "50%",
  },
];

const PaymentReports = () => {
  const theme = useTheme();
  const [timeData, setTimeData] = useState<string | null>("1month");
  const [paymentMethod, setPaymentMethod] = useState<string | null>("esewa");
  const [allPaymentMethod, setAllPaymentMethod] = useState<string | null>(
    "all"
  );
  const [searchTransactionValue, setSearchTransactionValue] = useState<
    string | null
  >("");
  const [searchVendorDetails, setSearchVendorDetails] = useState<string | null>(
    ""
  );
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const { data: navvalue } = useGetNAVHistory(timeData);

  const handleChangeTime = (e: { target: { value: any } }) => {
    const newTimefield = e.target.value as string;
    setTimeData(newTimefield);
  };

  const handlePaymentMethod = (e: { target: { value: any } }) => {
    const newMethodfield = e.target.value as string;
    setPaymentMethod(newMethodfield);
  };

  const transactionValueSearch = useCallback(
    debounce((value) => {
      setSearchTransactionValue(value);
    }, 500),
    [searchTransactionValue]
  );
  const vendorDetailsSearch = useCallback(
    debounce((value) => {
      setSearchVendorDetails(value);
    }, 500),
    [searchVendorDetails]
  );

  return (
    <React.Fragment>
      <Box
        sx={{
          mt: 2,
          width: { md: "110%", lg: "115%", xl: "120%" },
          maxWidth: "1900px",
        }}
      >
        <Box>
          <HeaderDesc title="Transaction History" />
          <Box sx={{ mt: 1 }}>
            <TypographyLabel title="Filters" />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, width: "30%" }}>
                <Select
                  size="small"
                  fullWidth
                  onChange={handleChangeTime}
                  value={timeData}
                  sx={{ borderRadius: "6px" }}
                >
                  <MenuItem value="1week">1 Week</MenuItem>
                  <MenuItem value="1month">1 Month</MenuItem>
                  <MenuItem value="3month">3 Month</MenuItem>
                  <MenuItem value="6month">6 Month</MenuItem>
                  <MenuItem value="1year">1 Year</MenuItem>
                </Select>

                <Select
                  size="small"
                  fullWidth
                  onChange={handlePaymentMethod}
                  value={paymentMethod}
                  sx={{ borderRadius: "6px" }}
                >
                  <MenuItem value="esewa">Esewa</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="khalti">Khalti</MenuItem>
                  <MenuItem value="ime">IME</MenuItem>
                  <MenuItem value="connectips">Connect IPS</MenuItem>
                </Select>
              </Box>
              <Box>
                <PaymentHistoryChart data={navvalue} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <HeaderDesc title="Transaction History" />
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <SearchText
              title="Search"
              onChange={(e) => transactionValueSearch(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={(newValue) => setDate(newValue)}
                maxDate={dayjs()}
                sx={{
                  borderRadius: "24px",
                  backgroundColor: theme.palette.secondary[100],
                }}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
            <Select
              size="small"
              fullWidth
              onChange={(e) => setAllPaymentMethod(e.target.value)}
              value={allPaymentMethod}
              sx={{
                borderRadius: "24px",
                width: "200px",
                borderBlockColor: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiInputBase-input": {
                  marginLeft: "24px",
                },
                "& .MuiSelect-icon": {
                  display: "none",
                },
                "&.MuiOutlinedInput-root": {
                  backgroundColor: theme.palette.secondary[100],
                },
              }}
              startAdornment={
                <TuneIcon sx={{ position: "absolute", left: 10 }} />
              }
            >
              <MenuItem value="all">ALL Gateways</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="esewa">Esewa</MenuItem>
              <MenuItem value="khalti">Khalti</MenuItem>
              <MenuItem value="ime">IME</MenuItem>
              <MenuItem value="connectips">Connect IPS</MenuItem>
            </Select>
          </Box>
          <Box>
            <ReceiptTable
              data={StaticData}
              columns={TransactionHistoryHeader}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <HeaderDesc title="Vendor Details" />
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <SearchText
              title="Search"
              onChange={(e) => vendorDetailsSearch(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={(newValue) => setDate(newValue)}
                maxDate={dayjs()}
                sx={{
                  borderRadius: "24px",
                  backgroundColor: theme.palette.secondary[100],
                }}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            <ReceiptTable
              data={StaticVendorData}
              columns={VendorDetailsHeader}
            />
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default PaymentReports;
