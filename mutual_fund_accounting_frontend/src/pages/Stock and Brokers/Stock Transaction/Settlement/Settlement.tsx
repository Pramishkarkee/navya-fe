import React, { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import {
  Autocomplete,
  Box,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { Empty } from "antd";
//mui icons
import Add from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import debounce from "utils/Debounce";
import DateFormatter from "utils/DateFormatter";
import SearchText from "components/Button/Search";
import { useGlobalStore } from "store/GlobalStore";
import ErrorBar from "components/Snackbar/ErrorBar";
import { axiosInstance } from "config/axiosInstance";
import RoundedButton from "components/Button/Button";
import DateField from "components/DateFilter/DateField";
import SuccessBar from "components/Snackbar/SuccessBar";
import { PostingTable } from "components/Table/PostingTable";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import {
  useGetAllStockTransactionListByID,
  useGetBrokerListDate,
  useGetStockTransactionListDate,
  usePatchStockDetails,
  usePostCreateSettlementTransaction,
} from "services/Stock Transaction/StockTransactionService";
import {
  SettlementTableColumns,
  SettlementTableHeaders,
} from "constants/Stock Transaction/SettlementTable";

export interface Settlement {
  sn: number;
  bank_name: string;
  bank_account: number;
  txn_type: string;
  payment_id: string;
  txn_amount: number;
}

export interface SettlementList {
  id: number;
  stock_transaction_id: number;
  narration: string;
  settlement_date: string;
  settlement_list: Settlement[];
}

const schema = yup
  .object()
  .shape({
    stock_transaction_id: yup.number().label("Stock Transaction ID"),
    settlement_list: yup.mixed(),
    narration: yup.string().optional(),
    settlement_date: yup.string(),
    startDate: yup.object().required(),
    endDate: yup.object().required(),
  })
  .required();

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
    width: "20%",
  },
  {
    label: "Cheque / Payment ID",
    width: "20%",
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

  "&.MuiTableCell-root:last-child": {
    borderRight: "none",
  },
}));

