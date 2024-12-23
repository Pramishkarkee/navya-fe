import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
// import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { useEffect, useState } from "react";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import { useGetAllStockBrokerData } from "services/StockBroker/StockBrokerServices";
import { useGetStockSymbolList } from "services/Stock Transaction/StockTransactionService";
import {
  useGetImportBatchTransactionList,
  usePatchBatchTransactionApproved,
} from "services/BatchTransaction/BatchTransactionServices";
import { PaginationState } from "@tanstack/react-table";
import ReceiptTable from "components/Table/TanstackTable";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Empty } from "antd";

type StockBatchUpdate = {
  sn: number;
  stock__symbol: string;
  value: number;
  business_date: string;
  txn_type: string;
  units: number;
  rate: number;
  amount: number;
  stc_type: string;
  commission_rate: number;
  txn_date: string;
  broker_code: string;
  broker_name: string;
};

const BatchImport = () => {
  const theme = useTheme();
  const [batchSuccess, setBatchSuccess] = useState(false);
  const [batchError, setBatchError] = useState(false);
  const [uploadData, setUploadData] = useState(null);
  const [errorMsgs, setErrorMsgs] = useState("");

  const [brokerCodeDropdown, setBrokerCodeDropdown] = useState([]);
  const [stockSymbolDropdown, setStockSymbolDropdown] = useState([]);

  // const [inputData, setInputData] = useState<boolean>(false);

  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const schema = yup.object().shape({
    broker_code: yup.string().required("Broker Code is required"),
    symbol: yup.string().required("Stock Symbol is required"),
  });

  const {
    // handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      // broker_code: null,
    },
  });

  const BrokerCode = watch("broker_code");
  const stockSymbol = watch("symbol");

  const { data: stockBrokerData, refetch: refetchStockBroker } =
    useGetAllStockBrokerData();
  const { data: stockSymbolData, refetch: refetchSymbolData } =
    useGetStockSymbolList();

  const toalPageCount = Math.ceil(1);

  useEffect(() => {
    if (stockBrokerData) {
      setBrokerCodeDropdown(stockBrokerData.responseData);
    }
    if (stockSymbolData) {
      setStockSymbolDropdown(stockSymbolData.responseData);
    }
  }, [stockBrokerData, stockSymbolData]);

  useEffect(() => {
    if (uploadData?.next === null) {
      setNext(false);
    } else {
      setNext(true);
    }
    if (uploadData?.previous === null) {
      setPrev(false);
    } else {
      setPrev(true);
    }
  }, [uploadData]);

  const { data: BatchTransactionData, refetch: BatchTransactionRefetch } =
    useGetImportBatchTransactionList(BrokerCode ?? "", stockSymbol ?? "");
  const { mutate: handleConfirmBatchUpdateApproved } =
    usePatchBatchTransactionApproved();

  const handleBatchUpdateApprove = async (e) => {
    e.preventDefault();

    const payload = {
      transaction_list: BatchTransactionData?.responseData.map((item) => {
        return {
          id: item.id,
          broker_code: BrokerCode,
          rate: item.rate,
          units: item.units,
          stock_code: stockSymbol,
          transaction_method: item.txn_type,
          // stock_symbol: item.stock__symbol,
          // txn_date: item.txn_date,
          // amount: item.amount,
          // commission_rate: item.commission_rate,
          // total_payable_amount: item.total_payble_amount,
          // stc_type: item.stc_type,
          // business_date: item.business_date,
        };
      }),
    };

    handleConfirmBatchUpdateApproved(payload, {
      onSuccess: () => {
        setBatchSuccess(true);
        setUploadData([]);
      },
      onError: (error) => {
        setBatchError(true);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMsgs(
            error.response?.data?.details
              ? error.response?.data?.details
              : error.response?.data?.non_field_errors
              ? error.response?.data?.non_field_errors[0]
              : error.response.data.stock_code
              ? error.response.data.stock_code
              : "Error while Approving Batch Update!"
          );
        }
      },
    });
  };

  const handleReset = () => {
    // setUploadData([]);
    reset();
    BatchTransactionRefetch();
    refetchStockBroker();
    refetchSymbolData();
  };

  // const handleLoadUpdate = async (data) => {
  // };

  const UploadedPreviewTableHeader: ColumnDef<StockBatchUpdate>[] = [
    {
      header: "Symbol",
      accessorKey: "stock__symbol",
      cell: (data) => {
        return (
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {data.row.original.stock__symbol}
          </Typography>
        );
      },
    },
    {
      header: "Transaction Type",
      accessorKey: "txn_type",
      cell: (data) => {
        return (
          <Typography
            sx={{
              textAlign: "left",
              width: { sm: "40%", md: "30%", lg: "35%" },
              textTransform: "capitalize",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            {data.row.original.txn_type}
          </Typography>
        );
      },
    },
    {
      header: "Broker Code",
      accessorKey: "broker_code",
      cell: (data) => {
        return (
          <Typography
            textAlign="left"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {data.row.original.broker_code}
          </Typography>
        );
      },
    },
    {
      header: "Transaction Date",
      accessorKey: "txn_date",
      cell: (data) => {
        return (
          <Typography
            textAlign="left"
            sx={{ fontSize: "14px", fontWeight: 400 }}
          >
            {data.row.original.txn_date}
          </Typography>
        );
      },
    },

    {
      header: "Quantity",
      accessorKey: "units",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            sx={{ width: "50px", fontSize: "14px", fontWeight: 400 }}
          >
            {data.row.original.units.toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Rate",
      accessorKey: "rate",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            sx={{ width: "28px", fontSize: "14px", fontWeight: 400 }}
          >
            {data.row.original.rate.toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (data) => {
        const amount = data.row.original.rate * data.row.original.units;
        return (
          <Typography
            textAlign="right"
            sx={{ fontSize: "14px", fontWeight: 400, width: "45px" }}
          >
            {amount.toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Commission Rate",
      accessorKey: "commission_rate",
      cell: (data) => {
        return (
          <Typography
            textAlign="right"
            sx={{ fontSize: "14px", fontWeight: 400, width: "100px" }}
          >
            {data.row.original.commission_rate.toLocaleString()}
          </Typography>
        );
      },
    },
    {
      header: "Total Payable Amount",
      accessorKey: "total_payble_amount",
      cell: (data) => {
        const amount =
          data.row.original.rate * data.row.original.units +
          data.row.original.commission_rate;
        return (
          <Typography
            textAlign="center"
            sx={{ fontSize: "14px", fontWeight: "400px" }}
          >
            {amount.toLocaleString()}
          </Typography>
        );
      },
    },
  ];

  return (
    <>
      {/*  <Grid container spacing={3}> */}
      {/* <Grid item xs={12} sm={12} md={12} lg={8}> */}
      <SuccessBar
        snackbarOpen={batchSuccess}
        setSnackbarOpen={setBatchSuccess}
        message={"Batch Approved Successfully."}
      />
      <ErrorBar
        snackbarOpen={batchError}
        setSnackbarOpen={setBatchError}
        message={errorMsgs}
      />

      <Box sx={{ mt: 1, width: "100%" }} component="form">
        <HeaderDesc title="Filter Details" />

        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <Box sx={{ mt: 2, width: "100%" }}>
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
                      helperText={errors.broker_code?.message?.toString()}
                    />
                  )}
                />
              )}
            />
          </Box>
          <Box sx={{ mt: 2, width: "100%" }}>
            <TypographyLabel title="Stock Symbol" />
            <Controller
              name="symbol"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  options={stockSymbolDropdown}
                  getOptionLabel={(option) =>
                    `${option.stock_name} (${option.symbol})`
                  }
                  value={
                    stockSymbolDropdown.find(
                      (option) => option.symbol === field.value
                    ) || null
                  }
                  onChange={(event, value) => {
                    if (value) {
                      field.onChange(value.symbol);
                    } else {
                      field.onChange(null);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.symbol}
                      helperText={errors.symbol?.message?.toString()}
                    />
                  )}
                />
              )}
            />
          </Box>
        </Box>

        {/* <Box mt={1}>
            <RoundedButton
              title1="Load Updates"
              onClick1={handleSubmit(handleLoadUpdate)}
            />
          </Box> */}

        <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
          <HeaderDesc title="Batch Preview" />

          <Box>
            {BatchTransactionData?.responseData?.length > 0 ? (
              <Box
                sx={{
                  maxWidth: "1500px",
                  width: { md: "105%", lg: "125%", xl: "130%" },
                }}
              >
                <ReceiptTable
                  columns={UploadedPreviewTableHeader}
                  data={BatchTransactionData?.responseData ?? []}
                  pagination={pagination}
                  setPagination={setPagination}
                  pageCount={toalPageCount}
                  next={next}
                  prev={prev}
                />
                {BrokerCode == null ||
                BrokerCode === undefined ||
                stockSymbol == null ||
                stockSymbol === undefined ? (
                  <Box></Box>
                ) : (
                  <Box mt={0}>
                    <RoundedButton
                      title1="Approved Batch Update"
                      onClick1={handleBatchUpdateApprove}
                    />
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  maxWidth: "1500px",
                  width: { md: "105%", lg: "125%", xl: "130%" },
                }}
              >
                <ReceiptTable columns={UploadedPreviewTableHeader} data={[]} />
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
            )}
          </Box>
        </Box>
      </Box>
      {/* </Grid> */}
      {/* </Grid> */}
    </>
  );
};

export default BatchImport;
