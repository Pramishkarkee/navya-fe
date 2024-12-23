import React, { useState, useCallback, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Empty } from "antd";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import debounce from "utils/Debounce";
import DateFormatter from "utils/DateFormatter";
import SearchText from "components/Button/Search";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import SuccessBar from "components/Snackbar/SuccessBar";
import DateField from "components/DateFilter/DateField";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import TableComponent, {
  IndeterminateCheckbox,
} from "components/Table/Posting Table/TableComponent";
import {
  useGetAllPendingStockTransaction,
  usePostApproveStockTransaction,
  usePostRejectStockTransaction,
} from "services/Stock Transaction/StockTransactionService";
import { SettlementTableHeaders } from "constants/Stock Transaction/SettlementTable";

interface FormData {
  remarks: string;
  id: string;
  status: "approved" | "rejected";
  startDate: object;
  endDate: object;
}

interface StockTransaction extends SettlementTableHeaders {
  subRows?: SettlementTableHeaders[];
}

const StockTransactionPosting = () => {
  const theme = useTheme();
  const { control, handleSubmit, register, setValue, reset } =
    useForm<FormData>({
      defaultValues: {
        remarks: "",
        id: "",
        startDate: dayjs(),
        endDate: dayjs(),
      },
    });
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<StockTransaction[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [selectedTransactions, setSelectedTransactions] = useState<
    StockTransaction[]
  >([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const {
    data: pendingStockTransactionData,
    refetch: pendingStockTransactionRefetch,
  } = useGetAllPendingStockTransaction(
    searchData.from_date,
    searchData.to_date,
    searchValue,
    pagination.pageIndex + 1
  );

  const {
    mutate: PostStockTransaction,
    isPending: PendingPostStockTransaction,
  } = usePostApproveStockTransaction();
  const { mutate: RejectPendingStockTransaction } =
    usePostRejectStockTransaction();

  const totalPageCount = Math.ceil(
    pendingStockTransactionData?.responseData?.count / 10
  );
  useEffect(() => {
    if (pendingStockTransactionData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (pendingStockTransactionData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [pendingStockTransactionData]);

  const handleApproveTransaction = (row: any) => {
    const remarkValue = remarks[row.original.id] || "";
    if (!remarkValue.trim()) {
      return;
    }

    const selectedIds = row.original.id;
    const payload = {
      transaction_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    PostStockTransaction(payload, {
      onSuccess: () => {
        setSuccessMessage("Stock Transaction Approved.");
        setSnackbarOpen(true);
        setSelectedTransactions([]);
      },
      onError: () => {
        setErrorbarOpen(true);
        setErrorMessage("Error occurred while Posting transactions.");
      },
    });
    setRemarks((prev) => {
      const newRemarks = { ...prev };
      delete newRemarks[row.original.id];
      return newRemarks;
    });
  };

  const handleRejectTransaction = (row: any) => {
    const remarkValue = remarks[row.original.id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const selectedIds = row.original.id;
    const payload = {
      transaction_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    RejectPendingStockTransaction(payload, {
      onSuccess: () => {
        setSnackbarOpen(true);
        setSuccessMessage("Stock Transaction Rejected Successfully.");

        setSelectedTransactions([]);
      },
      onError: () => {
        setErrorbarOpen(true);
        setErrorMessage("Error occurred while Rejecting Stock transactions.");
      },
    });

    setRemarks((prev) => {
      const newRemarks = { ...prev };
      delete newRemarks[row.original.id];
      return newRemarks;
    });
  };

  const handlePostTransaction = (data: FormData) => {
    if (selectedTransactions.length === 0) {
      return;
    }
    const selectedIds = selectedTransactions.map((row) => row.id);
    const payload = {
      transaction_ids: selectedIds,
      remarks: data.remarks,
    };

    PostStockTransaction(payload, {
      onSuccess: () => {
        setSnackbarOpen(true);
        setSuccessMessage("Stock Transaction Approved.");

        setSelectedTransactions([]);
      },
      onError: () => {
        setErrorbarOpen(true);
        setErrorMessage("Error occurred while Posting transactions.");
      },
    });
  };

  const handleLoad = (data) => {
    setSearchValue(data.id || "");
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
      console.log("Both start and end dates must be selected.");
    }
  };
  useEffect(() => {
    if (pendingStockTransactionData?.responseData?.results) {
      setDisplayData(pendingStockTransactionData?.responseData?.results);
    } else {
      setDisplayData([]);
    }
  }, [pendingStockTransactionData]);

  const handleRemarkChange = (rowId: number, value: string) => {
    setRemarks((prev) => ({
      ...prev,
      [rowId]: value,
    }));
  };
  const handleRowSelect = (row: StockTransaction) => {
    setSelectedTransactions((prev) => {
      const isSelected = prev.some((r) => r.id === row.id);
      if (isSelected) {
        return prev.filter((r) => r.id !== row.id);
      } else {
        return [...prev, row];
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(displayData);
    } else {
      setSelectedTransactions([]);
    }
  };

  const renderExpandedRow = (row: any) => (
    <Box display="flex" alignItems="center">
      <TextField
        label="Enter Remarks"
        variant="outlined"
        size="small"
        value={remarks[row.original.id] || ""}
        onChange={(e) => handleRemarkChange(row.original.id, e.target.value)}
        sx={{ ml: 2 }}
      />

      <IconButton
        sx={{ ml: 1 }}
        onClick={() => handleApproveTransaction(row)}
        disabled={!remarks[row.original.id]?.trim()}
      >
        <CheckIcon
          style={{ color: remarks[row.original.id]?.trim() ? "green" : "gray" }}
        />
      </IconButton>
      <IconButton
        sx={{ ml: 1 }}
        onClick={() => handleRejectTransaction(row)}
        disabled={!remarks[row.original.id]?.trim()}
      >
        <CloseIcon
          style={{ color: remarks[row.original.id]?.trim() ? "red" : "gray" }}
        />
      </IconButton>
    </Box>
  );
  const handleReset = () => {
    setSearchValue("");
    setLoadClicked(false);
    setSearchData(null);
    setSearchData({
      from_date: "",
      to_date: "",
    });
    pendingStockTransactionRefetch();
    reset();
  };
  const debouncedSetValue = useCallback(
    debounce((value) => {
      setSearchValue(value);
    }, 500),
    [setValue]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "select",
        header: () => (
          <IndeterminateCheckbox
            {...{
              checked:
                displayData.length > 0 &&
                selectedTransactions.length === displayData.length,
              indeterminate:
                selectedTransactions.length > 0 &&
                selectedTransactions.length < displayData.length,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                handleSelectAll(e.target.checked),
            }}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedTransactions.some((r) => r.id === row.original.id)}
            onChange={() => handleRowSelect(row.original)}
          />
        ),
      },
      {
        accessorKey: "txn_id",
        header: "TXN ID",
      },
      {
        accessorKey: "txn_type",
        header: "Transaction Type",
        cell: (data) => (
          <Typography sx={{ fontSize: "14px", textTransform: "capitalize" }}>
            {data.row.original.txn_type}
          </Typography>
        ),
      },
      {
        accessorKey: "broker_code",
        header: "Broker Code",
      },
      {
        accessorKey: "stock_code",
        header: "Symbol",
      },
      {
        accessorKey: "units",
        header: "Units",
        cell: (data) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {data.row.original.units
              ? data.row.original.units.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : ""}
          </Typography>
        ),
      },

      {
        accessorKey: "rate",
        header: "Rate",
        cell: (data) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {data.row.original.rate
              ? data.row.original.rate.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : ""}
          </Typography>
        ),
      },
      {
        accessorKey: "base_price",
        header: "Base Price",
        cell: (data) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {data.row.original.base_price
              ? data.row.original.base_price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : ""}
          </Typography>
        ),
      },
      {
        accessorKey: "commission_rate",
        header: "Broker Charge",
      },
      {
        accessorKey: "sebon_charge",
        header: "SEBON Charge",
      },
      {
        accessorKey: "dp_charge",
        header: "DP Charge",
      },
      {
        accessorKey: "capital_gain_tax",
        header: "CGT",
      },
      {
        accessorKey: "total_amount",
        header: "Total Amount",
        cell: (data) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {data.row.original.total_amount
              ? data.row.original.total_amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : ""}
          </Typography>
        ),
      },
      {
        accessorKey: "effective_rate",
        header: "Effective Rate",
        cell: (data) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {data.row.original.effective_rate
              ? data.row.original.effective_rate.toLocaleString()
              : ""}
          </Typography>
        ),
      },
    ],
    [selectedTransactions, displayData]
  );

  return (
    <React.Fragment>
      {snackbarOpen && (
        <SuccessBar
          snackbarOpen={snackbarOpen}
          message={successMessage}
          setSnackbarOpen={setSnackbarOpen}
        />
      )}
      <ErrorBar
        snackbarOpen={errorbarOpen}
        message={errorMessage}
        setSnackbarOpen={setErrorbarOpen}
      />
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
            List of Stock Transactions
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(handleLoad)}
          sx={{
            width: "100%",
            display: "flex",
            gap: 3,
            marginTop: 1,
            ml: -1,
            mb: 0,
          }}
        >
          <SearchText
            title="Search for Stock Transactions"
            {...register("id")}
            onChange={(e) => debouncedSetValue(e.target.value)}
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

        <Box
          sx={{
            width: {
              xs: "95%",
              sm: "100%",
              md: "110%",
              lg: "160%",
              xl: "170%",
            },
          }}
        >
          {pendingStockTransactionData?.responseData?.results?.length > 0 ? (
            <TableComponent
              data={pendingStockTransactionData?.responseData?.results}
              columns={columns}
              renderExpandedRow={renderExpandedRow}
              setSelectedRows={handleRowSelect}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPageCount}
            />
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
        {selectedTransactions.length > 0 && (
          <Box>
            <Box sx={{ width: "50px", mb: 1 }}>
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
                Bulk Posting
              </Typography>
            </Box>
            <Box sx={{ mt: 0, mb: 1 }}>
              <TypographyLabel title="Remarks" />
              <Controller
                name="remarks"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ width: "200px", mt: 0.5 }}
                    multiline
                    minRows={3}
                    placeholder="Entries Approved!"
                  />
                )}
              />
            </Box>
            <Box sx={{ mt: 1 }}>
              <RoundedButton
                title1="Post Entries"
                onClick1={handleSubmit(handlePostTransaction)}
                loading={PendingPostStockTransaction}
              />
            </Box>
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
};

export default StockTransactionPosting;