export default function Settlement() {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      stock_transaction_id: 17,
      narration: "",
      startDate: dayjs(),
      endDate: dayjs(),
      settlement_date: dayjs().format("YYYY-MM-DD"),
    },
  });

  const allotmentDate = useGlobalStore((state) => state.allotmentDate);

  const [id, setId] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<SettlementTableHeaders[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successMsgs, setSuccessMsgs] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);

  const [snackbarSuccessOpen, setSnackbarSuccessOpen] =
    useState<boolean>(false);
  const [resetCheckbox, setResetCheckBox] = useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  // Editable field state variables
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [rate, setRate] = useState<string>(selectedRow?.rate || "");
  const [basePrice, setBasePrice] = useState<number>(
    selectedRow?.base_price || 0
  );
  const [commissionRate, setCommissionRate] = useState<string>(
    selectedRow?.commission_rate || "NA"
  );
  const [sebon, setSebon] = useState<string>(selectedRow?.sebon_charge || "");
  const [dpCharge, setDpCharge] = useState(selectedRow?.dp_charge || "");

  const [sebonChargePct, setSebonChargePct] = useState<number>(
    selectedRow?.sebon_charge_pct || 0
  );

  const [capitalGainTax, setCapitalGainTax] = useState<string>(
    selectedRow?.capital_gain_tax || "NA"
  );
  const [effectiveRate, setEffectiveRate] = useState<string>(
    selectedRow?.effective_rate || "NA"
  );
  const [totalAmount, setTotalAmount] = useState<number>(
    selectedRow?.total_amount || 0
  );

  const [quantity, setQuantity] = useState<string>(selectedRow?.units || "NA");

  const [brokerCodeDropdown, setBrokerCodeDropdown] = useState<any[]>([]);
  const [rows, setRows] = useState([
    {
      sn: 1,
      bank_name: "",
      bank_id: null,
      bank_account: 0,
      txn_type: "fund_transfer",
      payment_id: "",
      txn_amount: null,
    },
  ]);

  const [BankOptions, setBankOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const [AllBanks, setAllBanks] = useState([]);
  const [bankInitials, setBankInitial] = useState<string>("");
  const [CurrentAccounts, setCurrentAccounts] = useState<
    {
      CURRENT: any;
      bank_id: any;
      account_id: number;
      account_number: string;
    }[]
  >([]);
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const watchedRate = watch("rate", rate);
  const watchedUnits = watch("units", quantity);
  const watchedBrokerCharge = watch("commission_rate", commissionRate);
  const watchedSebonCharge = watch("sebon_charge", sebon);
  const watchedDpCharge = watch("dp_charge", dpCharge);
  const watchedCGT = watch("capital_gain_tax", capitalGainTax);

  const isSellTransaction = selectedRow?.txn_type === "sell";

  useEffect(() => {
    const rateValue = parseFloat(watchedRate || 0);
    const unitsValue = parseFloat(watchedUnits || 0);
    const commissionValue = parseFloat(watchedBrokerCharge || 0);
    const sebonValue = parseFloat(watchedSebonCharge || 0);
    const dpChargeValue = parseFloat(watchedDpCharge || 0);
    const cgtValue = parseFloat(watchedCGT || 0);

    const newBasePrice = rateValue * unitsValue;
    setBasePrice(newBasePrice);

    // const BrokerRate
    let newTotalAmount = 0;
    if (selectedRow?.txn_type === "purchase") {
      newTotalAmount =
        newBasePrice + (commissionValue + sebonValue + dpChargeValue);
    } else if (selectedRow?.txn_type === "sell") {
      newTotalAmount =
        newBasePrice -
        (commissionValue + sebonValue + dpChargeValue + cgtValue);
    }

    setTotalAmount(newTotalAmount);
  }, [
    watchedRate,
    watchedUnits,
    watchedBrokerCharge,
    watchedSebonCharge,
    watchedDpCharge,
    watchedCGT,
  ]);

  const [broker, setBroker] = useState<string>("Select Broker");
  const { data: brokerData } = useGetBrokerListDate(broker);

  const handleChangeBrokerCode = (e: SelectChangeEvent<typeof broker>) => {
    setBroker(e.target.value);
  };

  const {
    mutate: createSettlementTransactionData,
    isPending: PendingSettlementTrxn,
  } = usePostCreateSettlementTransaction();

  const { mutate: patchStockDetails } = usePatchStockDetails(selectedRow?.id);

  const { data: settlementListDataId } = useGetAllStockTransactionListByID(id);

  const {
    data: stockTransactionListDataByDate,
    isSuccess: stockTransactionListByDateSuccess,
    refetch: refetchStockTransactionListByDate,
  } = useGetStockTransactionListDate(
    searchData?.from_date,
    searchData?.to_date,
    pagination.pageIndex + 1,
    broker === "Select Broker" ? "" : broker
  );

  const totalPageCount = Math.ceil(
    stockTransactionListDataByDate?.responseData?.count / 10
  );

  useEffect(() => {
    if (selectedRows && selectedRows.length > 0) {
      setSelectedRow(selectedRows[0]);
      setRate(String(selectedRows[0]?.rate));
      setBasePrice(selectedRows[0]?.base_price);
      setCommissionRate(selectedRows[0]?.commission_rate);
      setCapitalGainTax(selectedRows[0]?.capital_gain_tax);
      setEffectiveRate(selectedRows[0]?.effective_rate);
      setTotalAmount(selectedRows[0]?.total_amount);
      setSebon(selectedRows[0]?.sebon_charge);
      setDpCharge(Number(selectedRows[0]?.dp_charge));
      setQuantity(String(selectedRows[0]?.units));

      setSebonChargePct(Number(selectedRows[0]?.sebon_charge_pct));

      setRows([
        {
          sn: 1,
          bank_name: "",
          bank_id: null,
          bank_account: 0,
          txn_type: "fund_transfer",
          payment_id: "",
          txn_amount: selectedRows[0]?.total_amount
            ? Number(selectedRows[0]?.total_amount)
            : null,
        },
      ]);
    }
  }, [selectedRows]);

  useEffect(() => {
    if (stockTransactionListDataByDate?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (stockTransactionListDataByDate?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [stockTransactionListDataByDate]);

  useEffect(() => {
    if (id) {
      setDisplayData(
        settlementListDataId ? settlementListDataId?.responseData?.results : []
      );
      setSelectedRows([]);
    } else {
      setDisplayData(
        stockTransactionListDataByDate
          ? stockTransactionListDataByDate?.responseData?.results
          : []
      );
      setSelectedRows([]);
    }
  }, [
    id,
    stockTransactionListDataByDate,
    settlementListDataId?.responseData?.results,
  ]);

  useEffect(() => {
    if (brokerData?.responseData) {
      const formattedOptions = brokerData.responseData.map((broker) => ({
        label: `${broker.broker_name} (${broker.broker_code})`,
        value: broker.broker_code,
      }));
      setBrokerCodeDropdown(formattedOptions);
    }
  }, [brokerData]);

  useEffect(() => {
    if (stockTransactionListByDateSuccess && loadClicked) {
      setDisplayData(
        stockTransactionListDataByDate?.responseData?.results ?? []
      );

      if (
        !stockTransactionListDataByDate?.responseData ||
        stockTransactionListDataByDate?.responseData.length === 0
      ) {
        setErrorMsgs("There is no Unit List Available for the given Date.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [
    stockTransactionListByDateSuccess,
    loadClicked,
    stockTransactionListDataByDate,
    searchData,
  ]);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axiosInstance.get(
          "/accounting/api/v1/banks/bank-balance-list/"
        );
        if (response.data.isSuccess) {
          const options = response.data.responseData.map((bank) => ({
            value: bank.id,
            label: bank.bank_name,
          }));
          setBankOptions(options);
          setAllBanks(response?.data?.responseData);
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
      }
    };

    fetchBankDetails();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...selectedRow,
        rate,
        base_price: basePrice,
        commission_rate: commissionRate,
        capital_gain_tax: capitalGainTax,
        effective_rate: effectiveRate,
        total_amount: totalAmount,
        units: quantity,
        dp_charge: dpCharge,
        sebon_charge: sebon,
      };

      patchStockDetails(updatedData, {
        onSuccess: () => {
          setRows([
            {
              sn: 1,
              bank_name: "",
              bank_id: null,
              bank_account: 0,
              txn_type: "fund_transfer",
              payment_id: "",
              txn_amount: null,
            },
          ]);

          setSuccessMsgs("Stock Transaction updated successfully.");
          setSnackbarSuccessOpen(true);
        },

        onError: (error) => {
          setSnackbarErrorOpen(true);
          if (axios.isAxiosError(error) && error.response) {
            setErrorMsgs(
              error.response.data.rate
                ? error.response.data.rate[0]
                : error.response.data.base_price
                ? error.response.data.base_price[0]
                : error.response.data.capital_gain_tax
                ? error.response.data.capital_gain_tax[0]
                : error.response.data.total_amount
                ? error.response.data.total_amount[0]
                : "Error updating Stock Transaction."
            );
          } else {
            setErrorMsgs("Error updating Stock Transaction.");
          }
        },
      });
    } catch (error) {
      setErrorMsgs("Error updating Stock Transaction.");
      setSnackbarErrorOpen(true);
    }
  };

  const handleStockSettlementDetails = async (data: SettlementList) => {
    const tempData = selectedRows?.map((item) => item.id);
    if (tempData.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsgs("You must select at least one row.");
      return;
    }
    const formData = getValues();

    const updatedRows = rows.map((row) => {
      const updatedRow = {
        ...row,
        bank_account: Number(row.bank_account),
        bank_name: row.bank_name,
        txn_amount: Number(row.txn_amount),
        txn_type: row.txn_type,
        payment_id: row.payment_id,
      };

      return updatedRow;
    });

    const totalChequeAmount = rows.reduce(
      (sum, row) => sum + (row.txn_amount || 0),
      0
    );

    if (Number(totalChequeAmount) !== Number(totalAmount.toFixed(2))) {
      setErrorMsgs(
        `Total cheque amount (${totalChequeAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}) must equal total amount (${totalAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}).`
      );
      setSnackbarErrorOpen(true);
      return;
    }

    try {
      await createSettlementTransactionData(
        {
          ...data,
          settlement_list: updatedRows,
          stock_transaction_id: selectedRows && selectedRows[0]?.id,
          settlement_date: dayjs(formData.settlement_date).format("YYYY-MM-DD"),
          narration: data.narration,
        },
        {
          onSuccess: () => {
            reset();
            setSelectedRows([]);
            setResetCheckBox(true);
            setRows([
              {
                sn: 1,
                bank_name: "",
                bank_id: null,
                bank_account: 0,
                txn_type: "fund_transfer",
                payment_id: "",
                txn_amount: null,
              },
            ]);
            setSuccessMsgs(
              "Stock Transaction Settlement Entry Request has been submitted successfully."
            );
            setSnackbarSuccessOpen(true);
          },
          onError: (error) => {
            setSnackbarErrorOpen(true);

            if (axios.isAxiosError(error) && error.response) {
              const details = error.response.data.details;

              if (details && details.length > 0) {
                setErrorMsgs(details[0]);
              } else {
                const settlementError =
                  error.response.data.settlement_list?.["0"];

                if (
                  settlementError?.details &&
                  settlementError.details.length > 0
                ) {
                  setErrorMsgs(settlementError.details[0]);
                } else {
                  setErrorMsgs(
                    settlementError?.bank_name
                      ? "Bank Name may not be null."
                      : settlementError?.bank_account
                      ? "Bank Account may not be null."
                      : settlementError?.txn_type
                      ? "Payment Method may not be null."
                      : settlementError?.payment_id
                      ? "Payment ID may not be null."
                      : settlementError?.txn_amount
                      ? "Amount may not be null."
                      : settlementError?.settlement_date
                      ? "Settlement Date may not be null."
                      : "Error submitting Stock Transaction Settlement Entry."
                  );
                }
              }
            }
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleRowChange = (index: number, field: string, value: any) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];

      if (field === "bank_name") {
        const selectedBank = AllBanks.find((bank) => bank.id === value?.value);

        updatedRows[index][field] = value ? value.label : "";
        updatedRows[index]["bank_id"] = value ? value.value : undefined;

        updatedRows[index]["bank_account"] = undefined;

        setBankInitial(selectedBank?.bank_initials || "");
        // const currentAccounts = selectedBank?.bank_accounts?.CURRENT || [];
        const currentAccounts =
          selectedBank?.bank_accounts?.filter((account) => account?.CURRENT) ||
          [];

        setCurrentAccounts(currentAccounts);
      } else if (field === "bank_account") {
        updatedRows[index][field] = value ? value : "";
      } else {
        updatedRows[index][field] = value;
      }

      // Add cheque-related fields only if "cheque" is selected
      // if (field === "txn_type" && value === "cheque") {
      //   updatedRows[index]["cheque_date"] =
      //     updatedRows[index]["cheque_date"] || "";
      //   updatedRows[index]["cheque_number"] =
      //     updatedRows[index]["cheque_number"] || "";
      // }

      return updatedRows;
    });
  };

  const handleLoad = (data) => {
    setId(data.id || "");
    if (data?.startDate && data?.endDate) {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatter.format(toDate.toISOString());

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

  const handleDeleteClick = (index: number) => {
    if (rows.length === 1) return;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows.map((row, idx) => ({ ...row, sn: idx + 1 })));
  };

  const handleReset = () => {
    setId("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
    refetchStockTransactionListByDate();
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      setValue("id", value);
    }, 500),
    [setValue]
  );

  return (
    <React.Fragment>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 1 }}
      >
        <Box sx={{ width: "50px" }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              width: "max-content",
              borderBottom: `1px solid ${theme.palette.secondary.main}`,
            }}
          >
            {" "}
            Settlement Queue{" "}
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(handleLoad)}
          sx={{ width: "100%", display: "flex", gap: 3, marginTop: 1 }}
        >
          <SearchText
            title="Search"
            {...register("id")}
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          />
          <Box sx={{ mt: -2.5 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
            />
          </Box>
          <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
        </Box>
        <Box sx={{ marginLeft: "0px" }}>
          <FormControl
            size="small"
            sx={{ margin: 0, padding: 0, maxHeight: "40px" }}
          >
            <Select
              autoWidth
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: "250px",
                    maxWidth: "auto",
                    overflowY: "auto",
                  },
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={broker}
              onChange={handleChangeBrokerCode}
              size="small"
              IconComponent={() => null}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TuneIcon sx={{ color: "#616161", cursor: "pointer" }} />
                  {selected}
                  <ArrowDropDownIcon
                    sx={{ color: "#616161", cursor: "pointer" }}
                  />
                </Box>
              )}
              variant="outlined"
              sx={{
                mt: 1,
                borderBlockColor: "white",
                borderRadius: "24px",
                backgroundColor: theme.palette.primary.light,
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiOutlinedInput-input": {
                  ml: "6px",
                },
              }}
            >
              {brokerCodeDropdown.map((option) => (
                <MenuItem
                  sx={{ maxHeight: "40px" }}
                  key={option.value}
                  value={option.value}
                >
                  {option.value === " " ? "Select Broker" : option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          {displayData?.length > 0 ? (
            <Box
              sx={{
                maxWidth: "1500px",
                width: { md: "110%", lg: "165%", xl: "165%" },
              }}
            >
              <PostingTable
                columns={SettlementTableColumns}
                data={displayData}
                setSelectedRows={setSelectedRows}
                pagination={pagination}
                setPagination={setPagination}
                next={next}
                prev={prev}
                pageCount={totalPageCount}
                resetSelectionTrigger={resetCheckbox}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                ml: { md: 5, lg: 20 },
                mt: 5,
              }}
            >
              <Empty
                imageStyle={{ height: 150, width: 150 }}
                description="No Data Available"
              />
              <Typography
                onClick={handleReset}
                sx={{
                  color: theme.palette.primary[1100],
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset Filters
              </Typography>
            </Box>
          )}
        </Box>

        {selectedRows.length !== 0 && (
          <Box>
            <Box
              sx={{
                maxWidth: "1500px",
                width: { md: "110%", lg: "165%", xl: "165%" },
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        lineHeight: "17px",
                        borderColor: theme.palette.primary.dark,
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#000000",
                        padding: 1,
                      }}
                    >
                      {selectedRows[0]?.txn_id}
                    </Typography>

                    <Typography
                      sx={{
                        flexDirection: "row-reverse",
                        cursor: "pointer",
                        color: theme.palette.secondary.main,
                        fontWeight: "medium",
                      }}
                      onClick={handleEditToggle}
                    >
                      {isEditing ? "Cancel Edit" : "Edit Details"}
                    </Typography>
                  </Box>
                  <Divider />
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500 }}>
                            Company Name
                          </TableCell>
                          <TableCell>{selectedRows[0]?.stock_code}</TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>
                            Quantity
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <TextField
                                size="small"
                                sx={{ width: "100%" }}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                              />
                            ) : quantity ? (
                              new Intl.NumberFormat("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(parseFloat(quantity))
                            ) : (
                              "0.00"
                            )}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>Rate</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <TextField
                                size="small"
                                sx={{ width: "100%" }}
                                value={rate}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const regex = /^\d*\.?\d{0,2}$/;
                                  if (regex.test(value)) {
                                    setRate(value);
                                  }
                                }}
                              />
                            ) : rate ? (
                              new Intl.NumberFormat("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(parseFloat(rate))
                            ) : (
                              "0.00"
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500 }}>
                            Base Price
                          </TableCell>
                          <TableCell>
                            {/* {isEditing ? (
                              <TextField
                                size="small"
                                sx={{ width: "100%" }}
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                              />
                            ) : basePrice ? (
                              parseFloat(basePrice).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            ) : (
                              0
                            )} */}

                            {/* {parseFloat(selectedRows[0]?.base_price).toLocaleString()} */}
                            {basePrice
                              ? basePrice
                                  .toLocaleString
                                  // undefined,
                                  // {
                                  //   minimumFractionDigits: 2,
                                  //   maximumFractionDigits: 2,
                                  // }
                                  ()
                              : 0.0}
                          </TableCell>

                          <TableCell sx={{ fontWeight: 500 }}>
                            Broker Charge
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <TextField
                                size="small"
                                sx={{ width: "100%" }}
                                value={commissionRate}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const regex = /^\d*\.?\d{0,2}$/;
                                  if (regex.test(value)) {
                                    setCommissionRate(value);
                                  }
                                }}
                              />
                            ) : commissionRate ? (
                              parseFloat(commissionRate).toLocaleString()
                            ) : (
                              0
                            )}
                            {/* {broker_charge ? parseFloat(broker_charge).toFixed(2) : 0} */}
                          </TableCell>

                          <TableCell sx={{ fontWeight: 500 }}>
                            SEBON Charge
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <TextField
                                size="small"
                                sx={{ width: "100%" }}
                                value={sebon}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const regex = /^\d*\.?\d{0,2}$/;
                                  if (regex.test(value)) {
                                    setSebon(value);
                                  }
                                }}
                                inputProps={{
                                  readOnly: false,
                                }}
                              />
                            ) : sebon ? (
                              parseFloat(sebon).toLocaleString()
                            ) : (
                              0
                            )}
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell sx={{ fontWeight: 500 }}>
                            DP Charge
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <TextField
                                size="small"
                                sx={{ width: "100%" }}
                                value={dpCharge}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const regex = /^\d*\.?\d{0,2}$/;
                                  if (regex.test(value)) {
                                    setDpCharge(value);
                                  }
                                }}
                              />
                            ) : dpCharge ? (
                              parseFloat(dpCharge).toLocaleString()
                            ) : (
                              0
                            )}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>
                            Capital Gain Tax
                          </TableCell>
                          <TableCell>
                            {isSellTransaction && isEditing ? (
                              <TextField
                                size="small"
                                sx={{ width: "100%" }}
                                value={capitalGainTax}
                                onChange={(e) =>
                                  setCapitalGainTax(e.target.value)
                                }
                              />
                            ) : capitalGainTax ? (
                              parseFloat(capitalGainTax).toLocaleString()
                            ) : (
                              0
                            )}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>
                            Total Payable
                          </TableCell>
                          <TableCell>
                            {/* {isEditing ? (
                              <TextField
                                size="small"
                                sx={{ width: "100%" }}
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                              />
                            ) : totalAmount ? (
                              totalAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            ) : (
                              0
                            )} */}
                            {/* {parseFloat(selectedRows[0]?.total_amount).toLocaleString(
                            )} */}

                            {selectedRow?.total_amount
                              ? totalAmount.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : 0.0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {/* <TableCell sx={{ fontWeight: 500 }}>Amount</TableCell>
                                                    <TableCell>{selectedRows[0]?.total_amount}</TableCell> */}
                          {/* <TableCell sx={{ fontWeight: 500 }}>WACC Rate</TableCell>
                                                    <TableCell>
                                                        {isEditing ? (
                                                            <TextField
                                                                size="small"
                                                                sx={{ width: "100%" }}
                                                                value={effectiveRate}
                                                                onChange={(e) => setEffectiveRate(e.target.value)}
                                                            />
                                                        ) : (
                                                            effectiveRate ? parseFloat(effectiveRate).toFixed(2) : 'NA'

                                                        )}
                                                    </TableCell> */}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
              {isEditing && (
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <RoundedButton title1="Save" onClick1={handleSave} />
                </Box>
              )}
            </Box>
            <Box sx={{ width: "50px", mt: 3, mb: 1 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "19px",
                  color: "#212121",
                  textAlign: "center",
                  width: "max-content",
                  borderBottom: `1px solid ${theme.palette.secondary.main}`,
                }}
              >
                Settlement Date
              </Typography>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ margin: 0, padding: 0 }}>
                <Controller
                  name="settlement_date"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      sx={{
                        width: "30%",
                        "& .MuiSvgIcon-root": {
                          width: "16px",
                          height: "16px",
                        },
                      }}
                      slotProps={{ textField: { size: "small" } }}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) =>
                        field.onChange(
                          date ? dayjs(date).format("YYYY-MM-DD") : null
                        )
                      }
                      minDate={dayjs(allotmentDate)}
                    />
                  )}
                />
                {errors.settlement_date && (
                  <Typography
                    color="error"
                    sx={{ fontSize: 12, fontWeight: 400 }}
                  >
                    {"Settlement Date is required."}
                  </Typography>
                )}
              </Box>
            </LocalizationProvider>
            <Box className="Check-details">
              <Box sx={{ my: 2 }}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "19px",
                    color: "#212121",
                    textAlign: "center",
                    width: "max-content",
                    borderBottom: `1px solid ${theme.palette.secondary.main}`,
                  }}
                >
                  Payment Details
                </Typography>
              </Box>

              <Table
                sx={{
                  maxWidth: "1500px",
                  width: { md: "110%", lg: "165%", xl: "165%" },
                }}
              >
                <TableHead>
                  <TableRow>
                    {columns?.map((item, index) => (
                      <DefTableCell
                        key={index}
                        sx={{
                          width: item.width,
                          p: 1.5,
                          textAlign:
                            index === 2 || index === 3 ? "start" : "start",
                        }}
                      >
                        {item.label}
                      </DefTableCell>
                    ))}
                    <DefTableCell
                      sx={{
                        p: 1,
                      }}
                    ></DefTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.keys(row)
                        .filter(
                          (field) =>
                            field !== "bank_id" &&
                            // Exclude cheque fields unless txn_type is 'cheque'
                            (row.txn_type === "cheque" ||
                              (field !== "cheque_date" &&
                                field !== "cheque_no"))
                        )
                        .map((field, cellIndex) => (
                          <DefTableCell
                            key={cellIndex}
                            sx={{
                              border: "1px solid #ccc",
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
                              <Autocomplete
                                size="medium"
                                value={
                                  BankOptions.find(
                                    (option) => option.label === row[field]
                                  ) || null
                                }
                                onChange={(event, newValue) =>
                                  handleRowChange(
                                    rowIndex,
                                    "bank_name",
                                    newValue
                                  )
                                }
                                options={BankOptions}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                  <TextField {...params} variant="outlined" />
                                )}
                              />
                            ) : cellIndex === 2 ? (
                              <Autocomplete
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
                              />
                            ) : cellIndex === 3 ? (
                              <Select
                                sx={{ width: "100%" }}
                                size="medium"
                                value={row[field]}
                                inputProps={{
                                  readOnly: false,
                                  disableUnderline: true,
                                }}
                                onChange={(e) =>
                                  handleRowChange(
                                    rowIndex,
                                    field,
                                    e.target.value
                                  )
                                }
                              >
                                <MenuItem value="cheque">Cheque</MenuItem>
                                <MenuItem selected value="fund_transfer">
                                  Fund Transfer
                                </MenuItem>
                              </Select>
                            ) : (
                              // : row.txn_type === "cheque" &&
                              //   cellIndex === 4 &&
                              //   field === "cheque_date" ? (
                              //   <LocalizationProvider dateAdapter={AdapterDayjs}>
                              //     <Box sx={{ margin: 0, padding: 0 }}>
                              //       <Controller
                              //         name={`settlement_list.${rowIndex}.cheque_date`}
                              //         control={control}
                              //         render={({ field: controllerField }) => (
                              //           <DatePicker
                              //             {...controllerField}
                              //             sx={{
                              //               width: "100%",
                              //               "& .MuiSvgIcon-root": {
                              //                 width: "16px",
                              //                 height: "16px",
                              //               },
                              //             }}
                              //             slotProps={{
                              //               textField: { size: "medium" },
                              //             }}
                              //             value={
                              //               controllerField.value
                              //                 ? dayjs(controllerField.value)
                              //                 : null
                              //             }
                              //             onChange={(date) => {
                              //               const formattedDate = date
                              //                 ? dayjs(date).format("YYYY-MM-DD")
                              //                 : null;
                              //               handleRowChange(
                              //                 rowIndex,
                              //                 "cheque_date",
                              //                 formattedDate
                              //               );
                              //               controllerField.onChange(
                              //                 formattedDate
                              //               );
                              //             }}
                              //           />
                              //         )}
                              //       />
                              //     </Box>
                              //   </LocalizationProvider>
                              // ) : row.txn_type === "cheque" &&
                              //   cellIndex === 5 &&
                              //   field === "cheque_no" ? (
                              //   <TextField
                              //     fullWidth
                              //     size="medium"
                              //     value={row.cheque_no || ""}
                              //     onChange={(e) =>
                              //       handleRowChange(
                              //         rowIndex,
                              //         "cheque_no",
                              //         e.target.value
                              //       )
                              //     }
                              //   />
                              // )
                              <TextField
                                fullWidth
                                size="medium"
                                value={row[field] === 0 ? "" : row[field]}
                                onChange={(e) =>
                                  handleRowChange(
                                    rowIndex,
                                    field,
                                    e.target.value
                                  )
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
                              />
                            )}
                          </DefTableCell>
                        ))}
                      <DefTableCell sx={{ textAlign: "center" }}>
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
                        border: "1px solid #ccc",
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          setRows([
                            ...rows,
                            {
                              sn: rows.length + 1,
                              bank_name: "",
                              bank_id: null,
                              bank_account: 0,
                              txn_type: "fund_transfer",
                              payment_id: "",
                              txn_amount: null,
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
                        sx={{ border: "1px solid #ccc" }}
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

            <Box sx={{ mt: 2 }}>
              <TypographyLabel title="Narration" />
              <Controller
                name="narration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="medium"
                    sx={{ width: "200px" }}
                    multiline
                    minRows={2}
                    placeholder="Remarks"
                  />
                )}
              />
            </Box>
            <RoundedButton
              title1="COMPLETE SETTLEMENT"
              onClick1={handleSubmit(handleStockSettlementDetails)}
              loading={PendingSettlementTrxn}
            />
          </Box>
        )}

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
      </Box>
    </React.Fragment>
  );
}
