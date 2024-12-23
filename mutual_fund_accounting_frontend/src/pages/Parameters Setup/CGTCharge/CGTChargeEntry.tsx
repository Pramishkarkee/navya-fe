import React, { useEffect, useState } from "react";

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
  //   Autocomplete,
} from "@mui/material";
import { TableCellProps } from "@mui/material/TableCell";
import { useTheme, styled } from "@mui/material/styles";

import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Add from "@mui/icons-material/Add";

import RoundedButton from "components/Button/Button";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";

import { usePatchCGTChargeList } from "services/CGTCharge/CGTChargeServices";

const columns = [
  {
    label: "S.No",
    width: "7%",
  },
  {
    label: "Name",
    width: "20%",
  },
  {
    label: "Minimum Range",
    width: "20%",
  },
  {
    label: "Maximum Range",
    width: "20%",
  },
  {
    label: "CGT Rate",
    width: "10%",
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

export default function CGTChageEntry() {
  const theme = useTheme();
  const [rows, setRows] = useState([
    {
      sn: 1,
      name: "",
      min_range: 0,
      max_range: 0,
      cgt_rate: 0,
    },
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  //   const [ledgerHeadOptions, setLedgerHeadOptions] = useState([]);

  const {
    data: journalEntriesData,
    mutate: journalEntryMutate,
    isSuccess: journalEntrySuccess,
    isError: journalEntryError,
  } = usePatchCGTChargeList();

  useEffect(() => {
    if (journalEntriesData?.isSuccess) {
      setSnackbarOpen(true);
      setRows([
        {
          sn: 1,
          name: "",
          min_range: 0,
          max_range: 0,
          cgt_rate: 0,
        },
      ]);
    }
  }, [journalEntrySuccess, journalEntriesData]);

  const handleRowChange = (index: number, field: string, value: any) => {
    const updatedRows = rows.map((row, i) => {
      if (i === index) {
        const updatedRow =
          typeof value === "object" && "id" in value
            ? { ...row, [field]: value.label }
            : { ...row, [field]: value };
        // console.log(`Row ${i} updated:`, updatedRow);
        return updatedRow;
      }
      return row;
    });

    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const newRows = Array.from({ length: 3 }, (_, i) => ({
      sn: rows.length + i + 1,
      name: "",
      min_range: 0,
      max_range: 0,
      cgt_rate: 0,
    }));
    setRows([...rows, ...newRows]);
  };

  const handleClear = () => {
    setRows([
      {
        sn: 1,
        name: "",
        min_range: 0,
        max_range: 0,
        cgt_rate: 0,
      },
    ]);
  };

  const handleDeleteClick = (index: number) => {
    if (rows.length === 1) return;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows.map((row, idx) => ({ ...row, sn: idx + 1 })));
  };

  const handleAddEntry = () => {
    // const finalData = rows.map((item) => {
    //   const { name, min_range, max_range, cgt_rate } = item;
    //   return {
    //     name: name,
    //     min_range: Number(min_range),
    //     max_range: Number(max_range),
    //     cgt_rate: Number(cgt_rate),
    // };
    // });
    const finalData = {
      name: rows[0].name,
      min_range: Number(rows[0].min_range),
      max_range: Number(rows[0].max_range),
      cgt_rate: Number(rows[0].cgt_rate),
    };

    journalEntryMutate(finalData, {
      onSuccess: () => {
        setSnackbarOpen(true);
        setRows([
          {
            sn: 1,
            name: "",
            min_range: 0,
            max_range: 0,
            cgt_rate: 0,
          },
        ]);
      },
      onError: () => {
        setSnackbarErrorOpen(true);
      },
    });
  };

  return (
    <Box>
      {snackbarOpen && (
        <SuccessBar
          snackbarOpen={snackbarOpen}
          message="Entry Updated Successfully"
          setSnackbarOpen={setSnackbarOpen}
        />
      )}

      {journalEntryError && (
        <ErrorBar
          snackbarOpen={snackbarErrorOpen}
          message={"Error in submitting data!"}
          setSnackbarOpen={setSnackbarErrorOpen}
        />
      )}

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, my: 2 }}></Box>
      <Box sx={{ my: 2 }}>
        <HeaderDesc title="Set CGT Charge" />
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
                        <TextField
                          size="small"
                          value={row[field]}
                          onChange={(event: any) =>
                            handleRowChange(rowIndex, field, event.target.value)
                          }
                          sx={{
                            width: "100%",
                            p: 0,
                            borderRadius: 0,
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
              <DefTableCell sx={{ textAlign: "center" }}>
                {/* <IconButton onClick={handleDeleteClick(rowIndex)}> */}
                <IconButton onClick={() => handleDeleteClick(rowIndex)}>
                  <DeleteOutlined />
                </IconButton>
              </DefTableCell>
            </TableRow>
          ))}
          <TableRow>
            <DefTableCell sx={{ p: 1, textAlign: "center" }}>
              <IconButton
                onClick={() => {
                  setRows([
                    ...rows,
                    {
                      sn: rows.length + 1,
                      name: "",
                      min_range: 0,
                      max_range: 0,
                      cgt_rate: 0,
                      //   commissionRate: 0,
                    },
                  ]);
                }}
                sx={{
                  bgcolor: theme.palette.primary[1100],
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

      <RoundedButton title1="Add Entry" onClick1={handleAddEntry} />
    </Box>
  );
}
