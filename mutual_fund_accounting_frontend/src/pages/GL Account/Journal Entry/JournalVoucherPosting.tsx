import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Checkbox,
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
import TableComponent, {
  IndeterminateCheckbox,
} from "components/Table/Posting Table/TableComponent";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DateFormatter from "utils/DateFormatter";
import dayjs from "dayjs";
import DateField from "components/DateFilter/DateField";
import { Empty } from "antd";
import {
  useGetJournalDetails,
  useGetPendingJournalEntriesList,
  usePostApprovePendingJournalEntry,
  usePostRejectPendingJournalEntry,
} from "services/Journal Entries/journalEntriesListServices";
import { Visibility } from "@mui/icons-material";
import TableModal from "components/Modal/TableModal";
import { PaginationState } from "@tanstack/react-table";

interface FormData {
  remarks: string;
  id: string;
  status: "approved" | "rejected";
  startDate: object;
  endDate: object;
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

const JournalVoucherPosting = () => {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      remarks: "",
      id: "",
      startDate: dayjs(),
      endDate: dayjs(),
    },
  });

  const theme = useTheme();
  const [id, setId] = useState<string>("");
  const [displayData, setDisplayData] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorbarOpen, setErrorbarOpen] = useState<boolean>(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [next, setNext] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [entryId, setEntryId] = useState(null);
  const [modalData, setModalData] = useState([]);

  const [pageSize, setPageSize] = useState<number>(10);

  const { data: postingList, isSuccess: entryListSuccess } =
    useGetPendingJournalEntriesList(
      searchData.from_date,
      searchData.to_date,
      pagination.pageIndex + 1,
      pageSize
    );

  const {
    data: entryDetailData,
    isSuccess: entryDetailSuccess,
    refetch: entryDetailRefetch,
  } = useGetJournalDetails(entryId);

  const { mutate: ApproveJournalEntry } = usePostApprovePendingJournalEntry();
  const { mutate: RejectPendingJournalentry } =
    usePostRejectPendingJournalEntry();

  const totalPageCount = Math.ceil(postingList?.responseData?.count / pageSize);

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
  }, [postingList, entryListSuccess]);

  useEffect(() => {
    if (entryListSuccess) {
      const tempData = postingList?.responseData?.results?.map((item) => ({
        entryNo: item.id,
        transactionDate: item.created_at,
        entryBy: item.entered_by,

        drAmt: item.dr_total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"),
        crAmt: item.cr_total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"),

        description:
          item.narration !== null && item.narration !== ""
            ? item.narration
            : item.entries.map((entry) => entry.description).slice(-1),
      }));

      setDisplayData(tempData);
    }
  }, [entryDetailData, entryListSuccess, postingList]);

  useEffect(() => {
    if (entryDetailSuccess) {
      const tempData = entryDetailData?.responseData?.entries?.map(
        (item, index) => ({
          sn: index + 1,
          ledgerHead: item.sub_ledger_head,
          drAmt: item.dr !== null ? item.dr : "",
          crAmt: item.cr !== null ? item.cr : "",
          desc: item.description,
        })
      );

      setModalData(tempData);
    }
  }, [entryDetailData, entryDetailSuccess]);

  const handleEntry = async (id: number) => {
    setEntryId(id);
    setModalOpen(true);
  };

  useEffect(() => {
    if (entryId) {
      entryDetailRefetch();
    }
  }, [entryId]);

  useEffect(() => {
    if (entryDetailSuccess) {
      const tempData = entryDetailData?.responseData?.entries?.map(
        (item, index) => ({
          sn: index + 1,
          ledgerHead: item.sub_ledger_head,
          drAmt: item.dr !== null ? item.dr : "",
          crAmt: item.cr !== null ? item.cr : "",
          desc: item.description,
        })
      );

      setModalData(tempData);
    }
  }, [entryDetailData, entryDetailSuccess]);

  const handleApproveTransaction = (row: any) => {
    const remarkValue = remarks[row.original.entryNo] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const payload = {
      pending_journal_entry_ids: [Number(row.original.entryNo)],
      remarks: remarkValue,
    };

    ApproveJournalEntry(payload, {
      onSuccess: () => {
        setSuccessMessage("Journal Entry Approved Successfully.");
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
      delete newRemarks[row.original.entryNo];
      return newRemarks;
    });
  };

  const handleRejectTransaction = (row: any) => {
    const remarkValue = remarks[row.original.entryNo] || "";
    if (!remarkValue.trim()) {
      return;
    }
    const payload = {
      pending_journal_entry_ids: [Number(row.original.entryNo)],
      remarks: remarkValue,
    };

    RejectPendingJournalentry(payload, {
      onSuccess: () => {
        setSuccessMessage("Journal Entry Rejected Successfully.");
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
      delete newRemarks[row.original.entryNo];
      return newRemarks;
    });
  };

  const handlePostTransaction = (data: FormData) => {
    if (selectedTransactions.length === 0) {
      return;
    }
    const selectedIds = selectedTransactions.map((row) => row.entryNo);
    const payload = {
      pending_journal_entry_ids: selectedIds,
      remarks: data.remarks,
    };

    ApproveJournalEntry(payload, {
      onSuccess: () => {
        setSuccessMessage("Journal Entry Approved Successfully.");
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
  const handleRowSelect = (row: any) => {
    setSelectedTransactions((prev) => {
      const existingItemIndex = prev.findIndex(
        (r) => r.entryNo === row.entryNo || r.entryNo === row.id
      );

      if (existingItemIndex !== -1) {
        const updatedSelections = prev.filter(
          (r) => r.entryNo !== row.entryNo && r.entryNo !== row.id
        );

        return updatedSelections;
      } else {
        const newSelection = {
          entryNo: row.entryNo || row.id,
          transactionDate: row.transactionDate || row.created_at,
          description: row.description || row.narration,
          drAmt: row.drAmt,
          crAmt: row.crAmt,
          ...row,
        };

        const updatedSelections = [...prev, newSelection];
        return updatedSelections;
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allSelectedRows = displayData.map((row) => ({
        entryNo: row.entryNo,
        transactionDate: row.transactionDate,
        description: row.description,
        drAmt: row.drAmt,
        crAmt: row.crAmt,
        ...row,
      }));

      setSelectedTransactions(allSelectedRows);
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
        value={remarks[row.original.entryNo] || ""}
        onChange={(e) =>
          handleRemarkChange(row.original.entryNo, e.target.value)
        }
        sx={{ ml: 3 }}
      />
      <IconButton
        sx={{ ml: 1 }}
        onClick={() => handleApproveTransaction(row)}
        disabled={!remarks[row.original.entryNo]?.trim()}
      >
        <CheckIcon
          style={{
            color: remarks[row.original.entryNo]?.trim() ? "green" : "gray",
          }}
        />
      </IconButton>
      <IconButton
        sx={{ ml: 1 }}
        onClick={() => handleRejectTransaction(row)}
        disabled={!remarks[row.original.entryNo]?.trim()}
      >
        <CloseIcon
          style={{
            color: remarks[row.original.entryNo]?.trim() ? "red" : "gray",
          }}
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
    setDisplayData(postingList?.responseData?.results || []);
    reset();
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => (
          <Checkbox
            sx={{
              width: "5px",
              height: "5px",
              "& .MuiSvgIcon-root": { fontSize: 19 },
            }}
            checked={
              displayData.length > 0 &&
              selectedTransactions.length === displayData.length
            }
            indeterminate={
              selectedTransactions.length > 0 &&
              selectedTransactions.length < displayData.length
            }
            onChange={(e) => {
              handleSelectAll(e.target.checked);
            }}
          />
        ),
        cell: ({ row }) => {
          const isSelected = selectedTransactions.some(
            (selectedRow) =>
              selectedRow.entryNo === row.original.entryNo ||
              selectedRow.entryNo === row.original.id
          );

          return (
            <Checkbox
              sx={{
                width: "5px",
                height: "5px",
                "& .MuiSvgIcon-root": { fontSize: 19 },
              }}
              checked={isSelected}
              onChange={() => {
                handleRowSelect(row.original);
              }}
            />
          );
        },
      },
      {
        header: "Created Date",
        accessorKey: "transactionDate",
        cell: ({ row }) => {
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: 400, width: "max-content" }}
            >
              {" "}
              {row?.original?.transactionDate.split("T")[0]}{" "}
            </Typography>
          );
        },
      },
      {
        header: "Timestamp",
        accessorKey: "transactionDate",
        cell: ({ row }) => {
          const transactionDate = new Date(row?.original?.transactionDate);
          const nepaliTime = transactionDate.toLocaleTimeString("en-US");
          return (
            <Typography
              sx={{ fontSize: "14px", fontWeight: 400, width: "max-content" }}
            >
              {nepaliTime}
            </Typography>
          );
        },
      },
      {
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => {
          return (
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {" "}
              {row?.original?.description}{" "}
            </Typography>
          );
        },
      },
      {
        header: "Entered By",
        accessorKey: "entered_by",
        cell: ({ row }) => {
          return (
            <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
              {row?.original?.entryBy ? row?.original?.entryBy : "-"}
            </Typography>
          );
        },
      },
      {
        header: "Dr Amount",
        accessorKey: "drAmt",
        cell: ({ row }) => {
          return (
            <Typography
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "60px",
                fontSize: "14px",
                fontWeight: 400,
                mr: 8,
              }}
            >
              {" "}
              {row?.original?.drAmt}{" "}
            </Typography>
          );
        },
      },
      {
        header: "Cr Amount",
        accessorKey: "crAmt",
        cell: ({ row }) => {
          return (
            <Typography
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "60px",
                fontSize: "14px",
                fontWeight: 400,
                mr: 2,
              }}
            >
              {" "}
              {row?.original?.crAmt}{" "}
            </Typography>
          );
        },
      },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => {
          return (
            <Box
              onClick={() => handleEntry(row.original.entryNo)}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 0.5,
                textAlign: "center",
                color: theme.palette.primary[1100],
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              <Visibility sx={{ fontSize: "14px", fontWeight: 600 }} />
              <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                View
              </Typography>
            </Box>
          );
        },
      },
    ],
    [selectedTransactions, displayData]
  );

  return (
    <>
      <TableModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        data={modalData}
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
            Search Filters
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(handleLoad)}
          sx={{
            width: "100%",
            // display: "flex",
            gap: 3,
            marginTop: 1,
            ml: -1,
            mb: 0,
          }}
        >
          <Box sx={{ mt: -1, ml: 2 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
            />
          </Box>
          <Box sx={{ mt: 1.5, ml: 2 }}>
            <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
          </Box>
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
              data={displayData ?? []}
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
          message={successMessage}
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

export default JournalVoucherPosting;
