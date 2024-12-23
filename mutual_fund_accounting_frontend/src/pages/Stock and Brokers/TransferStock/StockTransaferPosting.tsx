import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import dayjs from "dayjs";

import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import SearchText from "components/Button/Search";
import TableComponent, {
  IndeterminateCheckbox,
} from "components/Table/Posting Table/TableComponent";
import DateFormatter from "utils/DateFormatter";

import { PaginationState } from "@tanstack/react-table";
import debounce from "utils/Debounce";
import {
  useGetAllUnlistedStockData,
  usePostTransferUnlistedStockPosting,
  usePostTransferUnlistedStockPostingReject,
} from "services/TransferStock/TransferStockServices";

interface FormData {
  remarks: string;
  id: string;
  status: "approved" | "rejected";
  startDate: object;
  endDate: object;
}

interface UnListedData {
  id: number;
  symbol: string;
  sector: string;
  units: number;
  purchase_price: number;
  share_type: string;
  obj_id: number;
  is_listed: boolean;
  bonus_date: string;
  transfer_date: string;
  transfered_by: string;
  subRows?: UnListedData[];
  isSelected?: boolean;
}

const StockTransaferPosting = () => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
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
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [id, setId] = useState("");

  const [displayData, setDisplayData] = useState<UnListedData[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<
    UnListedData[]
  >([]);

  const [selectedValue, setSelectedValue] = useState<string>("all");

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();

  const { data: unlistedStockData, isSuccess: unlistedDataSuccess } =
    useGetAllUnlistedStockData(id);

  const { mutate: PostingApprove, isPending: PostingPending } =
    usePostTransferUnlistedStockPosting();

  const { mutate: PostingReject } = usePostTransferUnlistedStockPostingReject();

  const totalPageCount = Math.ceil(1);

  useEffect(() => {
    if (unlistedStockData?.responseData?.next === null) {
      setNext(false);
    } else {
      setNext(true);
    }
    if (unlistedStockData?.responseData?.previous === null) {
      setPrev(false);
    } else {
      setPrev(true);
    }
  }, [unlistedStockData]);

  useEffect(() => {
    if (id) {
      setDisplayData(unlistedStockData ? unlistedStockData?.responseData : []);
    } else {
      setDisplayData(unlistedStockData?.responseData || []);
    }
  }, [unlistedStockData, id]);

  useEffect(() => {
    if (unlistedDataSuccess && loadClicked) {
      setDisplayData(unlistedStockData?.responseData ?? []);
      if (
        !unlistedStockData?.responseData ||
        unlistedStockData?.responseData?.length === 0
      ) {
        setErrorMessage("There is no Unit List Available for the given Date.");
        setErrorbarOpen(true);
      }
    }
  }, [loadClicked, unlistedStockData, searchData, unlistedDataSuccess]);

  const handleApproveTransaction = (row: any) => {
    const remarkValue = remarks[row.original.obj_id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const selectedIds = row.original.obj_id;
    const payload = {
      ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    PostingApprove(payload, {
      onSuccess: () => {
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
      delete newRemarks[row.original.obj_id];
      return newRemarks;
    });
  };

  const handleRejectTransaction = (row: any) => {
    const remarkValue = remarks[row.original.obj_id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const selectedIds = row.original.obj_id;
    const payload = {
      ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    PostingReject(payload, {
      onSuccess: () => {
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
      delete newRemarks[row.original.obj_id];
      return newRemarks;
    });
  };

  const handlePostTransaction = (data: FormData) => {
    if (selectedTransactions.length === 0) {
      return;
    }
    const selectedIds = selectedTransactions.map((row) => row.obj_id);
    const payload = {
      ids: selectedIds,
      remarks: data.remarks,
    };
    PostingApprove(payload, {
      onSuccess: () => {
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
    setSearchFilter(data.id || "");
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
  const handleRowSelect = (row: UnListedData) => {
    setDisplayData((prevData) =>
      prevData.map((item) =>
        item.obj_id === row.obj_id
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );

    setSelectedTransactions((prev) => {
      const isCurrentlySelected = prev.some((r) => r.obj_id === row.obj_id);
      if (isCurrentlySelected) {
        return prev.filter((r) => r.obj_id !== row.obj_id);
      } else {
        return [...prev, row];
      }
    });
  };

  const handleSelectAll = (checked: boolean): void => {
    setDisplayData((prevData) =>
      prevData.map((item) => ({ ...item, isSelected: checked }))
    );

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
        value={remarks[row.original.obj_id] || ""}
        onChange={(e) =>
          handleRemarkChange(row.original.obj_id, e.target.value)
        }
        sx={{ ml: 3 }}
      />
      <IconButton
        sx={{ ml: 1 }}
        onClick={() => handleApproveTransaction(row)}
        disabled={!remarks[row.original.obj_id]?.trim()}
      >
        <CheckIcon
          style={{
            color: remarks[row.original.obj_id]?.trim() ? "green" : "gray",
          }}
        />
      </IconButton>
      <IconButton
        sx={{ ml: 1 }}
        onClick={() => handleRejectTransaction(row)}
        disabled={!remarks[row.original.obj_id]?.trim()}
      >
        <CloseIcon
          style={{
            color: remarks[row.original.obj_id]?.trim() ? "red" : "gray",
          }}
        />
      </IconButton>
    </Box>
  );
  const handleReset = () => {
    setId("");
    setDisplayData(unlistedStockData?.responseData || []);
    reset();
  };
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const debouncedSetId = useCallback(
    debounce((value) => {
      setSearchFilter(value);
    }, 500),
    [setValue]
  );

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
            checked={row.original.isSelected || false}
            onChange={() => handleRowSelect(row.original)}
          />
        ),
      },

      {
        accessorKey: "symbol",
        header: "Symbol",
      },
      {
        accessorKey: "sector",
        header: "Sector",
      },
      {
        accessorKey: "units",
        header: "Units",
      },
      {
        accessorKey: "purchase_price",
        header: "Purchase Price",
      },
      {
        accessorKey: "total_amount",
        header: "Total Amount",
      },
      {
        accessorKey: "share_type",
        header: "Share Type",
      },
      {
        header: "Status",
        accessorKey: "is_listed",
        cell: (data) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
            >
              {data?.row?.original?.is_listed ? "Listed" : "Unlisted"}
            </Typography>
          );
        },
      },
      {
        header: "Issue Date",
        accessorKey: "bonus_date",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "left",
                width: "max-content",
              }}
            >
              {data?.row?.original?.bonus_date?.split("T")[0] || "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Transfered Date",
        accessorKey: "transfer_date",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "left",
                width: "max-content",
              }}
            >
              {data?.row?.original?.transfer_date?.split("T")[0] || "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Transfered By",
        accessorKey: "transfered_by",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textAlign: "left",
                width: "max-content",
              }}
            >
              {data?.row?.original?.transfered_by || "N/A"}
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
            mb: 1.5,
          }}
        >
          <SearchText
            title="Search for Entries"
            {...register("id")}
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          />
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
                loading={PostingPending}
              />
            </Box>
          </Box>
        )}
      </Box>
      {snackbarOpen && (
        <SuccessBar
          snackbarOpen={snackbarOpen}
          message={"Successfully Submitted!"}
          setSnackbarOpen={setSnackbarOpen}
        />
      )}
      <ErrorBar
        snackbarOpen={errorbarOpen}
        message={errorMessage}
        setSnackbarOpen={setErrorbarOpen}
      />
    </>
  );
};

export default StockTransaferPosting;
