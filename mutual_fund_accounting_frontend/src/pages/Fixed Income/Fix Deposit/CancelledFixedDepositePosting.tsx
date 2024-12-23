import React, { useState, useCallback, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { Empty } from "antd";
import { Controller, useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
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
  useGetFixedDepositData,
  usePostApproveCancelFixedDepositPosting,
  usePostRejectCancelFixedDepositPosting,
} from "services/Fixed Deposit/FixedDepositService";
import { CancelFDTableList } from "constants/FixedDepositTable/FixedDepositeCancelTableHeaders";

interface FormData {
  remarks: string;
  id: string;
  status: "approved" | "rejected";
  startDate: object;
  endDate: object;
}

interface FixedDepositPosting extends CancelFDTableList {
  subRows?: CancelFDTableList[];
}

const CancelledFixedDepositPosting = () => {
  const { control, handleSubmit, register, setValue, reset } =
    useForm<FormData>({
      defaultValues: {
        remarks: "",
        id: "",
        startDate: dayjs(),
        endDate: dayjs(),
      },
    });

  const theme = useTheme();
  const [id, setId] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<FixedDepositPosting[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});

  const [selectedTransactions, setSelectedTransactions] = useState<
    FixedDepositPosting[]
  >([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const { data: pendingFixedDepositData } = useGetFixedDepositData(
    pagination.pageIndex + 1,
    searchData.from_date,
    searchData.to_date,
    id
  );
  const {
    mutate: ApprovePendingFixedDeposit,
    isPending: PendingFixedDepositPosting,
  } = usePostApproveCancelFixedDepositPosting();
  const { mutate: RejectPendingFixedDeposit } =
    usePostRejectCancelFixedDepositPosting();

  const totalPageCount = Math.ceil(
    pendingFixedDepositData?.responseData.count / 10
  );

  useEffect(() => {
    if (pendingFixedDepositData?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (pendingFixedDepositData?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [pendingFixedDepositData]);

  useEffect(() => {
    if (pendingFixedDepositData) {
      setDisplayData(pendingFixedDepositData?.responseData?.results || []);
    }
    if (id) {
      setDisplayData(pendingFixedDepositData?.responseData?.results || []);
    }
  }, [id, pendingFixedDepositData]);

  const handleApproveTransaction = (row: any) => {
    const remarkValue = remarks[row.original.id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const payload = {
      fd_account_ids: [Number(row.original.id)],
      remarks: remarkValue,
      status: "approved",
    };

    ApprovePendingFixedDeposit(payload, {
      onSuccess: () => {
        setSuccessMessage("Fixed Income Cancelled Successfully.");
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
      fd_account_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    RejectPendingFixedDeposit(payload, {
      onSuccess: () => {
        setSuccessMessage("Cancellation Fixed Income Rejected Successfully.");
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
      fd_account_ids: selectedIds,
      remarks: data.remarks,
    };

    ApprovePendingFixedDeposit(payload, {
      onSuccess: () => {
        setSuccessMessage("Fixed Income Cancelled Successfully.");
        setSnackbarOpen(true);
        setSelectedTransactions([]);
      },
      onError: () => {
        setErrorbarOpen(true);
        setErrorMessage("Error occurred while Posting transactions.");
      },
    });
  };

  const handleRowSelect = (row: FixedDepositPosting) => {
    setSelectedTransactions((prev) => {
      const isSelected = prev.some((r) => r.id === row.id);
      if (isSelected) {
        return prev.filter((r) => r.id !== row.id);
      } else {
        return [...prev, row];
      }
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
      setErrorMessage("Both start and end dates must be selected.");
      setErrorbarOpen(true);
    }
  };

  const handleRemarkChange = (rowId: number, value: string) => {
    setRemarks((prev) => ({
      ...prev,
      [rowId]: value,
    }));
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
        sx={{ ml: 3 }}
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
    setId("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setDisplayData(pendingFixedDepositData?.responseData || []);
    reset();
  };
  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
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
        accessorKey: "account_number",
        header: "FD Name",
      },

      {
        accessorKey: "bank",
        header: "Bank Name",
      },
      {
        accessorKey: "account_number",
        header: "Account Number",
      },
      {
        header: "Deposit Date",
        accessorKey: "deposit_date",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "left",
                width: "max-content",
              }}
            >
              {data?.row?.original?.fix_deposit_start_date ?? "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Maturity Date",
        accessorKey: "maturity_date",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "left",
                width: "max-content",
              }}
            >
              {data?.row?.original?.fix_deposit_end_date ?? "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Days until Maturity",
        accessorKey: "days_until_interest",
        cell: (data) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
            >
              {data?.row?.original?.reaming_days ?? "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Interest Rate (%)",
        accessorKey: "interest_rate",
        cell: (data) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
            >
              {data?.row?.original?.interest_rate ?? "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Deposit Amount",
        accessorKey: "deposit_amount",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "right",
                width: "90px",
              }}
            >
              {Number(
                data?.row?.original?.fix_deposit_amount
              ).toLocaleString() ?? "N/A"}
            </Typography>
          );
        },
      },

      {
        header: "Accrued Interest",
        accessorKey: "interest_amount",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "right",
                width: { lg: "45px", xl: "92px" },
              }}
            >
              {data?.row?.original?.accured_intrest?.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }) ?? "N/A"}
            </Typography>
          );
        },
      },

      {
        header: "Cancellation Charge (%)",
        accessorKey: "cancellation_charge",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "right",
                width: { lg: "55px", xl: "130px" },
              }}
            >
              {data?.row?.original?.cancellation_charge
                ? Number(data?.row?.original?.cancellation_charge).toFixed(2)
                : "N/A"}
            </Typography>
          );
        },
      },
    ],
    [selectedTransactions, displayData]
  );

  return (
    <>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingTop: 1,
        }}
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
            Search Filters
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
            title="Search for Entries"
            {...register("id")}
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          />
          <Box sx={{ mt: -2 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
              maxDateValue={dayjs()}
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
            overflowX: "hidden",
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
                loading={PendingFixedDepositPosting}
              />
            </Box>
          </Box>
        )}
      </Box>

      <SuccessBar
        snackbarOpen={snackbarOpen}
        message={successMessage}
        setSnackbarOpen={setSnackbarOpen}
      />
      <ErrorBar
        snackbarOpen={errorbarOpen}
        message={errorMessage}
        setSnackbarOpen={setErrorbarOpen}
      />
    </>
  );
};

export default CancelledFixedDepositPosting;
