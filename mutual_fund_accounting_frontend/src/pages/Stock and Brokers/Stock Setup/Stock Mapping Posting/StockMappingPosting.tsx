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
} from "components/Table/Posting Table/TableComponent";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DateFormatter from "utils/DateFormatter";
import dayjs from "dayjs";
import * as yup from "yup";
import DateField from "components/DateFilter/DateField";
import {
  useGetStockMappingListDate,
  usePostStockAndBondPostingList,
} from "services/Stock Mapping/StockMappingService";
import { Empty } from "antd";
import debounce from "utils/Debounce";

interface FormData {
  remarks: string;
  id: string;
  status: "approved" | "rejected";
  startDate: object;
  endDate: object;
}

interface FormDataList {
  id: number;
  symbol: string;
  stock_name: string;
  face_value: string;
  stock_paid_up_capital: string;
  current_units: number;
  txn_paid_up_limit: number;
  txn_scheme_limit: string;
  subRows?: FormDataList[];
}

const DateFormatterUnit = {
  format: (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  },
};
const schema = yup
  .object({
    startDate: yup.object().required(),
    endDate: yup.object().required(),
    id: yup.number(),
  })
  .required();

const StockMappingPosting = () => {
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
  const [loadClicked, setLoadClicked] = useState(false);
  const [displayData, setDisplayData] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState<
    FormDataList[]
  >([]);
  const [transactionRemarks, setTransactionRemarks] = useState<{
    [key: number]: string;
  }>({});

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorbarOpen, setErrorbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);

  const [pageSize, setPageSize] = useState<number>(10);

  const { data: postingList } = useGetStockMappingListDate(
    searchData?.from_date,
    searchData?.to_date,
    pagination.pageIndex + 1,
    id,
    pageSize
  );
  const { mutate: PostPosting } = usePostStockAndBondPostingList();
  // const totalPageCount = Math.ceil(postingList?.responseData?.count / 10 || 1);
  const totalPageCount = Math.ceil(postingList?.responseData?.count / pageSize);

  useEffect(() => {
    const responseData = postingList?.responseData;

    setNext(responseData?.next === null);
    setPrev(responseData?.previous === null);
  }, [postingList]);

  useEffect(() => {
    if (postingList) {
      setDisplayData(postingList?.responseData?.results || []);
    }
    if (id) {
      setDisplayData(postingList?.responseData?.results || []);
    }
  }, [id, postingList, postingList]);

  const handleApproveTransaction = (row: any) => {
    const remarkValue = remarks[row.original.id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    // const selectedIds = selectedTransactions.map((row) => row.id);
    const payload = {
      id: row.original.id,
      remarks: remarkValue,
      status: "approved",
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
  useEffect(() => {
    if (id) {
      setDisplayData(postingList ? postingList?.responseData?.results : []);
    }
  }, [id, postingList?.responseData?.results]);

  const handleLoad = (data) => {
    setId(data.id || "");
    if (data?.startDate && data?.endDate) {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatterUnit.format(toDate.toISOString());

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
  const handleRowSelect = (row: FormDataList) => {
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
      {/* <Box>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
          Paid Up Capital
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {row.original.paid_up_capital}
        </Typography>
      </Box> */}

      <Box sx={{ ml: 3 }}>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
          Face Value
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {row.original.face_value}
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
        accessorKey: "symbol",
        header: "Symbol",
      },
      {
        accessorKey: "stock_name",
        header: "Stock Name",
      },
      {
        accessorKey: "sector",
        header: "Sector",
      },
      {
        accessorKey: "price_per_share",
        header: "Price Per Share",
      },
      {
        accessorKey: "current_units",
        header: "Current Units",
      },
      {
        accessorKey: "transaction_limit",
        header: "Transactions Limit",
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
              pageCount={totalPageCount}
              setPageSize={setPageSize}
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

export default StockMappingPosting;
