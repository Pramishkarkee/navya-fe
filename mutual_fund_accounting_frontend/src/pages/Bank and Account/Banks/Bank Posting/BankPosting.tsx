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
import TableComponent, {
  IndeterminateCheckbox,
} from "../../../../components/Table/Posting Table/TableComponent";
import {
  useGetBankListDate,
  usePostBankPostingList,
} from "services/Bank and Branches/BankAndBranchesServices";
import { PaginationState } from "@tanstack/react-table";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { colorTokens } from "../../../../theme";
import BranchDetailsModal from "components/Modal/branchModel";
import dayjs from "dayjs";
import { Empty } from "antd";
import debounce from "utils/Debounce";

interface FormData {
  remarks: string;
  id: string;
  status: "approved" | "rejected";
  startDate: object;
  endDate: object;
}

interface BankAccount {
  id: number;
  bank_name: string;
  bank_code: string;
  bank_address: string;
  swift_code: string;
  bank_type: string;
  subRows?: BankAccount[];
}

const BankPosting = () => {
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
  const [id, setId] = useState("");
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorbarOpen, setErrorbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedTransactions, setSelectedTransactions] = useState<
    BankAccount[]
  >([]);
  const [transactionRemarks, setTransactionRemarks] = useState<{
    [key: number]: string;
  }>({});
  const [displayData, setDisplayData] = useState([]);

  const [open, setOpen] = useState(false);
  const [next, setNext] = useState<boolean>();
  const [prev, setPrev] = useState<boolean>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });

  // const [pageSize, setPageSize] = useState<number>(10);

  const { data: postingList } = useGetBankListDate(
    searchData?.from_date,
    searchData?.to_date,
    pagination.pageIndex + 1,
    id
  );
  const { mutate: PostPosting } = usePostBankPostingList();

  const totalPageCount = Math.ceil(postingList?.responseData?.count / 10);

  useEffect(() => {
    if (postingList?.responseData?.next === null) {
      setNext(true);
    } else {
      setNext(false);
    }
    if (postingList?.responseData?.previous === null) {
      setPrev(true);
    } else {
      setPrev(false);
    }
  }, [postingList]);

  useEffect(() => {
    if (postingList) {
      setDisplayData(postingList?.responseData?.results || []);
    }
    if (id) {
      setDisplayData(postingList?.responseData?.results || []);
    }
  }, [id, postingList, postingList]);

  useEffect(() => {
    if (id) {
      setDisplayData(postingList ? postingList?.responseData?.results : []);
    }
  }, [id, postingList?.responseData?.results]);

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
        setSnackbarOpen(true);
        setSelectedTransactions([]);
        setRemarks((prev) => {
          const newRemarks = { ...prev };
          delete newRemarks[row.original.id];
          return newRemarks;
        });
      },
      onError: () => {
        setErrorbarOpen(true);
        setErrorMessage("Error occurred while Posting transactions.");
      },
    });
  };

  const handleRejectTransaction = (row: any) => {
    const remarkValue = remarks[row.original.id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    // const selectedIds = selectedTransactions.map((row) => row.id);

    const payload = {
      id: row.original.id,
      remarks: remarkValue,
      status: "rejected",
    };

    PostPosting(payload, {
      onSuccess: () => {
        setSnackbarOpen(true);
        setSelectedTransactions([]);
        setRemarks((prev) => {
          const newRemarks = { ...prev };
          delete newRemarks[row.original.id];
          return newRemarks;
        });
      },
      onError: () => {
        setErrorbarOpen(true);
        setErrorMessage("Error occurred while Posting transactions.");
      },
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
      // || Object.values(transactionRemarks).join(", "),
    };

    PostPosting(payload, {
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
    setId(data.id || "");
  };

  const handleRemarkChange = (rowId: number, value: string) => {
    setRemarks((prev) => ({
      ...prev,
      [rowId]: value,
    }));
  };

  const handleView = () => {
    setOpen(true);
  };
  const handleRowSelect = (row: BankAccount) => {
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
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
          Branches
        </Typography>
        <Box>
          <BranchDetailsModal
            open={open}
            setOpen={setOpen}
            data={{
              isSuccess: true,
              message: null,
              responseData: [row.original],
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <Box
              onClick={handleView}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.6,
                color: colorTokens.mainColor[1100],
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <Typography sx={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                View Branches
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
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
    setId("");
    setSearchData({
      from_date: "",
      to_date: "",
    });
    setDisplayData(postingList?.responseData || []);
    reset();
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
    }, 500),
    [setValue]
  );

  const bankTypeMap = {
    commercial_bank: "Commercial Bank",
    development_banks: "Development Bank",
    finance: "Finance",
    microfinance: "Microfinance",
    infrastructure: "Infrastructure",
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
        accessorKey: "bank_code",
        header: "Bank Code",
      },
      {
        accessorKey: "bank_name",
        header: "Bank Name",
      },
      {
        accessorKey: "bank_address",
        header: "Bank Address",
      },
      {
        accessorKey: "swift_code",
        header: "SWIFT Code",
      },
      {
        accessorKey: "bank_type",
        header: "Bank Type",
        cell: (data) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: "400px", textAlign: "left" }}
            >
              {bankTypeMap[data?.row?.original?.bank_type] || "N/A"}{" "}
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
          message={"Successfully Submitted!"}
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
            List of Banks
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
          <Box>
            {displayData?.length > 0 ? (
              <Box>
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
                  // setPageSize={setPageSize}
                />
              </Box>
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
        </Box>
      </Box>
    </>
  );
};

export default BankPosting;
