import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RoundedButton from "components/Button/Button";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import SearchText from "components/Button/Search";
import TableComponent, {
  IndeterminateCheckbox,
} from "../../../components/Table/Posting Table/TableComponent";

import { PaginationState } from "@tanstack/react-table";
import {
  useGetPendingBankAccontCreatedList,
  usePostApprovePendingBankAccount,
  usePostARejectPendingBankAccount,
} from "services/BankAccount/BankAccountServices";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

interface FormData {
  remarks: string;
  id: string;
  status: "approved" | "rejected";
}

interface BankAccount {
  id: number;
  bank_name: string;
  account_number: string;
  account_type: string;
  opening_balance: number;
  account_balance: number;
  subRows?: BankAccount[];
}

const BankAccountPosting = () => {
  const { control, handleSubmit, register, setValue } = useForm<FormData>({
    defaultValues: {
      remarks: "",
      id: "",
    },
  });
  const theme = useTheme();
  const [id, setId] = useState<string>("");
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [selectedTransactions, setSelectedTransactions] = useState<
    BankAccount[]
  >([]);
  const [transactionRemarks, setTransactionRemarks] = useState<{
    [key: number]: string;
  }>({});
  const [displayData, setDisplayData] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchNext, setSearchNext] = useState<boolean>(false);
  const [searchPrev, setSearchPrev] = useState<boolean>(false);

  const { data: pendingBankAccountData } = useGetPendingBankAccontCreatedList(
    id,
    pagination.pageIndex + 1
  );
  const { mutate: ApprovePendingBankAccount } =
    usePostApprovePendingBankAccount();
  const { mutate: RejectPendingBankAccount } =
    usePostARejectPendingBankAccount();

  const totalPageCount = Math.ceil(pendingBankAccountData?.count / 10 || 1);

  useEffect(() => {
    if (pendingBankAccountData?.next === null) {
      setSearchNext(false);
    } else {
      setSearchNext(true);
    }
    if (pendingBankAccountData?.previous === null) {
      setSearchPrev(false);
    } else {
      setSearchPrev(true);
    }
  }, [pendingBankAccountData]);

  useEffect(() => {
    if (pendingBankAccountData) {
      setDisplayData(pendingBankAccountData?.responseData || []);
    }
    if (id) {
      setDisplayData(pendingBankAccountData?.responseData || []);
    }
  }, [id, pendingBankAccountData]);

  const handleApproveTransaction = (row: any) => {
    const remarkValue = remarks[row.original.id] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const selectedIds = row.original.id;
    const payload = {
      bank_account_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    ApprovePendingBankAccount(payload, {
      onSuccess: () => {
        setSuccessMessage("Bank Account Creation Approved Successfully.");
        setSnackbarOpen(true);
        setSelectedTransactions([]);
        // Clear the remarks for this specific row
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
    const selectedIds = row.original.id;
    const payload = {
      bank_account_ids: [Number(selectedIds)],
      remarks: remarkValue,
    };

    RejectPendingBankAccount(payload, {
      onSuccess: () => {
        setSuccessMessage("Bank Account Creation Rejected Successfully.");
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
      bank_account_ids: selectedIds,
      remarks: data.remarks,
    };

    ApprovePendingBankAccount(payload, {
      onSuccess: () => {
        setSuccessMessage("Bank Account Creation Approved Successfully.");
        setSnackbarOpen(true);
        setSelectedTransactions([]);
        setTransactionRemarks({});
      },
      onError: () => {
        setErrorbarOpen(true);
        setErrorMessage("Error occurred while Posting transactions.");
        setTransactionRemarks("");
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
      {/* <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
          Opening Balance
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {row.original.opening_balance}
        </Typography>
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 1.5,
            }}
          ></Box>
        </Box>
      </Box> */}
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
        header: "Bank Name",
        accessorKey: "bank_name",
        cell: (data) => {
          // const { data: bankListData } = useGetBankListData();

          // const bankName = bankListData?.responseData?.find(
          //   (bank) => bank?.id === data?.row?.original?.bank
          // )?.bank_name;

          return (
            <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
              {data.row.original.bank_name}
            </Typography>
          );
        },
      },
      {
        header: "Account Number",
        accessorKey: "account_number",
        cell: (data) => {
          return (
            <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
              {data.row.original.account_number}
            </Typography>
          );
        },
      },
      {
        header: "Account Type",
        accessorKey: "account_type",
        cell: (data) => {
          const accountType = data.row.original.account_type;

          const displayType =
            accountType === 1
              ? "FD"
              : accountType === 2
              ? "CALL"
              : accountType === 3
              ? "CURRENT"
              : "CALL";

          return (
            <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
              {displayType}
            </Typography>
          );
        },
      },
      {
        header: "Account Balance",
        accessorKey: "account_balance",
        cell: (data) => {
          return (
            <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
              {data.row.original.account_balance}
            </Typography>
          );
        },
      },
      {
        header:'Created At',
        accessorKey:'created_at',
        cell:(data) => {
          const createdAt = data.row.original?.created_at;
          return(
            <Typography sx={{ fontSize: "14px", fontWeight: "400px" }}>
              {dayjs(createdAt ? createdAt : "N/A").format("YYYY-MM-DD")}
            </Typography>
          );
        }
      }
    ],
    [selectedTransactions, displayData]
  );

  // const transformData = (data) => {
  //   if (!data?.responseData) return [];
  //   const transformedData: BankAccount[] = [];
  //   data.responseData.forEach((bank) => {
  //     Object.keys(bank.bank_accounts).forEach((accountType) => {
  //       bank.bank_accounts[accountType].forEach((account) => {
  //         transformedData.push({
  //           id: bank.id,
  //           bank_name: bank.bank_name,
  //           account_number: account.account_number,
  //           account_type: accountType,
  //           opening_balance: 2504000000,
  //           account_balance: 1000000000,
  //         });
  //       });
  //     });
  //   });
  //   return transformedData;
  // };

  // const transformedData = useMemo(
  //   () => transformData(pendingBankAccountData),
  //   [pendingBankAccountData]
  // );

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
            Bank Accounts
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
            overflowX: "hidden",
          }}
        >
          <TableComponent
            data={pendingBankAccountData?.responseData || []}
            columns={columns}
            renderExpandedRow={renderExpandedRow}
            setSelectedRows={handleRowSelect}
            pagination={pagination}
            setPagination={setPagination}
            next={searchNext}
            prev={searchPrev}
            pageCount={totalPageCount}
          />
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

export default BankAccountPosting;
