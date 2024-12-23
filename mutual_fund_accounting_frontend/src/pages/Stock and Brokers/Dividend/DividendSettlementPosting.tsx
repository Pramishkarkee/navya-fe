import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Empty } from "antd";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { PaginationState } from "@tanstack/react-table";

import DateFormatter from "utils/DateFormatter";
import debounce from "utils/Debounce";
import DateField from "components/DateField/DateField";
import RoundedButton from "components/Button/Button";
import SearchText from "components/Button/Search";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import {
  useGetAllPendingDividendSettlement,
  usePostApproveDividendSettlement,
  usePostRejectDividendSettlement,
} from "services/Dividend/DividendService";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import TableComponent, {
  IndeterminateCheckbox,
} from "components/Table/Posting Table/TableComponent";
import { DividendsSettlementTableHeaders } from "constants/Dividends/DividendsSettlementTable";

interface FormData {
  remarks: string;
  id: string;
  startDate: object;
  endDate: object;
}

interface DividendSettlementPosting extends DividendsSettlementTableHeaders {
  subRows?: DividendsSettlementTableHeaders[];
}

const DividendSettlementPosting = () => {
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

  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [selectedTransactions, setSelectedTransactions] = useState<
    DividendSettlementPosting[]
  >([]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [displayData, setDisplayData] = useState<DividendSettlementPosting[]>(
    []
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);

  const { data: pendingDividendSettlementList } =
    useGetAllPendingDividendSettlement(
      searchData.from_date,
      searchData.to_date,
      searchValue,
      pagination.pageIndex + 1
    );

  const {
    mutate: ApprovePendingDividendSettlement,
    isPending: PendingSettlementPosting,
  } = usePostApproveDividendSettlement();
  const { mutate: RejectPendingDividendSettlement } =
    usePostRejectDividendSettlement();

  const totalPageCount = Math.ceil(pendingDividendSettlementList?.count / 10);

  useEffect(() => {
    if (pendingDividendSettlementList?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (pendingDividendSettlementList?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [pendingDividendSettlementList]);

  useEffect(() => {
    if (searchValue) {
      setDisplayData(
        pendingDividendSettlementList ? [pendingDividendSettlementList] : []
      );
      setDisplayData(pendingDividendSettlementList?.results || []);
    } else {
      setDisplayData(pendingDividendSettlementList?.results || []);
    }
  }, [pendingDividendSettlementList, searchValue]);

  const handleApproveTransaction = (row: any) => {
    const remarkValue = remarks[row.original.id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const selectedIds = row.original.id;
    const payload = {
      settlement_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    ApprovePendingDividendSettlement(payload, {
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
      settlement_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    RejectPendingDividendSettlement(payload, {
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
      settlement_ids: selectedIds,
      remarks: data.remarks,
    };

    ApprovePendingDividendSettlement(payload, {
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
    if (data.startDate && data.endDate) {
      const fromDate = new Date(data.startDate);
      const toDate = new Date(data.endDate);
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
      setErrorMessage("Both start and end dates must be selected.");
      setErrorbarOpen(true);
    }
  };

  const debouncedSetValue = useCallback(
    debounce((value) => {
      setSearchValue(value);
    }, 500),
    [setValue]
  );

  const handleRemarkChange = (rowId: string, value: string) => {
    setRemarks((prev) => ({
      ...prev,
      [rowId]: value,
    }));
  };
  const handleRowSelect = (row) => {
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
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setDisplayData(pendingDividendSettlementList?.results || []);
    reset();
  };

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
        accessorKey: "stock_symbol",
        header: "Stock Symbol",
      },
      {
        accessorKey: "bank_name",
        header: "Bank Name",
      },

      {
        accessorKey: "bank_account",
        header: "Bank Account",
      },
      {
        accessorKey: "txn_type",
        header: "Transaction Type",
        cell: ({ row }) => {
          return (
            <Typography sx={{ fontSize: "14px" }}>
              {row.original.txn_type
                ? row.original.txn_type.replace(
                    /(^|_)([a-z])/g,
                    (_, separator, letter) =>
                      (separator === "_" ? " " : "") + letter.toUpperCase()
                  )
                : "-"}
            </Typography>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          return (
            <Typography sx={{ fontSize: "14px" }}>
              {Number(row.original.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          );
        },
      },

      {
        accessorKey: "settlement_date",
        header: "Settlement Date",
        cell: ({ row }) => {
          return (
            <Typography sx={{ fontSize: "14px" }}>
              {row.original.settlement_date
                ? row.original.settlement_date.split("T")[0]
                : "-"}
            </Typography>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Book Closure Date",
        cell: ({ row }) => {
          return (
            <Typography sx={{ fontSize: "14px" }}>
              {row.original.created_at
                ? row.original.created_at.split("T")[0]
                : "-"}
            </Typography>
          );
        },
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
            List of Pending Dividend Settlement
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
            title="Search for Pending Dividend"
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
          {pendingDividendSettlementList?.results?.length > 0 ? (
            <TableComponent
              data={pendingDividendSettlementList?.results}
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
                loading={PendingSettlementPosting}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default DividendSettlementPosting;
