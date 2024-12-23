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
import DateField from "components/DateFilter/DateField";
import SuccessBar from "components/Snackbar/SuccessBar";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { IPOData } from "constants/Ipo/IpoTable";
import TableComponent, {
  IndeterminateCheckbox,
} from "components/Table/Posting Table/TableComponent";

import {
  useGetPendingIPOFPOAllotmentList,
  usePostPendingIPOFPOAllotment,
  usePostPendingIPOFPOAllotmentReject,
} from "services/ipo/ipoServices";

interface FormData {
  remarks: string;
  id: string;
  status: "approved" | "rejected";
  startDate: object;
  endDate: object;
}

interface IPOAllotementData extends IPOData {
  subRows?: IPOData[];
}

const IPOAllotmentPosting = () => {
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
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [displayData, setDisplayData] = useState<IPOAllotementData[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<
    IPOAllotementData[]
  >([]);
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: IpoFpoPendingList } = useGetPendingIPOFPOAllotmentList(
    searchData?.from_date,
    searchData?.to_date,
    searchFilter,
    pagination.pageIndex + 1
  );
  const { mutate: IPOFPOAllotmentApprove, isPending: IPOFPOPostingPending } =
    usePostPendingIPOFPOAllotment();
  const { mutate: IPOFPOAllotmentReject } =
    usePostPendingIPOFPOAllotmentReject();

  const totalPages = Math.ceil(IpoFpoPendingList?.count / 10);

  useEffect(() => {
    setDisplayData(IpoFpoPendingList?.results || []);
    if (IpoFpoPendingList?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (IpoFpoPendingList?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [IpoFpoPendingList]);

  const handleApproveTransaction = (row: any) => {
    const remarkValue = remarks[row.original.id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const selectedIds = row.original.id;
    const payload = {
      ipo_rights_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    IPOFPOAllotmentApprove(payload, {
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
      ipo_rights_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    IPOFPOAllotmentReject(payload, {
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
      ipo_rights_ids: selectedIds,
      remarks: data.remarks,
    };
    IPOFPOAllotmentApprove(payload, {
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
  const handleRowSelect = (row: IPOData) => {
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
      <Box>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
          Value Per Unit
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {row.original.per_share_value}
        </Typography>
      </Box>

      <Box sx={{ ml: 3 }}>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
          Deposit Amount
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {row.original.deposit_amount}
        </Typography>
      </Box>

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
    setSearchFilter("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setDisplayData(IpoFpoPendingList?.results || []);
    reset();
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
        header: "ID",
        accessorKey: "id",
        cell: (data) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
            >
              {data.row.original.id}
            </Typography>
          );
        },
      },
      {
        header: "Application Type",
        accessorKey: "share_application_type",
        cell: (data) => {
          const displayValue =
            data.row.original.share_application_type === "ipo"
              ? "IPO"
              : data.row.original.share_application_type === "right"
              ? "Right"
              : data.row.original.share_application_type === "fpo"
              ? "FPO"
              : "N/A";
          return (
            <Typography sx={{ fontSize: "0.85rem", textAlign: "left" }}>
              {displayValue || "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Stock Name",
        accessorKey: "stock_name",
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
              {data.row.original.stock_name || "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Appplied Date",
        accessorKey: "apply_date",
        cell: (data) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: 400, textAlign: "left" }}
            >
              {data.row.original.apply_date || "N/A"}
            </Typography>
          );
        },
      },
      {
        header: "Applied Units",
        accessorKey: "applied_units",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "right",
                width: "75px",
              }}
            >
              {parseFloat(
                data.row.original.applied_units || "N/A"
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          );
        },
      },
      {
        header: "Value Per Unit",
        accessorKey: "per_share_value",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "right",
                width: "80px",
              }}
            >
              {parseFloat(data.row.original.per_share_value).toLocaleString(
                undefined,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}
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
              {parseFloat(
                data.row.original.deposit_amount || "N/A"
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          );
        },
      },
      {
        header: "Alloted Units",
        accessorKey: "alloted_units",
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
              {parseFloat(data.row.original.alloted_units).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </Typography>
          );
        },
      },
      {
        header: "Alloted Date",
        accessorKey: "alloted_date",
      },

      {
        header: "Status",
        accessorKey: "status",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "left",
                width: "max-content",
                textTransform: "capitalize",
              }}
            >
              {data.row.original.status}
            </Typography>
          );
        },
      },
      {
        accessorKey: "created_by",
        header: "Created By",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "left",
                textTransform: "capitalize",
              }}
            >
              {data.row.original.updated_by.full_name || "-"}
            </Typography>
          );
        },
      },
      {
        accessorKey: "updated_by",
        header: "Approved By",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "left",
                textTransform: "capitalize",
              }}
            >
              {data.row.original.updated_by.full_name || "-"}
            </Typography>
          );
        },
      },
    ],
    [selectedTransactions, displayData]
  );

  return (
    <React.Fragment>
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
                loading={IPOFPOPostingPending}
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
    </React.Fragment>
  );
};

export default IPOAllotmentPosting;
