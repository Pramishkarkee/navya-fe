import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import axios from "axios";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import Add from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import debounce from "utils/Debounce";
import DateFormatter from "utils/DateFormatter";
import SearchText from "components/Button/Search";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import { axiosInstance } from "config/axiosInstance";
import SuccessBar from "components/Snackbar/SuccessBar";
import DropdownWithIcon from "components/Button/DropDown";
import { PostingTable } from "components/Table/PostingTable";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import {
  useGetPendingSettlementList,
  useBondSettlementTransaction,
  usePatchBondAndDebentureDetails,
} from "services/BondAndDebenture/BondAndDebenture";
import { useGlobalStore } from "store/GlobalStore";
import {
  SettlementData,
  TransactionSettlementTableList,
} from "constants/Table Headers/BondDebentureTableHeader/BondDebentureSettlementTable";

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

export interface Settlement {
  sn: number;
  bank_account: number;
  payment_method: string;
  payment_id: string;
  amount: number;
}

export interface SettlementList {
  transaction_id: any[];
  narration: string;
  settlement_date: string;

  settlement_list: Settlement[];
}

const schema = yup
  .object()
  .shape({
    settlement_date: yup.string().required("Settlement Date is required."),
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
  const allotmentDate = useGlobalStore((state) => state.allotmentDate);
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
      settlement_date: dayjs(),
    },
  });
  const [displayData, setDisplayData] = useState([]);
  const [bondName, setBondName] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successMsgs, setSuccessMsgs] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<SettlementData[]>([]);
  const [brokerCodeDropdown, setBrokerCodeDropdown] = useState<any[]>([]);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] =
    useState<boolean>(false);

  const [state, setState] = useState<string>("all");
  const [txnType, setTxnType] = useState<string>("all");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [broker, setBroker] = useState<string>("Select Broker");
  const [sebon, setSebon] = useState(selectedRow?.sebon_charge || "");
  const [dpCharge, setDpCharge] = useState(selectedRow?.dp_charge || "");
  const [capitalGainTax, setCapitalGainTax] = useState(
    selectedRow?.cgt_amt || "NA"
  );

  const [totalAmount, setTotalAmount] = useState(selectedRow?.total_amt || 0);

  const [brokerCharge, setBrokerCharge] = useState(
    selectedRow?.broker_charge || 0
  );
  const [rate, setRate] = useState(selectedRow?.txn_price || "");
  const [quantity, setQuantity] = useState(selectedRow?.txn_units || "NA");

  const [basePrice, setBasePrice] = useState(selectedRow?.base_amt || "");

  const watchedRate = watch("txn_price", rate);
  const watchedUnits = watch("txn_units", quantity);
  const watchedBrokerCharge = watch("broker_charge", brokerCharge);
  const watchedSebonCharge = watch("sebon_charge", sebon);
  const watchedDpCharge = watch("dp_charge", dpCharge);
  const watchedCGT = watch("cgt_amt", capitalGainTax);

  useEffect(() => {
    const rateValue = parseFloat(watchedRate || 0);
    const unitsValue = parseFloat(watchedUnits || 0);
    const commissionValue = parseFloat(watchedBrokerCharge || 0);
    const sebonValue = parseFloat(watchedSebonCharge || 0);
    const dpChargeValue = parseFloat(watchedDpCharge || 0);
    const cgtValue = parseFloat(watchedCGT || 0);

    const newBasePrice = rateValue * unitsValue;
    setBasePrice(newBasePrice.toFixed(2));

    let newTotalAmount = 0;
    if (selectedRow?.txn_type === "purchase") {
      newTotalAmount =
        newBasePrice + (commissionValue + sebonValue + dpChargeValue);
    } else if (selectedRow?.txn_type === "sell") {
      newTotalAmount =
        newBasePrice -
        (commissionValue + sebonValue + dpChargeValue + cgtValue);
    }

    setTotalAmount(newTotalAmount.toFixed(2));
  }, [
    watchedRate,
    watchedUnits,
    watchedBrokerCharge,
    watchedSebonCharge,
    watchedDpCharge,
    watchedCGT,
  ]);

  const [rows, setRows] = useState([
    {
      sn: 1,
      bank_name: "",
      bank_id: null,
      bank_account: 0,
      payment_method: "fund_transfer",
      payment_id: "",
      amount: null,
    },
  ]);

  const [BankOptions, setBankOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const [AllBanks, setAllBanks] = useState([]);
  const [bankInitials, setBankInitial] = useState("");
  const [CurrentAccounts, setCurrentAccounts] = useState<
    {
      CURRENT: any;
      bank_id: any;
      account_id: number;
      account_number: string;
    }[]
  >([]);

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);

  const [resetCheckBox, setResetCheckBox] = useState(false);

  const {
    mutate: createSettlementTransactionData,
    isPending: PendingSettlemnetTransaction,
  } = useBondSettlementTransaction();

  const { data: BondPendingSettelmentList, refetch } =
    useGetPendingSettlementList(
      txnType,
      state,
      broker === "Select Broker" ? "" : broker,
      bondName ?? "",
      pagination.pageIndex + 1
    );
  const { mutate: patchStockDetails } = usePatchBondAndDebentureDetails(
    selectedRow?.id
  );

  const totalPageCount = Math.ceil(BondPendingSettelmentList?.meta?.count / 10);

  const handleChangeTxnType = (e: SelectChangeEvent<typeof txnType>) => {
    setTxnType(e.target.value);
  };
  const txnOptions = [
    { value: "all", label: "All" },
    { value: "purchase", label: "Purchase" },
    { value: "sell", label: "Sell" },
  ];

  const handleChangeState = (e: SelectChangeEvent<typeof state>) => {
    setState(e.target.value);
  };
  const stateOptions = [
    { value: "all", label: "All" },
    { value: "listed", label: "Listed" },
    { value: "unlisted", label: "Unlisted" },
  ];

  const handleChangeBrokerCode = (e: SelectChangeEvent<typeof broker>) => {
    setBroker(e.target.value);
  };
  const brokerOptions = brokerCodeDropdown.map((broker) => ({
    value: broker.broker_code,
    label: broker.broker_name + " (" + broker.broker_code + ")",
  }));

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

  useEffect(() => {
    const fetchBrokerCodes = async () => {
      try {
        const response = await axiosInstance.get(
          "/accounting/api/v1/parameters/broker-list"
        );
        if (response.data.isSuccess) {
          setBrokerCodeDropdown(response.data.responseData);
        }
      } catch (error) {
        console.error("Error fetching broker codes:", error);
      }
    };

    fetchBrokerCodes();
  }, []);

  useEffect(() => {
    if (BondPendingSettelmentList?.meta?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (BondPendingSettelmentList?.meta?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [BondPendingSettelmentList]);

  useEffect(() => {
    setDisplayData(
      BondPendingSettelmentList ? BondPendingSettelmentList?.responseData : []
    );
    setSelectedRows([]);
  }, [
    bondName,
    BondPendingSettelmentList?.responseData,
    BondPendingSettelmentList,
  ]);

  useEffect(() => {
    if (selectedRows && selectedRows.length > 0) {
      setSelectedRow(selectedRows[0]);
      setRate(Number(selectedRows[0]?.txn_price).toFixed(2));
      setBasePrice(selectedRows[0]?.base_amt);
      setCapitalGainTax(Number(selectedRows[0]?.cgt_amt).toFixed(2));
      setTotalAmount(selectedRows[0]?.total_amt);
      setSebon(Number(selectedRows[0]?.sebon_charge).toFixed(2));
      setDpCharge(Number(selectedRows[0]?.dp_charge).toFixed(2));
      setBrokerCharge(Number(selectedRows[0]?.broker_charge).toFixed(2));
      setQuantity(Number(selectedRows[0]?.txn_units).toFixed(2));
    }
  }, [selectedRows]);

  useEffect(() => {
    if (loadClicked) {
      setDisplayData(BondPendingSettelmentList?.responseData ?? []);

      if (
        !BondPendingSettelmentList?.responseData ||
        BondPendingSettelmentList?.responseData.length === 0
      ) {
        setErrorMsgs("There is no Unit List Available for the given Date.");
        setSnackbarErrorOpen(true);
      }
    }
  }, [loadClicked, BondPendingSettelmentList, searchData]);

  const handleStockSettlementDetails = async (data: SettlementList) => {
    const tempData = selectedRows?.map((item) => item.id);
    if (tempData.length === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsgs("You must select at least one row.");
      return;
    }
    const formData = getValues();
    const updatedRows = rows.map((row) => ({
      ...row,
      bank_account: Number(row.bank_account),
      amount: Number(row.amount),
      bank_id: row.bank_id,
    }));

    const totalSelectedRows = selectedRows.map((item) => item.id);

    try {
      createSettlementTransactionData(
        {
          ...updatedRows,
          bank_account: updatedRows[0].bank_account,
          txn_type: updatedRows[0].payment_method,
          payment_id: updatedRows[0].payment_id,
          txn_amt: updatedRows[0].amount,
          bank: updatedRows[0].bank_id,
          txn_ids: totalSelectedRows || [],
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
                payment_method: "fund_transfer",
                payment_id: "",
                amount: null,
              },
            ]);
            setSuccessMsgs(
              "Bond and Debenture Settlement submitted successfully."
            );
            setSnackbarSuccessOpen(true);
            refetch();
          },
          onError: (error) => {
            setSnackbarErrorOpen(true);
            if (axios.isAxiosError(error) && error.response) {
              setErrorMsgs(
                error.response.data.details
                  ? error.response.data.details[0]
                  : error.response.data.non_field_errors
                  ? error.response.data.non_field_errors[0]
                  : error.response.data.bank
                  ? "Bank Name may not be null."
                  : error.response.data.bank_account
                  ? error.response.data.bank_account[0]
                  : error.response.data.txn_type
                  ? "Payment Method may not be null."
                  : error.response.data.payment_id
                  ? "Payment ID may not be null."
                  : error.response.data.txn_amt
                  ? error.response.data.txn_amt[0]
                  : "Error Occurred while submitting Bond and Debenture Settlement."
              );
            } else {
              setErrorMsgs(
                "Error Occurred while submitting Bond and Debenture Settlement."
              );
            }
            setSnackbarErrorOpen(true);
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  //   const handleRowChange = (index: number, field: number | string, value) => {
  //     const updatedRows = [...rows];

  //     if (typeof value === "object" && "id" in value) {
  //       updatedRows[index][field] = value.label;
  //       updatedRows[index][`${field}_id`] = value.id;
  //     } else {
  //       updatedRows[index][field] = value;
  //     }
  //     updatedRows[index][field] = value;
  //     setRows(updatedRows);
  //   };
  const handleRowChange = (index: number, field: string, value: any) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];

      if (field === "bank_name") {
        const selectedBank = AllBanks.find((bank) => bank.id === value?.value);

        updatedRows[index][field] = value ? value.label : "";
        updatedRows[index]["bank_id"] = value ? value.value : undefined;

        updatedRows[index]["bank_account"] = undefined;

        setBankInitial(selectedBank?.bank_initials || "");

        const currentAccounts =
          selectedBank?.bank_accounts?.filter((account) => account?.CURRENT) ||
          [];
        setCurrentAccounts(currentAccounts);
      } else if (field === "bank_account") {
        updatedRows[index][field] = value ? value : "";
      } else {
        updatedRows[index][field] = value;
      }

      return updatedRows;
    });
  };

  const handleLoad = (data) => {
    setBondName(data.id || "");
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

  const handleDeleteClick = (index: number) => {
    if (rows.length === 1) return;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows.map((row, idx) => ({ ...row, sn: idx + 1 })));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...selectedRow,
        txn_price: rate,
        base_amt: basePrice,
        sebon_charge: sebon,
        capital_gain_tax: capitalGainTax,
        broker_charge: brokerCharge,
        total_amt: totalAmount,
        dp_charge: dpCharge,
      };

      patchStockDetails(updatedData, {
        onSuccess: () => {
          setRows([
            {
              sn: 1,
              bank_name: "",
              bank_id: null,
              bank_account: 0,
              payment_method: "fund_transfer",
              payment_id: "",
              amount: null,
            },
          ]);

          setSuccessMsgs("Stock Transaction updated successfully.");
          setSnackbarSuccessOpen(true);
        },

        onError: (error) => {
          setSnackbarErrorOpen(true);
          if (axios.isAxiosError(error) && error.response) {
            setErrorMsgs(
              error.response.data.txn_price
                ? error.response.data.txn_price[0]
                : error.response.data.base_amt
                ? error.response.data.base_amt[0]
                : error.response.data.txn_units
                ? error.response.data.txn_units[0]
                : error.response.data.cgt_amt
                ? error.response.data.cgt_amt[0]
                : error.response.data.broker_charge
                ? error.response.data.broker_charge[0]
                : error.response.data.sebon_charge
                ? error.response.data.sebon_charge[0]
                : error.response.data.dp_charge
                ? error.response.data.dp_charge[0]
                : error.response.data.total_amt
                ? error.response.data.total_amt[0]
                : "Error updating Bond & Debenture Transaction."
            );
          } else {
            setErrorMsgs("Error updating Stock Transaction.");
          }
        },
      });
    } catch (error) {
      setErrorMsgs("Error updating Bond & Debenture Transaction.");
      setSnackbarErrorOpen(true);
    }
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setBondName(value ? value : "");
      setValue("id", value);
    }, 500),
    [setValue]
  );

  const handleReset = () => {
    refetch();
    setBondName("");
  };

  const netAmountTotal = selectedRows.reduce((sum, row) => {
    return sum + Number(row.total_amt);
  }, 0);

  return (
    <Box>
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
            Bond/Debenture Transaction Details{" "}
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit(handleLoad)} sx={{}}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 3,
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            <SearchText
              title="Search"
              {...register("id")}
              onChange={(e) => debouncedSetId(e.target.value)}
              onClick={handleSubmit(handleLoad)}
            />

            <Box sx={{ marginLeft: "0px" }}>
              <DropdownWithIcon
                options={txnOptions}
                value={txnType}
                onChange={handleChangeTxnType}
              />
            </Box>

            <Box sx={{ marginLeft: "0px" }}>
              <DropdownWithIcon
                options={stateOptions}
                value={state}
                onChange={handleChangeState}
              />
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
                  renderValue={(selected) => {
                    return (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TuneIcon
                          sx={{ color: "#616161", cursor: "pointer" }}
                        />
                        {selected}
                      </Box>
                    );
                  }}
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
                  {brokerOptions.map((option) => (
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
          </Box>
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
                data={displayData}
                columns={TransactionSettlementTableList}
                setSelectedRows={setSelectedRows}
                pagination={pagination}
                setPagination={setPagination}
                next={next}
                prev={prev}
                pageCount={totalPageCount}
                resetSelectionTrigger={resetCheckBox}
              />
            </Box>
          ) : (
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
                color: "#212121",
                textAlign: "center",
                marginTop: "30px",
                marginLeft: "0px",
              }}
            >
              <Empty imageStyle={{}} description="No Data Available" />
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
                      {selectedRows[0]?.bond_name}
                    </Typography>
                  </Box>
                  <Divider />
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500 }}>
                            Transaction Type
                          </TableCell>
                          <TableCell sx={{ textTransform: "capitalize" }}>
                            {selectedRows[0]?.txn_type}
                          </TableCell>
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
                                onChange={(e) => setRate(e.target.value)}
                              />
                            ) : rate ? (
                              parseFloat(rate).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            ) : (
                              0
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500 }}>
                            Base Price
                          </TableCell>
                          <TableCell>
                            {basePrice
                              ? parseFloat(basePrice).toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )
                              : 0}
                          </TableCell>

                          <TableCell sx={{ fontWeight: 500 }}>
                            Broker Charge
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <TextField
                                size="small"
                                sx={{ width: "100%" }}
                                value={brokerCharge}
                                onChange={(e) =>
                                  setBrokerCharge(e.target.value)
                                }
                              />
                            ) : brokerCharge ? (
                              parseFloat(brokerCharge).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )
                            ) : (
                              0
                            )}
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
                                onChange={(e) => setSebon(e.target.value)}
                              />
                            ) : sebon ? (
                              parseFloat(sebon).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
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
                                onChange={(e) => setDpCharge(e.target.value)}
                              />
                            ) : dpCharge ? (
                              parseFloat(dpCharge).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            ) : (
                              0
                            )}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>
                            Capital Gain Tax
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <TextField
                                size="small"
                                sx={{ width: "100%" }}
                                value={capitalGainTax}
                                onChange={(e) =>
                                  setCapitalGainTax(e.target.value)
                                }
                              />
                            ) : capitalGainTax ? (
                              parseFloat(capitalGainTax).toFixed(2)
                            ) : (
                              0
                            )}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>
                            Total Payable
                          </TableCell>
                          <TableCell>
                            {selectedRow?.total_amt
                              ? parseFloat(totalAmount).toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )
                              : "0.00"}
                          </TableCell>
                        </TableRow>
                        <TableRow></TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
              {isEditing && (
                <Box
                  sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}
                >
                  <RoundedButton title1="Save" onClick1={handleSave} />
                </Box>
              )}
            </Box>
            <Box className="Check-details">
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
                      sx={{
                        fontSize: "12px",
                        fontWeight: 400,
                        marginLeft: "10px",
                      }}
                    >
                      {errors.settlement_date.message.toString()}
                    </Typography>
                  )}
                </Box>
              </LocalizationProvider>
              <Box sx={{ mt: 3 }}>
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
                        .filter((field) => field !== "bank_id")
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
                                          )?.CURRENT?.account_number
                                        }`,
                                      }
                                    : null
                                }
                                onChange={(event, newValue) =>
                                  handleRowChange(
                                    rowIndex,
                                    "bank_account",
                                    newValue ? newValue.id : null
                                  )
                                }
                                options={CurrentAccounts.map((account) => ({
                                  id: account?.CURRENT?.account_id,
                                  label: `(${bankInitials}) ${account?.CURRENT?.account_number}`,
                                }))}
                                getOptionLabel={(option) => option.label}
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
                                <MenuItem value="fund_transfer">
                                  Fund Transfer
                                </MenuItem>
                              </Select>
                            ) : cellIndex === 4 ? (
                              <TextField
                                fullWidth
                                size="medium"
                                value={row.payment_id}
                                onChange={(e) =>
                                  handleRowChange(
                                    rowIndex,
                                    field,
                                    e.target.value
                                  )
                                }
                              />
                            ) : cellIndex === 5 ? (
                              <TextField
                                fullWidth
                                size="medium"
                                value={(row[field] = netAmountTotal)}
                                onChange={(e) =>
                                  handleRowChange(
                                    rowIndex,
                                    field,
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
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
                              payment_method: "fund_transfer",
                              payment_id: "",
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
              loading={PendingSettlemnetTransaction}
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
    </Box>
  );
}
