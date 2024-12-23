import React, { useEffect, useState } from "react";
import {
  Box,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  Table,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Button,
  styled,
  useTheme,
  Autocomplete,
} from "@mui/material";
import RoundedButton from "components/Button/Button";
import {
  useGetSEBONCharges,
  useCreateSEBONCharge,
} from "services/SEBONCharge/SEBONChargeServices";
import SuccessBar from "components/Snackbar/SuccessBar";
import ErrorBar from "components/Snackbar/ErrorBar";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";

import Add from "@mui/icons-material/Add";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import ReceiptTable from "components/Table/TanstackTable";
import { SebonChargeTableColumns } from "constants/SEBON Charge TableHeader/SebonChargeTableHeader";
import axios from "axios";

const columns = [
  { label: "S.No", width: "7%" },
  { label: "Security Type", width: "40%" },
  { label: "SEBON Charge (In %)", width: "40%" },
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

export default function SEBONCharge() {
  const theme = useTheme();

  const [rows, setRows] = useState([
    {
      sn: 1,
      shareType: "",
      sebonCharge: 0,
    },
  ]);

  const [SEBONCharge, setSEBONCharge] = useState(null);
  const [SEBON_ID, setSEBON_ID] = useState(null);
  const [successbarOpen, setSuccessbarOpen] = useState(false);
  const [errorbarOpen, setErrorbarOpen] = useState(false);
  const [securityTypesOptions, setSecurityTypesOptions] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  const { data: getSEBONCharges, isSuccess } = useGetSEBONCharges();

  const { mutate: createSEBONChargeMutation } = useCreateSEBONCharge();

  useEffect(() => {
    if (isSuccess && getSEBONCharges?.responseData) {
      setSEBON_ID(getSEBONCharges.responseData.id);
      setSEBONCharge(getSEBONCharges.responseData.per_charge);
    }
  }, [isSuccess, getSEBONCharges]);

  useEffect(() => {
    const shareTypeOptions = [
      { label: "Equity Shares", id: 1, value: "equity_shares" },
      { label: "Corporate Debentures", id: 2, value: "corporate_debentures" },
      { label: "Government Bonds", id: 3, value: "government_bonds" },
      { label: "Mutual Funds", id: 4, value: "mutual_funds" },
      { label: "Preference Shares", id: 5, value: "preference_shares" },
    ];

    if (shareTypeOptions) {
      setSecurityTypesOptions(shareTypeOptions);
    }
  }, []);

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
      shareType: "",
      sebonCharge: 0,
    }));
    setRows([...rows, ...newRows]);
  };

  const handleClear = () => {
    setRows([
      {
        sn: 1,
        shareType: "",
        sebonCharge: 0,
      },
    ]);
  };

  const handleDeleteClick = (index: number) => {
    if (rows.length === 1) return;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows.map((row, idx) => ({ ...row, sn: idx + 1 })));
  };

  const handleAddSebonCharge = async () => {
    // if (SEBONCharge && Number(SEBONCharge) >= 0) {
    //   if (SEBON_ID) {
    //     SEBONChargeMutation(
    //       { per_charge: Number(SEBONCharge) },
    //       {
    //         onSuccess: () => {
    //           setSuccessbarOpen(true);
    //         },
    //         onError: () => {
    //           setErrorbarOpen(true);
    //         },
    //       }
    //     );
    //   } else {
    try {
      const payload = rows.map((row) => {
        const { shareType, sebonCharge } = row;
        const ShareType = securityTypesOptions.find((data) => {
          if (data.label === shareType) {
            return data;
          }
        });
        return {
          share_type: ShareType && ShareType?.value,
          per_charge: Number(sebonCharge),
        };
      });
      await createSEBONChargeMutation(payload, {
        onSuccess: (data) => {
          // setRows([])
          setRows([
            {
              sn: 1,
              shareType: "",
              sebonCharge: 0,
            },
          ]);
          setSEBON_ID(data?.id);
          setSuccessbarOpen(true);
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response) {
            setErrorbarOpen(true);
            setErrorMessage(
              error.response.data[0].share_type
                ? error.response.data[0].share_type[0]
                : error.response.data[0].per_charge
                ? error.response.data[0].per_charge[0]
                : "Error in Submitting Data"
            );
          } else {
            setErrorMessage("Unknown error occurred.");
          }
        },
      });
    } catch (e) {
      setErrorbarOpen(true);
    }
  };

  return (
    <>
      <SuccessBar
        setSnackbarOpen={setSuccessbarOpen}
        message="SEBON Charge Created Successfully!"
        snackbarOpen={successbarOpen}
      />
      <ErrorBar
        setSnackbarOpen={setErrorbarOpen}
        message={errorMessage}
        snackbarOpen={errorbarOpen}
      />

      <Box
        sx={{
          p: "0.5rem",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ width: "50px", marginBottom: "5px" }}>
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
            Set SEBON Charge (In %)
          </Typography>
        </Box>
        {/* <Box>
          <TypographyLabel title={"SEBON Charge"} />
          <TextField
            type="number"
            required
            placeholder="0.010"
            size="small"
            value={SEBONCharge !== null ? SEBONCharge : ""}
            onChange={(e) => setSEBONCharge(e.target.value)}
          />
        </Box> */}

        <Table sx={{ width: { xs: "100%", lg: "100%" } }}>
          <TableHead>
            <TableRow>
              {columns.map((item, index) => (
                <DefTableCell
                  key={index}
                  sx={{
                    width: item.width,
                    p: 1.5,
                    textAlign: "start",
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
                  (field, cellIndex) => (
                    <DefTableCell key={cellIndex}>
                      {cellIndex === 1 ? (
                        <Autocomplete
                          size="small"
                          value={row[field]}
                          onChange={(event, newValue) =>
                            handleRowChange(rowIndex, field, newValue)
                          }
                          options={securityTypesOptions}
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
                                cellIndex === 2
                                  ? "start"
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
                  // )
                )}
                <DefTableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
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
                        shareType: "",
                        sebonCharge: 0,
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
              {/* <DefTableCell></DefTableCell> */}
            </TableRow>
          </TableBody>
        </Table>

        <Box sx={{ display: "flex", gap: 1, my: 1 }}>
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

        <Box>
          <RoundedButton title1="Set Charge" onClick1={handleAddSebonCharge} />
        </Box>
      </Box>

      <Box mt={3}>
        <Box sx={{ my: 1 }}>
          <HeaderDesc title="Sebon Charge List" />
        </Box>
        {getSEBONCharges?.responseData.length !== 0 ? (
          <Box sx={{ maxWidth: "1500px", width: { lg: "120%" } }}>
            <ReceiptTable
              columns={SebonChargeTableColumns}
              data={getSEBONCharges?.responseData ?? []}
            />
          </Box>
        ) : (
          <Box
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
              color: "#212121",
              textAlign: "center",
              marginTop: "30px",
              marginLeft: "400px",
              maxWidth: "1500px",
              width: { xl: "100%", lg: "125%", md: "105%" },
            }}
          >
            <CloudRoundedIcon sx={{ color: "#E0E0E0", fontSize: "12rem" }} />
            <Typography>
              No SEBON charges available for any Security type.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
