import React, { useState, useCallback, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { PaginationState } from "@tanstack/react-table";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Empty } from "antd";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import debounce from "utils/Debounce";
import SearchText from "components/Button/Search";
import ErrorBar from "components/Snackbar/ErrorBar";
import { axiosInstance } from "config/axiosInstance";
import RoundedButton from "components/Button/Button";
import SuccessBar from "components/Snackbar/SuccessBar";
import DropdownWithIcon from "components/Button/DropDown";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import TableComponent, {
  IndeterminateCheckbox,
} from "components/Table/Posting Table/TableComponent";
import {
  useGetPendingBondAndDebentureList,
  usePostBondAndDebenturePostingApprove,
  usePostBondAndDebentureReject,
} from "services/BondAndDebenture/BondAndDebenture";

interface FormData {
  remarks: string;
  id: string;
  status: "approved" | "rejected";
  startDate: object;
  endDate: object;
}

interface StockTransaction {
  id: number;
  bond_name: string;
  txn_type: string;
  txn_units: string;
  txn_price: string;
  created_at: string;
  base_amt: string;
  broker_charge: string;
  sebon_charge: string;
  dp_charge: string;
  cgt_amt: string;
  total_amt: string;
  subRows?: StockTransaction[];
}

const txnOptions = [
  { value: "all", label: "All" },
  { value: "purchase", label: "Purchase" },
  { value: "sell", label: "Sell" },
];
const stateOptions = [
  { value: "all", label: "All" },
  { value: "listed", label: "Listed" },
  { value: "unlisted", label: "Unlisted" },
];

