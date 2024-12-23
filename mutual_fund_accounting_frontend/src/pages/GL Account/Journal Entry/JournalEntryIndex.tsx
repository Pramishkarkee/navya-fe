import React, { useEffect, useState } from "react";

//mui
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  TextField,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { TableCellProps } from "@mui/material/TableCell";
import { useTheme, styled } from "@mui/material/styles";

//mui datepickers
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

//mui icons
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Add from "@mui/icons-material/Add";

//components
import TypographyLabel from "components/InputLabel/TypographyLabel";
import RoundedButton from "components/Button/Button";
import SchemeName from "components/Scheme Field/SchemeName";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";

//react-query
// import { useGetLedgerHeadList } from "services/LedgerHeadServices";
import { useJournalEntriesMutation } from "services/Journal Entries/journalEntriesServices";
import dayjs, { Dayjs } from "dayjs";
// import { PaginationState } from "@tanstack/react-table";
// import { PaginationState } from "@tanstack/react-table";
import { useGetAllSubLedgerHeadList } from "services/SubLedgerHeadServices";
import { useGlobalStore } from "store/GlobalStore";

const columns = [
  {
    label: "S.No",
    width: "7%",
  },
  {
    label: "Particulars",
    width: "43%",
  },
  {
    label: "Debit",
    width: "17%",
  },
  {
    label: "Credit",
    width: "17%",
  },
  {
    label: "Description",
    width: "30%",
  },
];

const DefTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  height: "1rem",
  padding: "0rem",
  lineHeight: 1.5,
  fontFamily: "inherit",
  borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
  borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,

  "&.MuiTableCell-root:last-child": {
    borderRight: "none",
  },
}));

