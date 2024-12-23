import { useCallback, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  useTheme,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  styled,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";
import ReceiptTable from "components/Table/TanstackTable";
import { DividentSettlementTableColumns } from "constants/Dividends/DividendsSettlementTable";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Add from "@mui/icons-material/Add";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import RoundedButton from "components/Button/Button";
import {
  useGetDividendList,
  usePatchDividendDetails,
  usePostDividendSettlementCreate,
} from "services/Dividend/DividendService";
import { Controller, useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import { PostingTable } from "components/Table/PostingTable";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import dayjs from "dayjs";
import { axiosInstance } from "config/axiosInstance";
import DateField from "components/DateFilter/DateField";
import DateFormatter from "utils/DateFormatter";
import { Empty } from "antd";
import SearchText from "components/Button/Search";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import debounce from "utils/Debounce";
import { useGlobalStore } from "store/GlobalStore";

export interface DividendSettlementData {
  id: number;
  scheme_name: string;
  stock_name: string;
  eligible_share_units: string;
  bonus_percentage: string;
  cash_percentage: string;
  book_closure_date: string;
  dividend_timing: string;
  created_at: string;
  updated_at: string;
  tax_amount: number;
  total_percentage: number;
  stock_symbol: string;
  cash_amount: number;
  bonus_units: number;
  receivable_amount: number;
  narration: string;
}

interface RowData {
  sn: number;
  bank_name: string;
  bank_name_id?: number;
  bank_account: number;
  amount: number;
  txn_type: string;
  payment_id: string;
}
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
const DividendSettlement = () => {
  const allotmentDate = useGlobalStore((state) => state.allotmentDate);

  const theme = useTheme();
  const [id, setId] = useState<number>();
  const [search, setSearch] = useState<string>("");

  const [displayData, setDisplayData] = useState<DividendSettlementData[]>([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] =
    useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successMsgs, setSuccessMsgs] = useState<string>("");

  const [schemaName, setSchemaName] = useState<string>(
    selectedRow?.scheme_name || ""
  );
  const [stockName, setStockName] = useState<string>(
    selectedRow?.stock_name || ""
  );
  const [stockSymbol, setStockSymbol] = useState<string>(
    selectedRow?.stock_symbol || ""
  );
  const [totalPercentage, setTotalPercentage] = useState<string>(
    selectedRow?.total_percentage || ""
  );
  const [cashPercentage, setCashPercentage] = useState<string>(
    selectedRow?.cash_percentage || ""
  );
  const [taxAmount, setTaxAmount] = useState<string>(
    selectedRow?.tax_amount || ""
  );
  const [cashAmount, setCashAmount] = useState<string>(
    selectedRow?.cash_amount || ""
  );
  const [recievableAmount, setRecievableAmount] = useState<number>(
    selectedRow?.recievalbe_amount || 0
  );
  const [bonusUnits, setBonusUnits] = useState<string>(
    selectedRow?.bonus_units || ""
  );
  const [eligibleUnits, setEligibleUnits] = useState<string>(
    selectedRow?.eligible_share_units || ""
  );

  const [bonusPercentage, setBonusPercentage] = useState<string>(
    selectedRow?.bonus_percentage || ""
  );

  const [bankInitials, setBankInitial] = useState<string>("");

  const [searchDividendData, setSearchDividendData] = useState<{
    [key: string]: string;
  }>({
    from_date: "",
    to_date: "",
  });

  const [resetCheckBox, setResetCheckBox] = useState<boolean>(false);

  const { data: dividendData, refetch: dividendRefetch } = useGetDividendList(
    pagination.pageIndex + 1,
    searchDividendData.from_date,
    searchDividendData.to_date,
    search
  );

  const {
    mutate: patchDividendDetails,
    data: DividendUpdatedData,
    isSuccess: patchDividendDetailSuccess,
  } = usePatchDividendDetails(id);

  const {
    mutate: createDividendSettlementData,
    isSuccess: createDividendSettlementDataSuccess,
    isError: createDividendSettlementDataError,
    isPending: createDividendSettlementDataPending,
  } = usePostDividendSettlementCreate();

  const [nextDivident, setNextDivident] = useState<boolean>();
  const [prevDivident, setPrevDivident] = useState<boolean>();

  const totalPagesDivident = Math.ceil(dividendData?.count / 10);

  useEffect(() => {
    if (dividendData?.next === null) {
      setNextDivident(true);
    } else {
      setNextDivident(false);
    }
    if (dividendData?.previous === null) {
      setPrevDivident(true);
    } else {
      setPrevDivident(false);
    }
  }, [dividendData]);

  useEffect(() => {
    if (search) {
      setDisplayData(dividendData ? [dividendData] : []);
      setDisplayData(dividendData?.results || []);
      setSelectedRow(null);
    } else {
      setDisplayData(dividendData?.results || []);
    }
  }, [dividendData, search]);

  useEffect(() => {
    if (selectedRow) {
      setSchemaName(
        DividendUpdatedData
          ? DividendUpdatedData?.data?.scheme_name
          : selectedRow.scheme_name
      );
      setStockName(selectedRow.stock_name);
      setStockSymbol(selectedRow.stock_symbol);
      setTotalPercentage(
        DividendUpdatedData
          ? DividendUpdatedData?.data?.total_percentage
          : selectedRow.total_percentage
      );
      setCashPercentage(
        DividendUpdatedData
          ? DividendUpdatedData?.data?.cash_percentage
          : selectedRow.cash_percentage
      );
      setTaxAmount(
        DividendUpdatedData
          ? DividendUpdatedData?.data?.tax_amount
          : selectedRow.tax_amount
      );
      setCashAmount(
        DividendUpdatedData
          ? DividendUpdatedData?.data?.cash_amount
          : selectedRow.cash_amount
      );
      setRecievableAmount(
        DividendUpdatedData
          ? DividendUpdatedData?.data?.receivable_amount
          : selectedRow.receivable_amount
      );
      setBonusUnits(
        DividendUpdatedData
          ? DividendUpdatedData?.data?.bonus_units
          : selectedRow.bonus_units
      );
      setEligibleUnits(
        DividendUpdatedData
          ? DividendUpdatedData?.data?.eligible_share_units
          : selectedRow.eligible_share_units
      );
      setBonusPercentage(
        DividendUpdatedData
          ? DividendUpdatedData?.data?.bonus_percentage
          : selectedRow.bonus_percentage
      );
    }
  }, [selectedRow, patchDividendDetailSuccess, DividendUpdatedData]);

  const handleRowSelection = (rows) => {
    setSelectedRow(rows.length > 0 ? rows[0] : null);
    if (rows.length > 0) {
      setId(rows[0].id);
    }
  };

  const [rows, setRows] = useState<RowData[]>([
    {
      sn: 1,
      bank_name: "",
      bank_name_id: null,
      bank_account: 0,
      txn_type: "fund_transfer",
      payment_id: "",
      amount: null,
    },
  ]);
  const [BankOptions, setBankOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [CurrentAccounts, setCurrentAccounts] = useState<
    {
      CURRENT: any;
      bank_id: any;
      account_id: number;
      account_number: string;
    }[]
  >([]);
  const [AllBanks, setAllBanks] = useState([]);

  const bankInitialsMap = AllBanks.reduce((acc, bank) => {
    acc[bank.id] = bank.bank_initials;
    return acc;
  }, {});

  const schema = yup
    .object()
    .shape({
      startDate: yup.object().required(),
      endDate: yup.object().required(),
      settlement_date: yup.string(),
      narration: yup.string().optional(),
      schemaN: yup.string().optional(),
    })
    .required();

  const {
    handleSubmit,
    reset,
    control,
    getValues,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: dayjs().subtract(1, "day"),
      endDate: dayjs(),
      settlement_date: dayjs().format("YYYY-MM-DD"),
    },
  });

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
    if (createDividendSettlementDataSuccess) {
      setSuccessMsgs("Dividend  Settlement Entry Request has been submitted.");
      setSnackbarSuccessOpen(true);
      reset();
    } else if (createDividendSettlementDataError) {
      setSnackbarErrorOpen(true);
    }
  }, [
    createDividendSettlementDataSuccess,
    reset,
    createDividendSettlementDataError,
  ]);

  const handleRowChange = (index: number, field: string, value: any) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];

      if (field === "bank_name") {
        const selectedBank = AllBanks.find((bank) => bank.id === value?.value);

        updatedRows[index][field] = value ? value.label : "";
        updatedRows[index]["bank_name_id"] = value ? value.value : undefined;

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

  const handleAddRow = () => {
    const firstRow = {
      sn: rows.length + 1,
      bank_name: "",
      bank_name_id: null,
      bank_account: 0,
      txn_type: "fund_transfer",
      payment_id: "",
      amount: null,
    };

    setRows([...rows, firstRow]);
  };

  const handleDeleteClick = (index: number) => {
    if (rows.length === 1) return;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows.map((row, idx) => ({ ...row, sn: idx + 1 })));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  const handleSave = () => {
    const updatedData = {
      stock_name: stockSymbol,
      cash_amount: Number(cashAmount),
      tax_amount: Number(taxAmount),
      bonus_units: Number(bonusUnits),
      recievable_amount: Number(recievableAmount),
    };

    patchDividendDetails(updatedData, {
      onSuccess: () => {
        setSnackbarSuccessOpen(true);
        setSuccessMsgs("Dividend updated successfully.");
      },
      onError: () => {
        setErrorMsgs("Error updating Dividend.");
        setSnackbarErrorOpen(true);
      },
    });
  };

  const handleDividendSettlementDetails = async (
    data: DividendSettlementData
  ) => {
    if (!selectedRow) {
      setSnackbarErrorOpen(true);
      setErrorMsgs("You must select at least one row.");
      return;
    }

    const formData = getValues();
    const chequeDetails = rows.map((row) => ({
      ...row,
      sn: row.sn,
      bank_name: row.bank_name_id || 0,
      bank_account: Number(row.bank_account),
      txn_type: row.txn_type.toString(),
      payment_id: row.payment_id,
      amount: Number(row.amount),
    }));

    const payload = {
      ...chequeDetails,
      settlement_date: formData.settlement_date,
      remarks: data.narration,
      stock_name: selectedRow.id,
      bank_name: chequeDetails[0]?.bank_name || 0,
      bank_account: chequeDetails[0]?.bank_account || 0,
      txn_type: chequeDetails[0]?.txn_type || "",
      payment_id: chequeDetails[0]?.payment_id || "",
      amount: chequeDetails[0]?.amount || 0,
      sn: chequeDetails[0]?.sn || 0,
    };

    try {
      await createDividendSettlementData(payload, {
        onSuccess: () => {
          setSnackbarSuccessOpen(true);
          setSuccessMsgs(
            "Dividend Settlement Entry Request has been submitted."
          );
          setSelectedRow(null);
          setResetCheckBox(true);
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response) {
            setErrorMsgs(
              error.response.data.details
                ? error.response.data.details
                : error.response.data.bank_name
                ? "Bank Name: " + error.response.data.bank_name[0]
                : error.response.data.bank_account
                ? "Bank Account: " + error.response.data.bank_account[0]
                : error.response.data.txn_type
                ? "Payment Method: " + error.response.data.txn_type[0]
                : error.response.data.amount
                ? "Amount: " + error.response.data.amount[0]
                : error.response.data.payment_id
                ? "Cheque / Payment Id: " + error.response.data.payment_id[0]
                : error.response.data.settlement_date
                ? "Settlement Date: " + error.response.data.settlement_date[0]
                : "Error Occured while submitting Dividend Settlement Entry"
            );
          } else {
            setErrorMsgs(
              "Error Occured while submitting Dividend Settlement Entry."
            );
          }
          setSnackbarErrorOpen(true);
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleLoadDividend = (data) => {
    setSearch(data.search || "");
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatter.format(toDate.toISOString());

      setSearchDividendData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });
      setSelectedRow(null);
    } else {
      setSnackbarErrorOpen(true);
      setErrorMsgs("Both start and end dates must be selected.");
    }
  };

  const handleReset = () => {
    setSearch("");
    setSearchDividendData({
      from_date: "",
      to_date: "",
    });
    dividendRefetch();
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setSearch(value);
      setValue("schemaN", value);
    }, 500),
    [setValue]
  );

  useEffect(() => {
    if (searchDividendData || search) {
      pagination.pageIndex = 0;
    }
  }, [searchDividendData, search]);

  return (
    <>
      <Box>
        <Typography
          sx={{
            fontSize: "16px",
            mb: 2,
            fontWeight: 600,
            lineHeight: "19px",
            color: "#212121",
            textAlign: "center",
            width: "max-content",
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
          }}
        >
          Search Filters
        </Typography>
        <Box sx={{ width: "100%", display: "flex", gap: 3, marginTop: -2 }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 3,
              marginTop: 3,
              ml: -1,
              mb: 3,
            }}
            onSubmit={handleSubmit(handleLoadDividend)}
            component="form"
          >
            <SearchText
              title="Search for Dividends"
              {...register("schemaN")}
              onChange={(e) => debouncedSetId(e.target.value)}
              onClick={handleSubmit(handleLoadDividend)}
            />
            <Box sx={{ mt: -2 }}>
              <DateField
                control={control}
                dateLabel1="Date (From)"
                dateLabel2="Date (To)"
              />
            </Box>
            <RoundedButton
              title1="Load"
              onClick1={handleSubmit(handleLoadDividend)}
            />
          </Box>
        </Box>
      </Box>

      {/* {selectedMenu === "Dividend" ? ( */}
      <Box className="Settlements" sx={{ mt: 2 }}>
        <Box sx={{}}>
          {dividendData?.results?.length === 0 ? (
            <Box
              sx={{
                maxWidth: "1500px",
                width: { md: "105%", lg: "120%", xl: "125%" },
              }}
            >
              <ReceiptTable
                columns={DividentSettlementTableColumns}
                data={[]}
              />
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
                </Typography>{" "}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                maxWidth: "1500px",
                width: { md: "105%", lg: "160%", xl: "165%" },
              }}
            >
              <PostingTable
                columns={DividentSettlementTableColumns}
                data={displayData}
                setSelectedRows={handleRowSelection}
                pagination={pagination}
                setPagination={setPagination}
                next={nextDivident}
                prev={prevDivident}
                pageCount={totalPagesDivident}
                resetSelectionTrigger={resetCheckBox}
              />
            </Box>
          )}
        </Box>
        {selectedRow && (
          <Box>
            <Box
              sx={{
                maxWidth: "1500px",
                width: { md: "105%", lg: "160%", xl: "165%" },
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid",
                    borderRadius: 2,
                    pt: 1,
                    px: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
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
                      Stock Name :- {selectedRow.stock_name}
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
                      {/* This is commented as the Edit functionality is not requried right now */}
                      {/* {isEditing ? "Cancel Edit" : "Edit Details"} */}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 0 }} />

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3 , 1fr)",
                      gap: 2,
                      my: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #d5d5d5",
                        gap: 1,
                        px: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.grey[500],
                          display: "flex",
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        Scheme Name
                      </Typography>

                      <Typography sx={{ fontWeight: 500, fontSize: "0.95rem" }}>
                        {schemaName}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #d5d5d5",
                        gap: 5,
                        px: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.grey[500],
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Stock Symbol
                      </Typography>

                      <Typography sx={{ fontWeight: 500, fontSize: "0.95rem" }}>
                        {stockSymbol}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #d5d5d5",
                        gap: 1,
                        px: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.grey[500],
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Eligible Shares (Units)
                      </Typography>
                      <Typography sx={{ fontWeight: 500, fontSize: "0.95rem" }}>
                        {Number(eligibleUnits).toLocaleString("en-US")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #d5d5d5",
                        gap: 1,
                        px: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.grey[500],
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Cash (%)
                      </Typography>

                      <Typography sx={{ fontWeight: 500, fontSize: "0.95rem" }}>
                        {Number(cashPercentage).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #d5d5d5",
                        gap: 1,
                        px: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.grey[500],
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Cash Amount (NPR)
                      </Typography>
                      {isEditing ? (
                        <TextField
                          size="small"
                          sx={{ width: "50%" }}
                          value={Number(cashAmount)}
                          onChange={(e) => setCashAmount(e.target.value)}
                        />
                      ) : (
                        <Typography
                          sx={{ fontWeight: 500, fontSize: "0.95rem" }}
                        >
                          {Number(cashAmount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #d5d5d5",
                        gap: 1,
                        px: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.grey[500],
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Tax Amount (NPR)
                      </Typography>
                      {isEditing ? (
                        <TextField
                          size="small"
                          sx={{ width: "50%" }}
                          value={Number(taxAmount)}
                          onChange={(e) => setTaxAmount(e.target.value)}
                        />
                      ) : (
                        <Typography
                          sx={{ fontWeight: 500, fontSize: "0.95rem" }}
                        >
                          {Number(taxAmount).toFixed(2)}
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #d5d5d5",
                        gap: 1,
                        px: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.grey[500],
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Bonus (%)
                      </Typography>

                      <Typography sx={{ fontWeight: 500, fontSize: "0.95rem" }}>
                        {Number(bonusPercentage).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #d5d5d5",
                        gap: 1,
                        px: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.grey[500],
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Bonus Units
                      </Typography>
                      {isEditing ? (
                        <TextField
                          size="small"
                          sx={{ width: "50%" }}
                          value={bonusUnits}
                          onChange={(e) => setBonusUnits(e.target.value)}
                        />
                      ) : (
                        <Typography
                          sx={{ fontWeight: 500, fontSize: "0.95rem" }}
                        >
                          {bonusUnits}
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #d5d5d5",
                        gap: 1,
                        px: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.grey[500],
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Recievable Amount (NPR)
                      </Typography>
                      {isEditing ? (
                        <TextField
                          size="small"
                          sx={{ width: "50%" }}
                          value={recievableAmount}
                          onChange={(e) =>
                            setRecievableAmount(Number(e.target.value))
                          }
                        />
                      ) : (
                        <Typography
                          sx={{ fontWeight: 500, fontSize: "0.95rem" }}
                        >
                          {Number(recievableAmount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #d5d5d5",
                        gap: 5,
                        px: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.grey[500],
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Total (%)
                      </Typography>

                      <Typography sx={{ fontWeight: 500, fontSize: "0.95rem" }}>
                        {Number(totalPercentage).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {isEditing && (
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <RoundedButton title1="Save" onClick1={handleSave} />
                </Box>
              )}
            </Box>

            <Box component="form">
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
                    <Typography color="error" sx={{ fontSize: "12px" }}>
                      {"Settlement Date is required."}
                    </Typography>
                  )}
                </Box>
              </LocalizationProvider>
              <Box sx={{ width: "50px", mt: 3 }}>
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
                  Settlement Details
                </Typography>
              </Box>

              <Table
                sx={{
                  maxWidth: "1500px",
                  width: { xs: "50%", md: "110%", lg: "165%" },
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
                    <DefTableCell sx={{ p: 1 }}></DefTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.keys(row)
                        .filter((field) => field !== "bank_name_id")
                        .map((field, cellIndex) => (
                          <DefTableCell
                            key={cellIndex}
                            sx={{
                              border: "1px solid #ccc",
                              textAlign: field === "sn" ? "center" : undefined,
                            }}
                          >
                            {field === "sn" ? (
                              row.sn
                            ) : field === "bank_name" ? (
                              <Autocomplete
                                size="medium"
                                value={
                                  BankOptions.find(
                                    (option) => option.label === row[field]
                                  ) || null
                                }
                                onChange={(event, newValue) =>
                                  handleRowChange(rowIndex, field, newValue)
                                }
                                options={BankOptions}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                  <TextField {...params} variant="outlined" />
                                )}
                              />
                            ) : field === "bank_account" ? (
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
                            ) : field === "txn_type" ? (
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
                            ) : field === "amount" ? (
                              <TextField
                                fullWidth
                                size="medium"
                                value={(row[field] = recievableAmount)}
                                onChange={(e) =>
                                  handleRowChange(
                                    rowIndex,
                                    field,
                                    e.target.value
                                  )
                                }
                                inputProps={{
                                  style: {
                                    textAlign:
                                      field === "amount" ? "end" : "start",
                                  },
                                }}
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
                                  readOnly: field === "sn",
                                  style: {
                                    textAlign:
                                      field === "bank_account" ||
                                      field === "amount" ||
                                      field === "cheque_number"
                                        ? "end"
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
                        onClick={handleAddRow}
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
                    {[...Array(columns.length)].map((_, index) => (
                      <DefTableCell
                        key={index}
                        sx={{ border: "1px solid #ccc" }}
                      ></DefTableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
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
            </Box>

            <Box sx={{ mt: 3 }}>
              <RoundedButton
                title1="Submit Settlement"
                onClick1={handleSubmit(handleDividendSettlementDetails)}
                loading={createDividendSettlementDataPending}
              />
            </Box>
          </Box>
        )}
      </Box>
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
    </>
  );
};

export default DividendSettlement;