const BondAndDebenturePosting = () => {
  const theme = useTheme();
  const { control, handleSubmit, register, setValue } = useForm<FormData>({
    defaultValues: {
      remarks: "",
      id: "",
      startDate: dayjs(),
      endDate: dayjs(),
    },
  });

  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [state, setState] = useState<string>("all");
  const [displayData, setDisplayData] = useState([]);
  const [bondName, setBondName] = useState<string>("");
  const [txnType, setTxnType] = useState<string>("all");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [broker, setBroker] = useState<string>("Select Broker");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [brokerCodeDropdown, setBrokerCodeDropdown] = useState<any[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<
    StockTransaction[]
  >([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: pendingBondDebentureList, refetch } =
    useGetPendingBondAndDebentureList(
      bondName ?? "",
      txnType,
      state,
      broker === "Select Broker" ? "" : broker,
      pagination.pageIndex + 1
    );
  const { mutate: PendingBondDebentureApprove, isPending: PostingBondPending } =
    usePostBondAndDebenturePostingApprove();
  const { mutate: RejectBondDebenture } = usePostBondAndDebentureReject();

  const totalPageCount = Math.ceil(pendingBondDebentureList?.meta?.count / 10);

  useEffect(() => {
    if (pendingBondDebentureList?.meta?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (pendingBondDebentureList?.meta?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [pendingBondDebentureList]);

  useEffect(() => {
    setDisplayData(
      pendingBondDebentureList ? pendingBondDebentureList?.responseData : []
    );
  }, [
    bondName,
    pendingBondDebentureList?.responseData,
    pendingBondDebentureList,
  ]);

  useEffect(() => {
    const fetchBrokerCodes = async () => {
      try {
        const response = await axiosInstance.get(
          "/accounting/api/v1/parameters/broker-list"
        );
        if (response.data.isSuccess) {
          setBrokerCodeDropdown(response.data.responseData);
        }
      } catch (error) {
        console.error("Error fetching broker codes:", error);
      }
    };

    fetchBrokerCodes();
  }, []);

  const handleApproveTransaction = (row: any) => {
    const remarkValue = remarks[row.original.id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const selectedIds = row.original.id;
    const payload = {
      bond_txn_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    PendingBondDebentureApprove(payload, {
      onSuccess: () => {
        setSuccessMessage("Bond and Debenture Posting Approved Successfully.");
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
      bond_txn_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    RejectBondDebenture(payload, {
      onSuccess: () => {
        setSuccessMessage("Bond and Debenture Posting Rejected Successfully.");
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
      bond_txn_ids: selectedIds,
      remarks: data.remarks,
    };

    PendingBondDebentureApprove(payload, {
      onSuccess: () => {
        setSuccessMessage("Bond and Debenture Posting Approved Successfully.");
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
    setBondName(data.id || "");
  };

  const handleRemarkChange = (rowId: string, value: string) => {
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
  const handleChangeTxnType = (e: SelectChangeEvent<typeof txnType>) => {
    setTxnType(e.target.value);
  };

  const handleChangeState = (e: SelectChangeEvent<typeof state>) => {
    setState(e.target.value);
  };
  const handleChangeBrokerCode = (e: SelectChangeEvent<typeof broker>) => {
    setBroker(e.target.value);
  };
  const brokerOptions = brokerCodeDropdown.map((broker) => ({
    value: broker.broker_code,
    label: broker.broker_name + " (" + broker.broker_code + ")",
  }));

  const handleReset = () => {
    refetch();
    setBondName("");
    setTxnType("all");
    setState("all");
    setBroker("Select Broker");
  };
  const debouncedSetId = useCallback(
    debounce((value) => {
      setBondName(value ? value : "");
      setValue("id", value);
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
        header: "Symbol",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", width: "120px" }}>
            {row.original.bond_name}
          </Typography>
        ),
      },
      {
        accessorKey: "txn_type",
        header: "Trxn Type",
        cell: ({ row }) => (
          <Typography sx={{ textTransform: "capitalize", fontSize: "14px" }}>
            {row.original.txn_type}
          </Typography>
        ),
      },
      {
        accessorKey: "broker_code",
        header: "Broker ",
      },
      {
        accessorKey: "created_at",
        header: "Trxn Date",
        cell: ({ row }) => formatDate(row.original.created_at),
      },
      {
        accessorKey: "txn_units",
        header: "Units",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px" }}>
            {Number(row.original.txn_units).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        ),
      },

      {
        accessorKey: "txn_price",
        header: "Rate",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {Number(row.original.txn_price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        ),
      },
      {
        accessorKey: "base_amt",
        header: "Amount",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {Number(row.original.base_amt).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        ),
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
            {Number(row.original.sebon_charge).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        ),
      },
      {
        accessorKey: "dp_charge",
        header: "DP Charge",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {Number(row.original.dp_charge)}
          </Typography>
        ),
      },
      {
        accessorKey: "cgt_amt",
        header: "CGT",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {Number(row.original.cgt_amt).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        ),
      },
      {
        accessorKey: "total_amt",
        header: "Total Amount",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {Number(row.original.total_amt).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        ),
      },
      {
        accessorKey: "wacc",
        header: "Effective Rate",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: "14px", textAlign: "right" }}>
            {row.original.wacc}
          </Typography>
        ),
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
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          />
          <Box sx={{ marginLeft: "0px" }}>
            <DropdownWithIcon
              options={txnOptions}
              value={txnType}
              onChange={handleChangeTxnType}
            />
          </Box>
          <Box sx={{ marginLeft: "0px" }}>
            <DropdownWithIcon
              options={stateOptions}
              value={state}
              onChange={handleChangeState}
            />
          </Box>
          <Box sx={{ marginLeft: "0px" }}>
            <FormControl
              size="small"
              sx={{ margin: 0, padding: 0, maxHeight: "40px" }}
            >
              <Select
                autoWidth
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: "250px",
                      maxWidth: "auto",
                      overflowY: "auto",
                    },
                  },
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={broker}
                onChange={handleChangeBrokerCode}
                size="small"
                IconComponent={() => null}
                renderValue={(selected) => {
                  return (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TuneIcon sx={{ color: "#616161", cursor: "pointer" }} />
                      {selected}
                    </Box>
                  );
                }}
                variant="outlined"
                sx={{
                  mt: 1,
                  borderBlockColor: "white",
                  borderRadius: "24px",
                  backgroundColor: theme.palette.primary.light,
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiOutlinedInput-input": {
                    ml: "6px",
                  },
                }}
              >
                {brokerOptions.map((option) => (
                  <MenuItem
                    sx={{ maxHeight: "40px" }}
                    key={option.value}
                    value={option.value}
                  >
                    {option.value === " " ? "Select Broker" : option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            width: {
              xs: "95%",
              sm: "100%",
              md: "110%",
              lg: "165%",
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
                loading={PostingBondPending}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default BondAndDebenturePosting;