export default function JournalEntryIndex() {
  const allotmentDate = useGlobalStore((state) => state.allotmentDate);
  const theme = useTheme();
  let totalDebit = 0;
  let totalCredit = 0;
  const [rows, setRows] = useState([
    {
      sn: 1,
      ledgerHead: "",
      debit: 0,
      credit: 0,
      description: "",
      ledgerHead_id: null,
    },
    {
      sn: 2,
      ledgerHead: "",
      debit: 0,
      credit: 0,
      description: "",
      ledgerHead_id: null,
    },
  ]);

  const date = dayjs(Date.now());
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [transDate, setTransDate] = useState<Dayjs>(date);
  const [ledgerHeadOptions, setLedgerHeadOptions] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);

  const { data: subLedgerHeadData, isPending: subLedgerHeadPending } =
    useGetAllSubLedgerHeadList();

  const {
    data: journalEntriesData,
    mutate: journalEntryMutate,
    isSuccess: journalEntrySuccess,
    isError: journalEntryError,
  } = useJournalEntriesMutation();

  useEffect(() => {
    if (subLedgerHeadData) {
      subLedgerHeadData?.responseData?.map((item) => {
        const ledgerHeadObj = { label: item.sub_ledger_head, id: item.id };
        setLedgerHeadOptions((prev) => [...prev, ledgerHeadObj]);
      });
    }
  }, [subLedgerHeadPending, subLedgerHeadData]);

  useEffect(() => {
    if (journalEntriesData?.isSuccess) {
      setSnackbarOpen(true);
      setRows([
        {
          sn: 1,
          ledgerHead: "",
          debit: 0,
          credit: 0,
          description: "",
          ledgerHead_id: null,
        },
        {
          sn: 2,
          ledgerHead: "",
          debit: 0,
          credit: 0,
          description: "",
          ledgerHead_id: null,
        },
      ]);
    }
  }, [journalEntrySuccess, journalEntriesData]);

  useEffect(() => {
    if (journalEntryError) {
      setSnackbarErrorOpen(true);
      setErrorMsg("Error in Posting Journal Entry. ");
    }
  }, [journalEntryError]);

  const handleRowChange = (index: number, field: number | string, value) => {
    const updatedRows = [...rows];
    if (typeof value === "object" && "id" in value) {
      updatedRows[index][field] = value.label;
      updatedRows[index][`${field}_id`] = value.id;
    } else {
      updatedRows[index][field] = value;
    }
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const firstRow = {
      sn: rows.length + 1,
      ledgerHead: "",
      debit: 0,
      credit: 0,
      description: "",
      ledgerHead_id: null,
    };
    const secondRow = {
      sn: rows.length + 2,
      ledgerHead: "",
      debit: 0,
      credit: 0,
      description: "",
      ledgerHead_id: null,
    };
    const thirdRow = {
      sn: rows.length + 3,
      ledgerHead: "",
      debit: 0,
      credit: 0,
      description: "",
      ledgerHead_id: null,
    };
    setRows([...rows, firstRow, secondRow, thirdRow]);
  };

  const handleClear = () => {
    setRows([
      {
        sn: 1,
        ledgerHead: "",
        debit: 0,
        credit: 0,
        description: "",
        ledgerHead_id: null,
      },
      {
        sn: 2,
        ledgerHead: "",
        debit: 0,
        credit: 0,
        description: "",
        ledgerHead_id: null,
      },
    ]);
  };

  const handleDeleteClick = (index: number) => {
    if (rows.length === 1) return;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows.map((row, idx) => ({ ...row, sn: idx + 1 })));
  };

  totalDebit = rows.reduce((total, item) => {
    const debit = Number(item.debit);
    if (!isNaN(debit)) {
      total += debit;
    }
    return total;
  }, 0);

  totalCredit = rows.reduce((total, item) => {
    const debit = Number(item.credit);
    if (!isNaN(debit)) {
      total += debit;
    }
    return total;
  }, 0);

  const handleAddEntry = () => {
    if (totalDebit != totalCredit || totalDebit === 0 || totalCredit === 0) {
      setSnackbarErrorOpen(true);
      setErrorMsg("Total debit and credit amount are not equal");
      return;
    }

    const formattedDate = transDate.format("YYYY-MM-DD");

    const entries = rows.map((entry) => {
      return {
        sub_ledger_id: entry.ledgerHead_id,
        dr: entry.debit > 0 ? Number(entry.debit) : null,
        cr: entry.credit > 0 ? Number(entry.credit) : null,
        description: entry.description,
      };
    });

    const finalData = {
      entries,
      dr_total: totalDebit,
      cr_total: totalCredit,
      transaction_date: formattedDate,
    };
    console.log("object", JSON.stringify(finalData));
    journalEntryMutate(finalData);
  };

  return (
    <Box>
      <SuccessBar
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        message="Journal Entry updated successfully"
      />

      <ErrorBar
        snackbarOpen={snackbarErrorOpen}
        setSnackbarOpen={setSnackbarErrorOpen}
        message={errorMsg}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          my: 3,
          alignItems: "center",
        }}
      >
        <SchemeName />
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TypographyLabel title={"Transaction Date"} />
            <DatePicker
              maxDate={dayjs()}
              minDate={dayjs(allotmentDate)}
              value={transDate}
              onChange={(val) => setTransDate(val)}
              sx={{
                "& .MuiSvgIcon-root": {
                  width: "16px",
                  height: "16px",
                  fontSize: "14px",
                  fontWeight: "400px",
                },
              }}
              slotProps={{
                textField: { size: "small" },
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Box sx={{ my: 2 }}>
        <HeaderDesc title="Journal Entries" />
      </Box>
      <Table sx={{ width: { xs: "110%", lg: "165%" } }}>
        <TableHead>
          <TableRow>
            {columns?.map((item, index) => (
              <DefTableCell
                key={index}
                sx={{
                  width: item.width,
                  p: 1.5,
                  textAlign: index === 2 || index === 3 ? "end" : "start",
                  fontSize: "14px",
                  fontWeight: "400px",
                }}
              >
                {item.label}
              </DefTableCell>
            ))}
            <DefTableCell
              sx={{
                p: 1,
              }}
            ></DefTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.keys(row).map(
                (field, cellIndex) =>
                  field !== "ledgerHead_id" && (
                    <DefTableCell key={cellIndex} sx={{}}>
                      {cellIndex === 1 ? (
                        <Autocomplete
                          size="small"
                          value={row[field]}
                          onChange={(event: any, newValue: string | null) =>
                            handleRowChange(rowIndex, field, newValue)
                          }
                          options={ledgerHeadOptions}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              //placeholder='Select Ledger Head'
                              sx={{
                                p: 0,
                                borderRadius: 0,
                                fontSize: "14px",
                                fontWeight: "400px",
                                "& .MuiOutlinedInput-input": {
                                  color: theme.palette.secondary[700],
                                },
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": {
                                    borderColor: "#B2BAC2",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: theme.palette.secondary.main,
                                  },
                                },
                                "& MuiOutlinedInput-input:Mui-focused": {
                                  borderColor: theme.palette.secondary[700],
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "1px solid transparent",
                                  borderRadius: 0,
                                },
                              }}
                            />
                          )}
                        />
                      ) : (
                        <TextField
                          fullWidth
                          size="small"
                          value={row[field] === 0 ? "" : row[field]}
                          onChange={(e) =>
                            handleRowChange(rowIndex, field, e.target.value)
                          }
                          inputProps={{
                            readOnly: cellIndex === 0 ? true : false,
                            style: {
                              // fontSize: "18px",
                              // width: "100%",
                              // padding : "0.2rem",
                              textAlign:
                                cellIndex === 2 || cellIndex === 3
                                  ? "end"
                                  : cellIndex === 0
                                  ? "center"
                                  : "start",
                            },
                          }}
                          sx={{
                            p: 0,
                            borderRadius: 0,
                            fontSize: "14px",
                            fontWeight: "400px",
                            "& .MuiOutlinedInput-input": {
                              color: theme.palette.secondary[700],
                              width: "100%",
                            },
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": {
                                borderColor: "#B2BAC2",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: theme.palette.secondary.main,
                              },
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "1px solid transparent",
                              borderRadius: 0,
                            },
                          }}
                        />
                      )}
                    </DefTableCell>
                  )
              )}
              <DefTableCell
                sx={{
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "400px",
                }}
              >
                <IconButton onClick={() => handleDeleteClick(rowIndex)}>
                  <DeleteOutlined />
                </IconButton>
              </DefTableCell>
            </TableRow>
          ))}
          <TableRow>
            <DefTableCell
              sx={{
                p: 1,
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "400px",
              }}
            >
              <IconButton
                onClick={() => {
                  setRows([
                    ...rows,
                    {
                      sn: rows.length + 1,
                      ledgerHead: "",
                      debit: 0,
                      credit: 0,
                      description: "",
                      ledgerHead_id: null,
                    },
                  ]);
                }}
                sx={{
                  bgcolor: theme.palette.primary[1100],
                  fontSize: "14px",
                  fontWeight: "400px",
                  color: "#fff",
                  p: 0,
                  "&:hover": {
                    bgcolor: theme.palette.secondary.main,
                  },
                }}
              >
                <Add sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </DefTableCell>
            <DefTableCell></DefTableCell>
            <DefTableCell></DefTableCell>
            <DefTableCell></DefTableCell>
            <DefTableCell></DefTableCell>
            <DefTableCell></DefTableCell>
          </TableRow>

          <TableRow
            sx={{
              bgcolor: theme.palette.background.light,
              borderBottom: "none",
              fontSize: "14px",
              fontWeight: "400px",
            }}
          >
            <TableCell
              colSpan={2}
              sx={{
                p: "0.3rem",
                textAlign: "center",
                color: theme.palette.secondary[700],
                fontSize: "14px",
                fontWeight: "400px",
              }}
            >
              Total
            </TableCell>
            <TableCell
              sx={{
                p: "0.3rem",
                textAlign: "center",
                color: theme.palette.secondary[700],
                fontSize: "14px",
                fontWeight: "400px",
              }}
            >
              {totalDebit}
            </TableCell>
            <TableCell
              sx={{
                p: "0.3rem",
                textAlign: "center",
                color: theme.palette.secondary[700],
                fontSize: "14px",
                fontWeight: "400px",
              }}
            >
              {totalCredit}
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          my: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleAddRow}
          size="small"
          sx={{
            boxShadow: "none",
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "100px",
            bgcolor: theme.palette.background.light,
            color: theme.palette.primary[1100],
            "&:hover": {
              bgcolor: theme.palette.secondary[300],
              boxShadow: "none",
            },
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.primary[1100],
              color: "#fff",
              display: "flex",
              borderRadius: "50%",
            }}
          >
            <Add sx={{ fontSize: "1.2rem" }} />
          </Box>
          <Typography sx={{ fontSize: "14px" }}>Add Lines</Typography>
        </Button>

        <Button
          variant="outlined"
          onClick={handleClear}
          size="small"
          sx={{
            borderRadius: "100px",
          }}
        >
          Clear Lines
        </Button>
      </Box>
      {/* <Box sx={{ my: 2 }}>
        <TypographyLabel title='Narration' />
        <TextField
          size="small"
          multiline
          sx={{
            width: '50%'
          }}
        />
      </Box> */}

      <RoundedButton
        title1="Add Entry"
        onClick1={handleAddEntry}

        // title2='Reset'
        // onClick2={handleReset}
      />
    </Box>
  );
}
