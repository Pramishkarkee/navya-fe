import React, { useCallback, useState } from "react";
import {
  Autocomplete,
  Box,
  IconButton,
  MenuItem,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";

import dayjs, { Dayjs } from "dayjs";
import { PaginationState } from "@tanstack/react-table";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import debounce from "utils/Debounce";
import SearchText from "components/Button/Search";
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

const columns = [
  {
    label: "S.No",
    width: "4%",
  },
  {
    label: "Bank Name",
    width: "20%",
  },
  {
    label: "Bank Account",
    width: "20%",
  },
  {
    label: "Payment Method",
    width: "12%",
  },
  {
    label: "Payment ID",
    width: "20%",
  },
  {
    label: "Charges",
    width: "10%",
  },
  {
    label: "Amount",
    width: "20%",
  },
];

const DefTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  height: "1rem",
  padding: "0rem",
  lineHeight: 1.5,
  fontFamily: "inherit",
  borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
  borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
}));

interface Row {
  sn: number;
  bank_name: string;
  bank_account: number | null;
  txn_type: string;
  payment_id: string;
  charges: number | null;
  amount: number | null;
}

const RedemptionSettlement = () => {
  const theme = useTheme();
  const [boid, setBoid] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [tempBoid, setTempBoid] = useState<string>("");
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successMsgs, setSuccessMsgs] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | string>(dayjs());
  const [settlementDate, setSettlementDate] = useState<Dayjs | string>(dayjs());

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rows, setRows] = useState<Row[]>([
    {
      sn: 1,
      bank_name: "",
      bank_account: null,
      txn_type: "fund_transfer",
      payment_id: "",
      charges: null,
      amount: null,
    },
  ]);

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] =
    useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);

  const handleSearch = () => {
    if (tempBoid && tempBoid.length === 16) {
      setBoid(tempBoid);
    } else {
      setErrorMsgs("Please enter a valid BOID number.");
      setSnackbarErrorOpen(true);
    }
  };

  const handleRowChange = (index: number, field: string, value: any) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];

      if (field === "bank_name") {
        //  const selectedBank = AllBanks.find((bank) => bank.id === value?.value);

        updatedRows[index][field] = value ? value.label : "";

        updatedRows[index]["bank_account"] = undefined;

        //  setBankInitial(selectedBank?.bank_initials || "");
        // const currentAccounts = selectedBank?.bank_accounts?.CURRENT || [];
        //  const currentAccounts =
        //    selectedBank?.bank_accounts?.filter((account) => account?.CURRENT) ||
        //    [];

        //  setCurrentAccounts(currentAccounts);
      } else if (field === "bank_account") {
        updatedRows[index][field] = value ? value : "";
      } else {
        updatedRows[index][field] = value;
      }

      return updatedRows;
    });
  };

  const handleDeleteClick = (index: number) => {
    if (rows.length === 1) return;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows.map((row, idx) => ({ ...row, sn: idx + 1 })));
  };

  const handleSubmitSettlement = () => {
    console.log("Unit Redemption Settlement entry clicked and posted!!!");
  };

  const debouncedSearchValue = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 500),
    [search]
  );

  console.log("object", rows);
  return (
    <React.Fragment>
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
      <Box sx={{ mt: 2 }}>
        <HeaderDesc title="Search for Entries" />
        <Box sx={{ width: "100%", mt: 1 }}>
          <TypographyLabel title="BOID" />
          <TextField
            size="small"
            placeholder="BOID Number"
            value={tempBoid}
            onChange={(e) => setTempBoid(e.target.value)}
          />
        </Box>
        <Box>
          <RoundedButton title1="Search Entries" onClick1={handleSearch} />
        </Box>
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
          <SearchText
            title="Search..."
            onChange={(e) => debouncedSearchValue(e.target.value)}
          />
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
        <HeaderDesc title="Redemption Entry Details" />
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
        <HeaderDesc title="Select Date" />
        <Box>
          <TypographyLabel title="Settlement Date" />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={settlementDate}
              onChange={(newValue) => setSettlementDate(newValue)}
              slotProps={{ textField: { size: "small" } }}
              sx={{}}
            />
          </LocalizationProvider>
        </Box>
        <Box>
          <HeaderDesc title="Payment Details" />
          <Box sx={{ mt: 2, width: { xs: "110%", lg: "115%" } }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((items, index) => (
                    <DefTableCell
                      key={index}
                      sx={{
                        width: items.width,
                        p: 1.5,
                        textAlign:
                          index === 2 || index === 3 ? "start" : "start",
                      }}
                    >
                      {items.label}
                    </DefTableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Object.keys(row)
                      .filter(
                        (field) =>
                          row.txn_type === "cheque" ||
                          (field !== "cheque_date" && field !== "cheque_no")
                      )
                      .map((field, cellIndex) => (
                        <DefTableCell
                          key={cellIndex}
                          sx={{
                            border: cellIndex !== 0 && "1px solid #ccc",
                            textAlign:
                              cellIndex === 0
                                ? "center"
                                : cellIndex === 2 || cellIndex === 3
                                ? "start"
                                : "start",
                          }}
                        >
                          {cellIndex === 0 ? (
                            row.sn
                          ) : cellIndex === 1 ? (
                            <>
                              {/* // <Autocomplete
                            //   size="medium"

                            // /> */}
                            </>
                          ) : cellIndex === 2 ? (
                            <>
                              {/* <Autocomplete
                              size="medium"
                              value={
                                CurrentAccounts.find(
                                  (account) =>
                                    account?.CURRENT?.account_id ===
                                    row["bank_account"]
                                )
                                  ? {
                                      id: row["bank_account"],
                                      label: `(${bankInitials}) ${
                                        CurrentAccounts.find(
                                          (account) =>
                                            account?.CURRENT?.account_id ===
                                            row["bank_account"]
                                        )?.CURRENT?.account_number || ""
                                      }`,
                                    }
                                  : null
                              }
                              onChange={(event, newValue) => {
                                handleRowChange(
                                  rowIndex,
                                  "bank_account",
                                  newValue ? newValue.id : null
                                );
                              }}
                              options={CurrentAccounts?.map((account) => ({
                                id: account?.CURRENT?.account_id,
                                label: `(${bankInitials}) ${
                                  account?.CURRENT?.account_number || "N/A"
                                }`,
                              }))}
                              getOptionLabel={(option) => option.label || ""}
                              isOptionEqualToValue={(option, value) => {
                                return option?.id === value?.id;
                              }}
                              renderInput={(params) => (
                                <TextField {...params} variant="outlined" />
                              )}
                            /> */}
                            </>
                          ) : cellIndex === 3 ? (
                            <Select
                              size="medium"
                              value={row[field]}
                              inputProps={{
                                readOnly: false,
                                disableUnderline: true,
                              }}
                              onChange={(e) =>
                                handleRowChange(rowIndex, field, e.target.value)
                              }
                              sx={{
                                width: "100%",
                                p: 0,
                                borderRadius: 0,
                                fontSize: "14px",
                                fontWeight: "400px",
                                "& .MuiOutlinedInput-input": {
                                  color: theme.palette.secondary[700],
                                },
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": {
                                    borderColor: "#B2BAC2",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: theme.palette.secondary.main,
                                  },
                                },
                                "& MuiOutlinedInput-input:Mui-focused": {
                                  borderColor: theme.palette.secondary[700],
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "1px solid transparent",
                                  borderRadius: 0,
                                },
                              }}
                            >
                              <MenuItem value="cheque">Cheque</MenuItem>
                              <MenuItem selected value="fund_transfer">
                                Fund Transfer
                              </MenuItem>
                            </Select>
                          ) : (
                            <TextField
                              fullWidth
                              size="medium"
                              value={row[field] === 0 ? "" : row[field]}
                              onChange={(e) =>
                                handleRowChange(rowIndex, field, e.target.value)
                              }
                              inputProps={{
                                readOnly: cellIndex === 0,
                                style: {
                                  textAlign:
                                    cellIndex === 3
                                      ? "start"
                                      : cellIndex === 0
                                      ? "center"
                                      : "start",
                                },
                              }}
                              sx={{
                                p: 0,
                                borderRadius: 0,
                                fontSize: "14px",
                                fontWeight: "400px",
                                "& .MuiOutlinedInput-input": {
                                  color: theme.palette.secondary[700],
                                  width: "100%",
                                },
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-focused fieldset": {
                                    borderColor: theme.palette.secondary.main,
                                  },
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "1px solid transparent",
                                  borderRadius: 0,
                                },
                              }}
                            />
                          )}
                        </DefTableCell>
                      ))}
                    <DefTableCell
                      sx={{
                        textAlign: "center",
                        borderTop: `1px solid ${theme.palette.secondary.lightGrey}`,
                        borderRight: "none",
                      }}
                    >
                      <IconButton onClick={() => handleDeleteClick(rowIndex)}>
                        <DeleteOutlined />
                      </IconButton>
                    </DefTableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <DefTableCell
                    sx={{
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        setRows([
                          ...rows,
                          {
                            sn: rows.length + 1,
                            bank_name: "",
                            bank_account: null,
                            txn_type: "fund_transfer",
                            payment_id: "",
                            charges: null,
                            amount: null,
                          },
                        ]);
                      }}
                      sx={{
                        bgcolor: theme.palette.primary[1100],
                        color: "#fff",
                        p: 0,
                        "&:hover": {
                          bgcolor: theme.palette.secondary.main,
                        },
                      }}
                    >
                      <Add sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                  </DefTableCell>
                  <DefTableCell></DefTableCell>

                  {[...Array(columns.length - 1)].map((_, index) => (
                    <DefTableCell
                      key={index}
                      sx={{
                        border: "1px solid #ccc",
                        "&.MuiTableCell-root:last-child": {
                          borderRight: "none",
                        },
                      }}
                    ></DefTableCell>
                  ))}
                </TableRow>
                <TableRow
                  sx={{
                    bgcolor: theme.palette.background.light,
                    borderBottom: "none",
                  }}
                ></TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>

        <RoundedButton
          title1="Submit Settlement Entry"
          onClick1={handleSubmitSettlement}
        />
      </Box>
    </React.Fragment>
  );
};

export default RedemptionSettlement;
