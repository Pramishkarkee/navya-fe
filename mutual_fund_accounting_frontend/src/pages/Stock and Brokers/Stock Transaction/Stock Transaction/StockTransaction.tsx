import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  useTheme,
  MenuItem,
} from "@mui/material";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { transactionOptions } from "constants/Stock Data/StockData";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import RoundedButton from "components/Button/Button";
import ReceiptTable from "components/Table/TanstackTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import {
  useGetBrokerListDate,
  useGetStockSymbolList,
  usePostCreateStockTransaction,
} from "services/Stock Transaction/StockTransactionService";
import { useForm, Controller } from "react-hook-form";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface Transaction {
  original?: Transaction;
  transaction_method: string;
  stock_code: string;
  units: number;
  rate: number;
  broker_code: number;
}

export interface TransactionList {
  transaction_list: Transaction[];
}

const schema = yup
  .object({
    transaction_method: yup.string().required("Transaction Method is required"),
    stock_code: yup.string().required("Stock Code is required"),
    units: yup
      .number()
      .required("Units are required")
      .typeError("Units must be a number"),
    rate: yup
      .number()
      .required("Rate is required")
      .typeError("Rate must be a number")
      .test("decimal", "Rate can only have up to 2 decimal places", (value) =>
        /^\d+(\.\d{1,2})?$/.test(value?.toString())
      ),
    broker_code: yup.number().required("Broker Code is required"),
  })
  .required();

