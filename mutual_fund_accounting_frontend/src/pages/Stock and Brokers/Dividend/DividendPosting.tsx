import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { Controller, useForm } from "react-hook-form";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import SearchText from "components/Button/Search";
import { PaginationState } from "@tanstack/react-table";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TableComponent, {
  IndeterminateCheckbox,
} from "components/Table/Posting Table/TableComponent";
import {
  useGetDividendPostingList,
  usePostDividendPostingList,
  usePostPendingDividendReject,
} from "services/Dividend/DividendService";
import dayjs from "dayjs";
import { Empty } from "antd";
import DateField from "components/DateFilter/DateField";
import DateFormatter from "utils/DateFormatter";
import debounce from "utils/Debounce";
import { DividendsSettlementTableHeaders } from "constants/Dividends/DividendsSettlementTable";

interface FormData {
  remarks: string;
  id: string;
  status: "approved" | "rejected";
  startDate: object;
  endDate: object;
}

interface DvidendsPosting extends DividendsSettlementTableHeaders {
  subRows?: DividendsSettlementTableHeaders[];
}

const DividendPosting = () => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      remarks: "",
      id: "",
      startDate: dayjs(),
      endDate: dayjs(),
    },
  });
  const theme = useTheme();
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [selectedTransactions, setSelectedTransactions] = useState<
    DvidendsPosting[]
  >([]);
  const [search, setSearch] = useState<string>("");

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [displayData, setDisplayData] = useState<DvidendsPosting[]>([]);

  const [searchDividendData, setSearchDividendData] = useState({
    from_date: "",
    to_date: "",
  });

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: pendingDividendList } = useGetDividendPostingList(
    pagination.pageIndex + 1,
    searchDividendData.from_date,
    searchDividendData.to_date,
    search
  );

  const { mutate: PendingDividendPosting, isPending: LoadingDividendPosting } =
    usePostDividendPostingList();
  const { mutate: PendingDividendPostingReject } =
    usePostPendingDividendReject();

  const totalPagesSettlement = Math.ceil(pendingDividendList?.count / 10);

  useEffect(() => {
    if (pendingDividendList?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (pendingDividendList?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [pendingDividendList]);

  useEffect(() => {
    if (search) {
      setDisplayData(pendingDividendList ? [pendingDividendList] : []);
      setDisplayData(pendingDividendList?.results || []);
    } else {
      setDisplayData(pendingDividendList?.results || []);
    }
  }, [pendingDividendList, search]);

  const handleApproveTransaction = (row: any) => {
    const remarkValue = remarks[row.original.id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const selectedIds = row.original.id;
    const payload = {
      dividend_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    PendingDividendPosting(payload, {
      onSuccess: () => {
        setSuccessMessage("Dividend Posting Done Successfully");
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
      dividend_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    PendingDividendPostingReject(payload, {
      onSuccess: () => {
        setSuccessMessage("Dividend Rejected Successfully");

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

  const handlePostTransaction = (data: FormData) => {
    if (selectedTransactions.length === 0) {
      return;
    }
    const selectedIds = selectedTransactions.map((row) => row.id);
    const payload = {
      dividend_ids: selectedIds,
      remarks: data.remarks,
    };

    PendingDividendPosting(payload, {
      onSuccess: () => {
        setSuccessMessage("Dividend Posting Done Successfully");

        setSnackbarOpen(true);
        setSelectedTransactions([]);
      },
      onError: () => {
        setErrorbarOpen(true);
        setErrorMessage("Error occurred while Posting transactions.");
      },
    });
  };

  const handleLoad = (data) => {
    setSearch(data.id || "");
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatter.format(toDate.toISOString());

      setSearchDividendData({
        from_date: formattedFromDate,
        to_date: formattedToDate,
      });
    } else {
      console.log("Both start and end dates must be selected.");
    }
  };

  const handleRemarkChange = (rowId: string, value: string) => {
    setRemarks((prev) => ({
      ...prev,
      [rowId]: value,
    }));
  };
  const handleRowSelect = (row: DvidendsPosting) => {
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
    setSearch("");
    setSearchDividendData({
      from_date: "",
      to_date: "",
    });
    setDisplayData(pendingDividendList?.results || []);
    reset();
  };
  const debouncedSetId = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 500),
    [setValue]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "select",
        header: ({ table }) => (
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
        accessorKey: "stock_symbol",
        header: "Stock Symbol",
      },
      {
        accessorKey: "eligible_share_units",
        header: "Eligible Units",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {parseFloat(row.original.eligible_share_units).toLocaleString(
              undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            )}
          </Typography>
        ),
      },

      {
        accessorKey: "bonus_percentage",
        header: "Bounus %",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {parseFloat(row.original.bonus_percentage).toLocaleString(
              undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            )}
          </Typography>
        ),
      },
      {
        accessorKey: "cash_percentage",
        header: "Cash %",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
            {parseFloat(row.original.cash_percentage).toLocaleString(
              undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            )}
          </Typography>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Book Closure Date",
        cell: ({ row }) => formatDate(row.original.created_at),
      },
    ],
    [selectedTransactions, displayData]
  );

  return (
    <>
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
            List of Dividend Transactions
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
            title="Search for Stock Symbol"
            {...register("id")}
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          />
          <Box sx={{ mt: -2 }}>
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
              lg: "150%",
              xl: "160%",
            },
            overflowX: "auto",
          }}
        >
          {displayData?.length > 0 ? (
            <TableComponent
              data={displayData}
              columns={columns}
              renderExpandedRow={renderExpandedRow}
              setSelectedRows={handleRowSelect}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPagesSettlement}
              // setPageSize={setPageSize}
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
                loading={LoadingDividendPosting}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default DividendPosting;
