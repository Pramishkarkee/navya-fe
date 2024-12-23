import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import DateField from "components/DateField/DateField";
import SuccessBar from "components/Snackbar/SuccessBar";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import TableComponent, {
  IndeterminateCheckbox,
} from "components/Table/Posting Table/TableComponent";

import {
  useGetPendingBondAndDebentureSettlementList,
  usePostBondAndDebentureSettlementApprove,
  usePostBondAndDebentureSettlementReject,
} from "services/BondAndDebenture/BondAndDebenture";

interface FormData {
  remarks: string;
  id: string;
  startDate: object;
  endDate: object;
}

interface BondDebentureSettlement {
  id: number;
  bond_name: string;
  bond_symbol: string;
  bank_name: string;
  bank_account: string;
  settlement_date: string;
  created_date: string;
  txn_type: string;
  amount: string;
  payment_id: string;
  subRows?: BondDebentureSettlement[];
}

const BondAndDebentureSettlementPosting = () => {
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
  const [displayData, setDisplayData] = useState([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });
  const [selectedTransactions, setSelectedTransactions] = useState<
    BondDebentureSettlement[]
  >([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: pendingBondDebentureSettlmentList } =
    useGetPendingBondAndDebentureSettlementList(
      searchValue,
      pagination.pageIndex + 1,
      searchData.from_date,
      searchData.to_date
    );
  const {
    mutate: ApproveBondDebentureSettlement,
    isPending: PendingApprovedBondSettlement,
  } = usePostBondAndDebentureSettlementApprove();
  const { mutate: RejectBondDebentureSettlement } =
    usePostBondAndDebentureSettlementReject();

  const totalPageCount = Math.ceil(
    pendingBondDebentureSettlmentList?.meta?.count / 10
  );
  useEffect(() => {
    if (pendingBondDebentureSettlmentList?.meta?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (pendingBondDebentureSettlmentList?.meta?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [pendingBondDebentureSettlmentList]);

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

    ApproveBondDebentureSettlement(payload, {
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
      settlement_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    RejectBondDebentureSettlement(payload, {
      onSuccess: () => {
        setSuccessMessage("Stock Transaction Rejected Successfully.");
        setSnackbarOpen(true);

        setSelectedTransactions([]);
      },
      onError: () => {
        setErrorMessage("Error occurred while Rejecting Stock transactions.");
        setErrorbarOpen(true);
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

    ApproveBondDebentureSettlement(payload, {
      onSuccess: () => {
        setSuccessMessage("Stock Transaction Approved.");
        setSnackbarOpen(true);

        setSelectedTransactions([]);
      },
      onError: () => {
        setErrorMessage("Error occurred while Posting transactions.");
        setErrorbarOpen(true);
      },
    });
  };

  useEffect(() => {
    if (pendingBondDebentureSettlmentList?.responseData) {
      setDisplayData(pendingBondDebentureSettlmentList?.responseData);
    } else {
      setDisplayData([]);
    }
  }, [pendingBondDebentureSettlmentList]);

  const handleRemarkChange = (rowId: number, value: string) => {
    setRemarks((prev) => ({
      ...prev,
      [rowId]: value,
    }));
  };

  const handleRowSelect = (row: BondDebentureSettlement) => {
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
          style={{
            color: remarks[row.original.id]?.trim() ? "green" : "gray",
          }}
        />
      </IconButton>
      <IconButton
        sx={{ ml: 1 }}
        onClick={() => handleRejectTransaction(row)}
        disabled={!remarks[row.original.id]?.trim()}
      >
        <CloseIcon
          style={{
            color: remarks[row.original.id]?.trim() ? "red" : "gray",
          }}
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
    reset();
  };

  const handleLoad = (data) => {
    setSearchValue(data.id);
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
        accessorKey: "bond_name",
        header: "Bond Name",
      },
      {
        accessorKey: "broker_code",
        header: "Broker Code",
      },
      {
        accessorKey: "txn_type",
        header: "Transaction Type",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400px",
                textTransform: "capitalize",
              }}
            >
              {data.row.original.txn_type || "N/A"}
            </Typography>
          );
        },
      },
      {
        accessorKey: "txn_units",
        header: "Units",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                textAlign: "right",
              }}
            >
              {Number(data.row.original.txn_units).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          );
        },
      },

      {
        accessorKey: "txn_price",
        header: "Rate",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                textAlign: "right",
              }}
            >
              {Number(data.row.original.txn_price).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          );
        },
      },
      {
        accessorKey: "base_amt",
        header: "Base Price",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                textAlign: "right",
              }}
            >
              {Number(data.row.original.base_amt).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          );
        },
      },
      {
        accessorKey: "broker_charge",
        header: "Broker Charge",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {Number(row.original.broker_charge).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        ),
      },
      {
        accessorKey: "sebon_charge",
        header: "SEBON Charge",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {Number(row.original.sebon_charge).toLocaleString()}
          </Typography>
        ),
      },
      {
        accessorKey: "dp_charge",
        header: "DP Charge",
      },
      {
        accessorKey: "cgt_amt",
        header: "CGT",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {Number(row.original.cgt_amt).toLocaleString()}
          </Typography>
        ),
      },
      {
        accessorKey: "total_amt",
        header: "Total Amount",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                textAlign: "right",
              }}
            >
              {Number(data.row.original.total_amt).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          );
        },
      },
      {
        accessorKey: "wacc",
        header: "WACC Rate",
        cell: (data) => {
          return (
            <Typography
              sx={{
                fontSize: "14px",
                textAlign: "right",
              }}
            >
              {Number(data.row.original.wacc).toLocaleString()}
            </Typography>
          );
        },
      },
      {
        header: "Settlement Date",
        accessorKey: "txn_date",
      },
    ],
    [selectedTransactions, displayData]
  );

  return (
    <>
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
            List of Pending Bond and Debenture Settlement
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(handleLoad)}
          sx={{
            width: "115%",
            display: "flex",
            gap: 3,
            marginTop: 2,
            ml: -1,
            mb: 0,
          }}
        >
          <SearchText
            title="Search for Pending Stock"
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
          {pendingBondDebentureSettlmentList?.responseData?.length > 0 ? (
            <TableComponent
              data={displayData ?? []}
              columns={columns}
              renderExpandedRow={renderExpandedRow}
              setSelectedRows={handleRowSelect}
              pagination={pagination}
              setPagination={setPagination}
              next={next}
              prev={prev}
              pageCount={totalPageCount}
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
                loading={PendingApprovedBondSettlement}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default BondAndDebentureSettlementPosting;
