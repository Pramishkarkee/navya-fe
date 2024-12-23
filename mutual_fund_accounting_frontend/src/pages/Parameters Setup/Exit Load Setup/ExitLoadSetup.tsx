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
  Autocomplete,
} from "@mui/material";
import { TableCellProps } from "@mui/material/TableCell";
import { useTheme, styled } from "@mui/material/styles";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Add from "@mui/icons-material/Add";

import RoundedButton from "components/Button/Button";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import { ExitLoadTableHeader } from "constants/Exit Load Setup/ExitLoadTableHeader";
// import CloudRoundedIcon from "@mui/icons-material/CloudRounded";

import {
  usePatchExitLoad,
  //  useGetExitLoadList
} from "services/ExitLoadSetup/ExitLoadSetup";
import ReceiptTable from "components/Table/TanstackTable";
import { Empty } from "antd";

const columns = [
  { label: "S.No", width: "7%" },
  { label: "Exit Load For", width: "25%" },
  { label: "Exit Load", width: "20%" },
  { label: "Range From (Holding Days)", width: "20%" },
  { label: "Range To (Holding Days)", width: "20%" },
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

export default function CommissionEntry() {
  const theme = useTheme();
  const [rows, setRows] = useState([
    {
      sn: 1,
      exit_load_for: "",
      exitLoad: 0,
      rangeFrom: 0,
      rangeTo: 0,
    },
  ]);

  // const [pagination, setPagination] = useState({
  //   pageIndex: 0,
  //   pageSize: 10,
  // });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [ledgerHeadOptions, setLedgerHeadOptions] = useState([]);

  // const { data: getExitLoadList } = useGetExitLoadList(pagination.pageIndex+1);

  const Fakedata = [];

  const {
    data: exitLoadData,
    mutate: exitLoadMutate,
    isSuccess: exitLoadSuccess,
    isError: exitLoadError,
  } = usePatchExitLoad();

  useEffect(() => {
    const exitLoadOptions = [
      {
        label: "Resident Natural Person",
        id: 1,
        value: "resident_natural_person",
      },
      { label: "Resident Institution", id: 2, value: "resident_institution" },
    ];

    if (exitLoadOptions) {
      setLedgerHeadOptions(exitLoadOptions);
    }
  }, []);

  useEffect(() => {
    if (exitLoadData?.isSuccess) {
      setSnackbarOpen(true);
      setRows([
        {
          sn: 1,
          exit_load_for: "",
          exitLoad: 0,
          rangeFrom: 0,
          rangeTo: 0,
        },
      ]);
    }
  }, [exitLoadSuccess, exitLoadData]);

  const handleRowChange = (index: number, field: string, value: any) => {
    const updatedRows = rows.map((row, i) => {
      if (i === index) {
        const updatedRow =
          typeof value === "object" && "id" in value
            ? { ...row, [field]: value.label }
            : { ...row, [field]: value };
        return updatedRow;
      }
      return row;
    });

    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const newRows = Array.from({ length: 2 }, (_, i) => ({
      sn: rows.length + i + 1,
      exit_load_for: "",
      exitLoad: 0,
      rangeFrom: 0,
      rangeTo: 0,
    }));
    setRows([...rows, ...newRows]);
  };

  const handleClear = () => {
    setRows([
      {
        sn: 1,
        exit_load_for: "",
        exitLoad: 0,
        rangeFrom: 0,
        rangeTo: 0,
      },
    ]);
  };

  const handleDeleteClick = (index: number) => {
    if (rows.length === 1) return;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows.map((row, idx) => ({ ...row, sn: idx + 1 })));
  };

  // useEffect(() => {
  // }, [rows]);

  const handleAddEntry = () => {
    const payload = rows.map((row) => {
      const { exit_load_for, exitLoad, rangeFrom, rangeTo } = row;
      const ExitLoadFor = ledgerHeadOptions.find((data) => {
        if (data.label === exit_load_for) {
          return data;
        }
      });
      return {
        exit_load_for: exit_load_for && ExitLoadFor.value,
        exit_load: exitLoad,
        range_form: rangeFrom,
        range_to: rangeTo,
      };
    });

    exitLoadMutate(payload, {
      onSuccess: () => setSnackbarOpen(true),
      onError: () => setSnackbarErrorOpen(true),
    });
  };

  return (
    <>
      <Box>
        {snackbarOpen && (
          <SuccessBar
            snackbarOpen={snackbarOpen}
            message="Commission Rate updated successfully"
            setSnackbarOpen={setSnackbarOpen}
          />
        )}

        {exitLoadError && (
          <ErrorBar
            snackbarOpen={snackbarErrorOpen}
            message="Error in submitting data!"
            setSnackbarOpen={setSnackbarErrorOpen}
          />
        )}

        <Box
          sx={{ display: "flex", flexDirection: "row", gap: 2, my: 2 }}
        ></Box>
        <Box sx={{ my: 2 }}>
          <HeaderDesc title="Set Exit Load" />
        </Box>
        <Table sx={{ maxWidth: "1500px", width: { xs: "110%", lg: "165%" } }}>
          <TableHead>
            <TableRow>
              {columns.map((item, index) => (
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
              <DefTableCell sx={{ p: 1 }}></DefTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.keys(row).map(
                  (field, cellIndex) =>
                    field !== "ledgerHead_id" && (
                      <DefTableCell key={cellIndex}>
                        {cellIndex === 1 ? (
                          <Autocomplete
                            size="small"
                            value={row[field]}
                            onChange={(event, newValue) =>
                              handleRowChange(rowIndex, field, newValue)
                            }
                            options={ledgerHeadOptions}
                            renderInput={(params) => (
                              <TextField
                                {...params}
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
                              readOnly: cellIndex === 0,
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
                        exit_load_for: "",
                        exitLoad: 0,
                        rangeFrom: 0,
                        rangeTo: 0,
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

        <Box sx={{ display: "flex", gap: 1, my: 2 }}>
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
            sx={{ borderRadius: "100px" }}
          >
            Clear Lines
          </Button>
        </Box>

        <RoundedButton title1="Add Entry" onClick1={handleAddEntry} />
      </Box>

      <Box mt={3}>
        <Box sx={{ my: 1 }}>
          <HeaderDesc title="Exit Load List" />
        </Box>
        {Fakedata.length > 0 ? (
          <Box sx={{ maxWidth: "1500px", width: { md: "110%", lg: "128%" } }}>
            <ReceiptTable
              columns={ExitLoadTableHeader}
              // data={getExitLoadList?.responseData ?? []}
              data={Fakedata ?? []}
            />
          </Box>
        ) : (
          <Box sx={{ maxWidth: "1500px", width: { md: "110%", lg: "128%" } }}>
            <ReceiptTable columns={ExitLoadTableHeader} data={Fakedata ?? []} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                ml: { md: 5, lg: 20 },
                mt: 5,
              }}
            >
              <Empty
                imageStyle={{ height: 150, width: 150 }}
                description="No Data Available"
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