const StockTransaction = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [showTransactions, setShowTransactions] = useState<boolean>(false);
  const [stockSymbols, setStockSymbols] = useState<any[]>([]);
  const [brokerCodeDropdown, setBrokerCodeDropdown] = useState<any[]>([]);
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] =
    useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [successMsgs, setSuccessMsgs] = useState<string>("");
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [emptyStockSymbol, setEmptyStockSymbol] = useState<boolean>(false);
  const [emptyBrokerCode, setEmptyBrokerCode] = useState<boolean>(false);
  const [broker, setBroker] = useState<string>();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Transaction>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      transaction_method: "purchase",
      stock_code: "",
      units: 0,
      rate: 0,
      broker_code: null,
    },
  });

  const { data: brokerData } = useGetBrokerListDate(broker);
  const { data: stockSymbol } = useGetStockSymbolList();

  const {
    mutate: CreateStockTransaction,
    isSuccess: CreateStockTransactionSuccess,
    isError: CreateStockTransactionError,
  } = usePostCreateStockTransaction();

  useEffect(() => {
    if (CreateStockTransactionSuccess) {
      setSuccessMsgs("Stock Transaction Entry Request has been submitted.");
      setSnackbarSuccessOpen(true);
      reset();
    } else if (CreateStockTransactionError) {
      setSnackbarErrorOpen(true);
    }
  }, [CreateStockTransactionSuccess, reset, CreateStockTransactionError]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (stockSymbol?.responseData) {
      const dataEmpty = stockSymbol.responseData.length === 0;
      if (dataEmpty) {
        setEmptyStockSymbol(true);
      }
      const formattedStockSymbols = stockSymbol.responseData.map((item) => ({
        stock_name: item.stock_name,
        symbol: item.symbol,
      }));
      setStockSymbols(formattedStockSymbols);
    }
  }, [stockSymbol]);

  useEffect(() => {
    if (brokerData?.responseData) {
      const dataEmpty = brokerData.responseData.length === 0;
      if (dataEmpty) {
        setEmptyBrokerCode(true);
      }
      const formattedBrokers = brokerData.responseData.map((item) => ({
        broker_name: item.broker_name,
        broker_code: item.broker_code,
      }));
      setBrokerCodeDropdown(formattedBrokers);
    }
  }, [brokerData]);

  const onSubmit = (data: Transaction) => {
    const newTransaction: Transaction = {
      ...data,
      broker_code: Number(data.broker_code),
      units: Number(data.units),
      rate: Number(data.rate),
    };
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      newTransaction,
    ]);
    setShowTransactions(true);
    reset();
  };

  const handleCompleteTransaction = async () => {
    try {
      const sanitizedTransactions: Transaction[] = transactions.map(
        ({ original, ...rest }) => ({
          ...rest,
          units: Number(rest.units),
          rate: Number(rest.rate),
        })
      );
      const payload = { transaction_list: sanitizedTransactions };
      await CreateStockTransaction(payload, {
        onSuccess: () => {
          localStorage.removeItem("transactions");
          setTransactions([]);
          setShowTransactions(false);
          reset();
        },
        onError: (error) => {
          setSnackbarErrorOpen(true);
          if (axios.isAxiosError(error) && error.response) {
            setErrorMsgs(
              error.response.data.detail
                ? error.response.data.detail
                : error.response.data.errors
                ? error.response.data.errors[1].stock_code
                : error.response.data.details
                ? error.response.data.details[0]
                : "Error completing transaction!"
            );
          } else {
            setErrorMsgs(error.message);
          }
        },
      });
      localStorage.removeItem("transactions");
      setTransactions([]);
      setShowTransactions(false);
    } catch (error) {
      console.error("Error completing transaction:", error);
    }
  };

  const handleEdit = (item: Transaction) => {
    setSelectedTransaction({ ...item, original: item });
    setOpenEditDialog(true);
  };

  const handleDelete = (item: Transaction) => {
    setSelectedTransaction(item);
    setOpenDeleteDialog(true);
  };

  const handleEditSave = () => {
    if (selectedTransaction) {
      const updatedTransaction: Transaction = {
        ...selectedTransaction,
        units: Number(selectedTransaction.units),
        rate: Number(selectedTransaction.rate),
      };
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction === selectedTransaction.original
            ? updatedTransaction
            : transaction
        )
      );
      setSelectedTransaction(null);
      setOpenEditDialog(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedTransaction) {
      setTransactions(
        transactions.filter(
          (transaction) => transaction !== selectedTransaction
        )
      );
      setSelectedTransaction(null);
      setOpenDeleteDialog(false);
    }
  };

  const StockTransactionTableEntryHeader: ColumnDef<Transaction>[] = [
    {
      header: "Transaction Method",
      accessorKey: "transaction_method",
      cell: (data) => {
        const transactionMethod = data.row.original.transaction_method;
        const displayTransactionMethod =
          transactionMethod === "purchase" ? "Purchase" : "Sell";
        return (
          <Typography sx={{ fontSize: "0.85rem" }}>
            {displayTransactionMethod}
          </Typography>
        );
      },
    },
    {
      header: "Stock Code",
      accessorKey: "stock_code",
      cell: (data) => (
        <Typography sx={{ fontSize: "0.85rem" }}>
          {data.row.original.stock_code}
        </Typography>
      ),
    },
    {
      header: "Units",
      accessorKey: "units",
      cell: (data) => (
        <Typography sx={{ fontSize: "0.85rem" }}>
          {data.row.original.units}
        </Typography>
      ),
    },
    {
      header: "Rate",
      accessorKey: "rate",
      cell: (data) => (
        <Typography sx={{ fontSize: "0.85rem" }}>
          {" "}
          {data.row.original.rate}
        </Typography>
      ),
    },
    {
      header: "Broker Code",
      accessorKey: "broker_code",
      cell: (data) => (
        <Typography sx={{ fontSize: "0.85rem" }}>
          {data.row.original.broker_code}
        </Typography>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (data) => (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 0.6 }}>
          <Button
            onClick={() => handleEdit(data.row.original)}
            variant="text"
            color="primary"
          >
            <EditOutlinedIcon sx={{ color: "#3E2723" }} />
          </Button>
          <Button
            onClick={() => handleDelete(data.row.original)}
            variant="text"
            color="primary"
          >
            <DeleteOutlineOutlinedIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box
      component="form"
      sx={{ width: { xs: "70%", lg: "80%" } }}
      onSubmit={handleSubmit(onSubmit)}
    >
      {(emptyStockSymbol || emptyBrokerCode) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "630px",
            gap: "3px",
            backgroundColor: theme.palette.grey[200],
            padding: "10px",
            color: theme.palette.grey[600],
            borderRadius: "50px",
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: "18px" }} />
          <Typography
            sx={{
              fontSize: "15px",
              color: theme.palette.grey[600],
            }}
          >
            Transaction limits for stocks and stock brokers need to be set for
            them to appear in the dropdowns.
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <HeaderDesc title="Transaction Details" />
        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <Box sx={{ flex: "calc(50% - 1rem)" }}>
            <TypographyLabel title="Transaction Type" />
            <Controller
              name="transaction_method"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  renderValue={(value) => (
                    <Typography
                      sx={{
                        color:
                          value === "purchase"
                            ? "green"
                            : theme.palette.error.main,
                      }}
                    >
                      {value === "purchase" ? "Purchase" : "Sell"}
                    </Typography>
                  )}
                  size="small"
                  fullWidth
                  error={!!errors.transaction_method}
                >
                  <MenuItem
                    sx={{
                      color: "green",
                    }}
                    value="purchase"
                  >
                    Purchase
                  </MenuItem>
                  <MenuItem
                    sx={{
                      color: theme.palette.error.main,
                    }}
                    value="sell"
                  >
                    Sell
                  </MenuItem>
                </Select>
              )}
            />
            {errors.transaction_method && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.transaction_method.message}
              </Typography>
            )}
          </Box>

          <Box sx={{ flex: "calc(50% - 1rem)" }}>
            <TypographyLabel title="Broker Code" />

            <Controller
              name="broker_code"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  options={brokerCodeDropdown}
                  getOptionLabel={(option) =>
                    `${option.broker_name} (${option.broker_code})`
                  }
                  value={
                    brokerCodeDropdown.find(
                      (option) => option.broker_code === field.value
                    ) || null
                  }
                  onChange={(event, value) => {
                    if (value) {
                      field.onChange(value.broker_code);
                    } else {
                      field.onChange(null);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.broker_code}
                      helperText={errors.broker_code?.message}
                    />
                  )}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: "calc(50% - 1rem)" }}>
            <TypographyLabel title="Stock Symbol" />

            <Controller
              name="stock_code"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  value={
                    stockSymbols.find(
                      (stock) => stock.symbol === field.value
                    ) || null
                  }
                  options={stockSymbols}
                  getOptionLabel={(option) =>
                    `${option.stock_name} (${option.symbol})`
                  }
                  onChange={(event, value) => {
                    if (value) {
                      field.onChange(value.symbol);
                    } else {
                      field.onChange("");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.stock_code}
                      helperText={errors.stock_code?.message}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      {option.stock_name} ({option.symbol})
                    </li>
                  )}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: "calc(50% - 1rem)" }}>
            <TypographyLabel title="Units" />
            <Controller
              name="units"
              control={control}
              render={({ field }) => (
                <TextField
                  placeholder="Please Enter Units"
                  sx={{ width: "100%" }}
                  size="small"
                  {...field}
                  error={!!errors.units}
                  helperText={errors.units?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: "calc(50% - 1rem)" }}>
            <TypographyLabel title="Rate" />
            <Controller
              name="rate"
              control={control}
              render={({ field }) => (
                <TextField
                  placeholder="Please Enter Rate"
                  sx={{ width: "50%" }}
                  size="small"
                  {...field}
                  error={!!errors.rate}
                  helperText={errors.rate?.message}
                  onChange={(e) => {
                    const value = e.target.value;
                    const regex = /^\d*\.?\d{0,2}$/;
                    if (regex.test(value)) {
                      field.onChange(value);
                    }
                  }}
                />
              )}
            />
          </Box>

          <Box></Box>
        </Box>
      </Box>
      <Box mt={2}>
        <RoundedButton
          title1="Add Transaction"
          onClick1={handleSubmit(onSubmit)}
        />
      </Box>
      {showTransactions && (
        <Box sx={{ mt: 2 }}>
          <HeaderDesc title="Transaction Entries" />
          <Box
            sx={{
              mt: 1.5,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <Box>
              <ReceiptTable
                columns={StockTransactionTableEntryHeader}
                data={transactions}
              />
            </Box>
          </Box>
          <Box mt={2}>
            <RoundedButton
              title1="Complete Transaction"
              onClick1={handleCompleteTransaction}
            />
          </Box>
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

      {showTransactions && (
        <Box>
          <Dialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
          >
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <Box sx={{ flex: "calc(50% - 1rem)" }}>
                  <TypographyLabel title="Transaction Type" />
                  <Autocomplete
                    size="small"
                    options={transactionOptions}
                    value={selectedTransaction?.transaction_method || ""}
                    onChange={(event, value) =>
                      setSelectedTransaction((prev) =>
                        prev
                          ? { ...prev, transaction_method: value || "" }
                          : null
                      )
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
                <Box sx={{ flex: "calc(50% - 1rem)" }}>
                  <TypographyLabel title="Stock Symbol" />
                  <Autocomplete
                    size="small"
                    options={stockSymbols}
                    value={selectedTransaction?.stock_code || ""}
                    onChange={(event, value) =>
                      setSelectedTransaction((prev) =>
                        prev ? { ...prev, stock_code: value || "" } : null
                      )
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
                <Box sx={{ flex: "calc(50% - 1rem)" }}>
                  <TypographyLabel title="Broker Code" />

                  <Autocomplete
                    size="small"
                    options={brokerCodeDropdown}
                    getOptionLabel={(option) =>
                      `${option.broker_name} (${option.broker_code})`
                    }
                    value={
                      brokerCodeDropdown.find(
                        (option) =>
                          option.broker_code ===
                          selectedTransaction?.broker_code
                      ) || null
                    }
                    onChange={(event, value) =>
                      setSelectedTransaction((prev) =>
                        prev
                          ? { ...prev, broker_code: value?.broker_code || "" }
                          : null
                      )
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
                <Box sx={{ flex: "calc(50% - 1rem)" }}>
                  <TypographyLabel title="Rate" />
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    value={selectedTransaction?.rate || ""}
                    onChange={(e) =>
                      setSelectedTransaction((prev) =>
                        prev ? { ...prev, rate: Number(e.target.value) } : null
                      )
                    }
                  />
                </Box>
                <Box sx={{ flex: "calc(50% - 1rem)" }}>
                  <TypographyLabel title="Unit" />
                  <TextField
                    sx={{ width: "100%" }}
                    size="small"
                    value={selectedTransaction?.units || ""}
                    onChange={(e) =>
                      setSelectedTransaction((prev) =>
                        prev ? { ...prev, units: Number(e.target.value) } : null
                      )
                    }
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleEditSave} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this transaction?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDeleteDialog(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
};

export default StockTransaction;
