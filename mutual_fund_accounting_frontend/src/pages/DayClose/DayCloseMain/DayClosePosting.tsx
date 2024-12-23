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
import TableComponent, {
  IndeterminateCheckbox,
} from "components/Table/Posting Table/TableComponent";
import DateField from "components/DateFilter/DateField";
import TypographyLabel from "components/InputLabel/TypographyLabel";

import {
  useGetDayCloseData,
  usePostApprovePendingDayClose,
  usePostrejectPendingDayClose,
} from "services/DayClose/DayCloseServices";
import { DayCloseData } from "constants/DayCloseTable/DayCloseEntryTableHeaders";

interface FormData {
  id: string;
  remarks: string;
  endDate: object;
  startDate: object;
  status: "approved" | "rejected";
}

interface PendingDayCloseData extends DayCloseData {
  subRows?: DayCloseData[];
}

const DayClosePosting = () => {
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

  const [id, setId] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [displayData, setDisplayData] = useState<PendingDayCloseData[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<
    DayCloseData[]
  >([]);
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: DayCloseListData, isSuccess: DayCloseListDataSuccess } =
    useGetDayCloseData(
      searchData.from_date,
      searchData.to_date,
      pagination.pageIndex + 1,
      id
    );
  // const { data: pendingDayCloseList } = useGetPendingDayCloseData(
  //   searchData.from_date,
  //   searchData.to_date,
  //   pagination.pageIndex + 1,
  //   id
  // );

  // const { mutate: PostPosting } = usePostApprovePendingDayClose();
  const { mutate: RejectPosting } = usePostrejectPendingDayClose();
  const { mutate: PostPosting } = usePostApprovePendingDayClose();

  const totalPages = Math.ceil(DayCloseListData?.meta?.count / 10);

  useEffect(() => {
    const responseData = DayCloseListData?.meta;
    setNext(responseData?.next === null);
    setPrev(responseData?.previous === null);
  }, [DayCloseListData]);

  useEffect(() => {
    if (DayCloseListDataSuccess || loadClicked) {
      const results = DayCloseListData?.responseData ?? [];
      setDisplayData(results);
    }
  }, [DayCloseListDataSuccess, loadClicked, DayCloseListData]);

  const handleApproveTransaction = (row: any) => {
    const remarkValue = remarks[row.original.id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const payload = {
      id: row.original.id,
      remarks: remarkValue,
      status: "approved",
    };

    PostPosting(payload, {
      onSuccess: () => {
        setSuccessMessage("Day Close Posting Approved Successfully.");
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
    const payload = {
      id: row.original.id,
      remarks: remarkValue,
      status: "rejected",
    };

    RejectPosting(payload, {
      onSuccess: () => {
        setSuccessMessage("Day Close Posting Rejected Successfully.");
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
      id: selectedIds,
      remarks: data.remarks,
    };
    PostPosting(payload, {
      onSuccess: () => {
        setSuccessMessage("Day Close Posting Approved Successfully.");
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
  const handleRowSelect = (row: DayCloseData) => {
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
    setDisplayData(DayCloseListData?.responseData || []);
    reset();
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
    }, 500),
    [setValue]
  );

  const DayClosePostingHeader = useMemo(
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
        header: "Day Close For",
        accessorKey: "closing_day",
        cell: ({ row }) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "left",
                width: "max-content",
              }}
            >
              {row?.original?.closing_day.split("T")[0]}
            </Typography>
          );
        },
      },
      {
        header: "Day Close Date",
        accessorKey: "created_at",
        cell: ({ row }) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "left",
                width: "max-content",
              }}
            >
              {row?.original?.created_at.split("T")[0]}
            </Typography>
          );
        },
      },
      {
        header: "TimeStamp",
        accessorKey: "created_at",
        cell: ({ row }) => {
          const transactionDate = new Date(row?.original?.created_at);
          const nepaliTime = transactionDate.toLocaleTimeString("en-US");
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "left",
                width: "max-content",
              }}
            >
              {nepaliTime}
            </Typography>
          );
        },
      },
      {
        header: "Subscribed Units",
        accessorKey: "units_total",
        cell: ({ row }) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "right",
                width: "95px",
              }}
            >
              {row?.original?.units_total.toLocaleString()}
            </Typography>
          );
        },
      },
      {
        header: "Total Assets",
        accessorKey: "asset_total",
        cell: ({ row }) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "right",
                width: "85px",
              }}
            >
              {row?.original?.asset_total.toLocaleString()}
            </Typography>
          );
        },
      },
      {
        header: "Total Liabilities",
        accessorKey: "liability_total",
        cell: ({ row }) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "right",
                width: "90px",
              }}
            >
              {row?.original?.liability_total.toLocaleString()}
            </Typography>
          );
        },
      },
      {
        header: "Net Assets Value",
        accessorKey: "net_asset_value",
        cell: ({ row }) => {
          return (
            <Typography
              // align="right"
              sx={{
                textAlign: "right",
                fontSize: "14px",
                fontWeight: "400px",
                width: "100px",
              }}
            >
              {row?.original?.net_asset_value.toLocaleString()}
            </Typography>
          );
        },
      },
      {
        header: "NAV",
        accessorKey: "nav_value",
        cell: ({ row }) => {
          return (
            <Typography
              align="right"
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                width: { sm: "80%", md: "60%", lg: "40%" },
              }}
            >
              {Number(row?.original?.nav_value).toLocaleString()}
            </Typography>
          );
        },
      },

      {
        header: "% Change",
        accessorKey: "nav_change_percentage",
        cell: ({ row }) => {
          return (
            <Typography
              align="right"
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                width: "55px",
              }}
            >
              {Number(row?.original?.nav_change_percentage)
                .toFixed(2)
                .toLocaleString()}
            </Typography>
          );
        },
      },
      {
        header: "Day Close By",
        accessorKey: "day_close_by",
        cell: ({ row }) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textTransform: "capitalize",
              }}
            >
              {row?.original?.day_close_by}
            </Typography>
          );
        },
      },

      {
        header: "Approved By",
        accessorKey: "day_close_approved_by",
        cell: ({ row }) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {row?.original?.day_close_approved_by}
            </Typography>
          );
        },
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
      {errorbarOpen && (
        <ErrorBar
          snackbarOpen={errorbarOpen}
          message={errorMessage}
          setSnackbarOpen={setErrorbarOpen}
        />
      )}
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
            Day Close Summary
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
          }}
        >
          {displayData?.length > 0 ? (
            <TableComponent
              data={displayData}
              columns={DayClosePostingHeader}
              renderExpandedRow={renderExpandedRow}
              setSelectedRows={handleRowSelect}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPages}
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
              />
            </Box>
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
};

export default DayClosePosting;
