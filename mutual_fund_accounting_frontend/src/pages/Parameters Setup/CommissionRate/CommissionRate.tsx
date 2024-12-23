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

import { usePatchCommissionRate } from "services/CommissionRate/CommissionRate";
import axios from "axios";

const columns = [
  { label: "S.No", width: "7%" },
  { label: "Security Type", width: "20%" },
  { label: "Minimum Range", width: "20%" },
  { label: "Maximum Range", width: "20%" },
  { label: "Commission Rate (%)", width: "20%" },
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
      shareType: "",
      rangeFrom: 0,
      rangeTo: 0,
      commissionRate: 0,
    },
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ledgerHeadOptions, setLedgerHeadOptions] = useState([]);

  const {
    data: journalEntriesData,
    mutate: journalEntryMutate,
    isSuccess: journalEntrySuccess,
    isError: journalEntryError,
  } = usePatchCommissionRate();

  useEffect(() => {
    const shareTypeOptions = [
      // { label: "share", id: 1 ,  },
      // { label: "debenture", id: 2 },
      // { label: "mutual_fund", id: 3 },
      // { label: "exchange", id: 4 },
      // { label: "bonds", id: 5 },
      // { label: "derivatives", id: 6 },
      { label: "Equity Shares", id: 1, value: "equity_shares" },
      { label: "Corporate Debentures", id: 2, value: "corporate_debentures" },
      { label: "Government Bonds", id: 3, value: "government_bonds" },
      { label: "Mutual Funds", id: 4, value: "mutual_funds" },
      {label: "Preference Shares", id: 5, value: "preference_shares" },
    ];

    if (shareTypeOptions) {
      setLedgerHeadOptions(shareTypeOptions);
    }
  }, []);

  useEffect(() => {
    if (journalEntriesData?.isSuccess) {
      setSnackbarOpen(true);
      setRows([
        {
          sn: 1,
          shareType: "",
          rangeFrom: 0,
          rangeTo: 0,
          commissionRate: 0,
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
    const newRows = Array.from({ length: 2 }, (_, i) => ({
      sn: rows.length + i + 1,
      shareType: "",
      rangeFrom: 0,
      rangeTo: 0,
      commissionRate: 0,
    }));
    setRows([...rows, ...newRows]);
  };

  const handleClear = () => {
    setRows([
      {
        sn: 1,
        shareType: "",
        rangeFrom: 0,
        rangeTo: 0,
        commissionRate: 0,
      },
    ]);
  };

  const handleDeleteClick = (index: number) => {
    if (rows.length === 1) return;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows.map((row, idx) => ({ ...row, sn: idx + 1 })));
  };

  // useEffect(() => {
  //   console.log("Rows state:", rows);
  // }, [rows]);

  const handleAddEntry = () => {
    const payload = rows.map((row) => {
      const { shareType, rangeFrom, rangeTo, commissionRate } = row;
      // const { shareType, commissionRate } = row;
      const ShareType = ledgerHeadOptions.find((data) => {
        if (data.label === shareType) {
          return data;
        }
      });
      console.log("object", ShareType.value);
      return {
        share_types: shareType && ShareType.value,
        min_range: rangeFrom,
        max_range: rangeTo,
        commission_rate: commissionRate,
      };
    });

    // console.log("Payload before submitting:", payload);

    journalEntryMutate(payload, {
      onSuccess: () => {
        setSnackbarOpen(true);
      },

      onError: (error) => {
        console.log("Error in submitting data:", error),
        setSnackbarErrorOpen(true);
        
        if (axios.isAxiosError(error) && error.response) {
            const errorData = error.response?.data?.responseData.error || '';
            const errorMatch = errorData.match(/(?<=string=').*?(?=', code=)/);
            setErrorMessage(
                   error.response.data.responseData.error
                ? errorMatch[0]
                
                : "Error in submitting data!"
              )  
          }
      },

    });
  };

  return (
    <Box>
      {snackbarOpen && (
        <SuccessBar
          snackbarOpen={snackbarOpen}
          message="Commission Rate Updated Successfully"
          setSnackbarOpen={setSnackbarOpen}
        />
      )}

      {journalEntryError && (
        <ErrorBar
          snackbarOpen={snackbarErrorOpen}
          message={errorMessage}
          setSnackbarOpen={setSnackbarErrorOpen}
        />
      )}

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, my: 2 }}></Box>
      <Box sx={{ my: 2 }}>
        <HeaderDesc title="Set Commission Rate" />
      </Box>
      <Table sx={{ width: { xs: "110%", lg: "165%" } }}>
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
                      shareType: "",
                      rangeFrom: 0,
                      rangeTo: 0,
                      commissionRate: 0,
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
  );
}

// import React, { useEffect, useState } from "react";

// import {
//   Box,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Typography,
//   Button,
//   TextField,
//   IconButton,
//   Autocomplete,
// } from "@mui/material";
// import { TableCellProps } from "@mui/material/TableCell";
// import { useTheme, styled } from "@mui/material/styles";

// import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
// import Add from "@mui/icons-material/Add";

// import RoundedButton from "components/Button/Button";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";

// import { usePatchCommissionRate } from "services/CommissionRate/CommissionRate";

// const columns = [
//   {
//     label: "S.No",
//     width: "7%",
//   },
//   {
//     label: "Share Type",
//     width: "20%",
//   },
//   {
//     label: "Commission Rate",
//     width: "20%",
//   },
//   {
//     label: "Range From",
//     width: "20%",
//   },
//   {
//     label: "Range To",
//     width: "20%",
//   },
// ];

// const DefTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
//   height: "1rem",
//   padding: "0rem",
//   lineHeight: 1.5,
//   fontFamily: "inherit",
//   borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
//   borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,

//   "&.MuiTableCell-root:last-child": {
//     borderRight: "none",
//   },
// }));

// export default function CommissionEntry() {
//   const theme = useTheme();
//   const [rows, setRows] = useState([
//     {
//       sn: 1,
//       shareType: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//       commissionRate: 0,
//     },
//     // {
//     //   sn: 2,
//     //   shareType: "",
//     //   rangeFrom: 0,
//     //   rangeTo: 0,
//     //   commissionRate: 0,
//     // },
//   ]);

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
//   const [ledgerHeadOptions, setLedgerHeadOptions] = useState([]);

//   const {
//     data: journalEntriesData,
//     mutate: journalEntryMutate,
//     isSuccess: journalEntrySuccess,
//     isError: journalEntryError,
//   } = usePatchCommissionRate();

//   useEffect(() => {
//     const shareTypeOptions = [
//       { label: "share", id: 1 },
//       { label: "debenture", id: 2 },
//       { label: "mutual_fund", id: 3 },
//       { label: "exchange", id: 4 },
//       { label: "bonds", id: 5 },
//       { label: "derivatives", id: 6 },
//     ];

//   //   if (shareTypeOptions) {
//   //     shareTypeOptions.map((item) => {
//   //       const ledgerHeadObj = { label: item.label, id: item.id };
//   //       setLedgerHeadOptions((prev) => [...prev, ledgerHeadObj]);
//   //     });
//   //   }
//   // }, []);

//   if (shareTypeOptions) {
//     setLedgerHeadOptions(shareTypeOptions);
//   }
// }, []);

//   useEffect(() => {
//     if (journalEntriesData?.isSuccess) {
//       setSnackbarOpen(true);
//       setRows([
//         {
//           sn: 1,
//           shareType: "",
//           rangeFrom: 0,
//           rangeTo: 0,
//           commissionRate: 0,
//         },
//         // {
//         //   sn: 2,
//         //   shareType: "",
//         //   rangeFrom: 0,
//         //   rangeTo: 0,
//         //   commissionRate: 0,
//         // },
//       ]);
//     }
//   }, [journalEntrySuccess, journalEntriesData]);

//   const handleRowChange = (index: number, field: number | string, value) => {
//     const updatedRows = [...rows];
//     if (typeof value === "object" && "id" in value) {
//       updatedRows[index][field] = value.label;
//       //   updatedRows[index][`${field}_id`] = value.id;
//     } else {
//       updatedRows[index][field] = value;
//     }
//     setRows(updatedRows);
//   };

//   const handleAddRow = () => {
//     const firstRow = {
//       sn: rows.length + 1,
//       shareType: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//       commissionRate: 0,
//     };
//     const secondRow = {
//       sn: rows.length + 2,
//       shareType: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//       commissionRate: 0,
//     };
//     const thirdRow = {
//       sn: rows.length + 3,
//       shareType: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//       commissionRate: 0,
//     };
//     setRows([...rows, firstRow, secondRow, thirdRow]);
//   };

//   const handleClear = () => {
//     setRows([
//       {
//         sn: 1,
//         shareType: "",
//         rangeFrom: 0,
//         rangeTo: 0,
//         commissionRate: 0,
//       },
//       // {
//       //   sn: 2,
//       //   shareType: "",
//       //   rangeFrom: 0,
//       //   rangeTo: 0,
//       //   commissionRate: 0,
//       // },
//     ]);
//   };

//   const handleDeleteClick = (index) => {
//     if (rows.length === 1) {
//       return;
//     }
//     const updatedRows = [...rows];
//     updatedRows.splice(index, 1);
//     const updatedRowsWithSNo = updatedRows.map((row, idx) => ({ ...row, sn: idx + 1 }));
//     setRows(updatedRowsWithSNo);

//     // const updatedRows = [...rows];
//     // updatedRows.splice(index, 1);
//     // setRows(updatedRows);
//   };

//   console.log("rows", rows);

//   const handleAddEntry = () => {
//     const entries = rows.map((row) => {
//       return {
//         share_types: row.shareType,
//         min_range: row.rangeFrom,
//         max_range: row.rangeTo,
//         commission_rate: row.commissionRate,

//         // min_range: row.rangeTo,
//         // max_range: row.commissionRate,
//         // commission_rate: row.rangeFrom,
//       };
//     });

//     const payload = [
//       ...entries,
//     ];

//     journalEntryMutate(payload, {
//       onSuccess: () => {
//         setSnackbarOpen(true);
//       },
//       onError: () => {
//         setSnackbarErrorOpen(true);
//       },
//     });
//   };

//   return (
//     <Box>
//       {snackbarOpen && (
//         <SuccessBar
//           snackbarOpen={snackbarOpen}
//           message="Journal Entry updated successfully"
//           setSnackbarOpen={setSnackbarOpen}
//         />
//       )}

//       {journalEntryError && (
//         <ErrorBar
//           snackbarOpen={snackbarErrorOpen}
//           message={"Error in submitting data!"}
//           setSnackbarOpen={setSnackbarErrorOpen}
//         />
//       )}

//       <Box sx={{ display: "flex", flexDirection: "row", gap: 2, my: 3 }}></Box>
//       <Box sx={{ my: 2 }}>
//         <HeaderDesc title="Set Commission Rate" />
//       </Box>
//       <Table sx={{ width: { xs: "110%", lg: "165%" } }}>
//         <TableHead>
//           <TableRow>
//             {columns?.map((item, index) => (
//               <DefTableCell
//                 key={index}
//                 sx={{
//                   width: item.width,
//                   p: 1.5,
//                   textAlign: index === 2 || index === 3 ? "end" : "start",
//                 }}
//               >
//                 {item.label}
//               </DefTableCell>
//             ))}
//             <DefTableCell
//               sx={{
//                 p: 1,
//               }}
//             ></DefTableCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {rows.map((row, rowIndex) => (
//             <TableRow key={rowIndex}>
//               {Object.keys(row).map(
//                 (field, cellIndex) =>
//                   field !== "ledgerHead_id" && (
//                     <DefTableCell key={cellIndex} sx={{}}>
//                       {cellIndex === 1 ? (
//                         <Autocomplete
//                           size="small"
//                           value={row[field]}
//                           onChange={(event: any, newValue: string | null) =>
//                             handleRowChange(rowIndex, field, newValue)
//                           }
//                           options={ledgerHeadOptions}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               sx={{
//                                 p: 0,
//                                 borderRadius: 0,
//                                 "& .MuiOutlinedInput-input": {
//                                   color: theme.palette.secondary[700],
//                                 },
//                                 "& .MuiOutlinedInput-root": {
//                                   "&:hover fieldset": {
//                                     borderColor: "#B2BAC2",
//                                   },
//                                   "&.Mui-focused fieldset": {
//                                     borderColor: theme.palette.secondary.main,
//                                   },
//                                 },
//                                 "& MuiOutlinedInput-input:Mui-focused": {
//                                   borderColor: theme.palette.secondary[700],
//                                 },
//                                 "& .MuiOutlinedInput-notchedOutline": {
//                                   border: "1px solid transparent",
//                                   borderRadius: 0,
//                                 },
//                               }}
//                             />
//                           )}
//                         />
//                       ) : (
//                         <TextField
//                           fullWidth
//                           size="small"
//                           value={row[field] === 0 ? "" : row[field]}
//                           onChange={(e) =>
//                             handleRowChange(rowIndex, field, e.target.value)
//                           }
//                           inputProps={{
//                             readOnly: cellIndex === 0 ? true : false,
//                             style: {
//                               textAlign:
//                                 cellIndex === 2 || cellIndex === 3
//                                   ? "end"
//                                   : cellIndex === 0
//                                   ? "center"
//                                   : "start",
//                             },
//                           }}
//                           sx={{
//                             p: 0,
//                             borderRadius: 0,
//                             "& .MuiOutlinedInput-input": {
//                               color: theme.palette.secondary[700],
//                             },
//                             "& .MuiOutlinedInput-root": {
//                               "&:hover fieldset": {
//                                 borderColor: "#B2BAC2",
//                               },
//                               "&.Mui-focused fieldset": {
//                                 borderColor: theme.palette.secondary.main,
//                               },
//                             },
//                             "& .MuiOutlinedInput-notchedOutline": {
//                               border: "1px solid transparent",
//                               borderRadius: 0,
//                             },
//                           }}
//                         />
//                       )}
//                     </DefTableCell>
//                   )
//               )}
//               <DefTableCell sx={{ textAlign: "center" }}>
//                 <IconButton onClick={handleDeleteClick}>
//                   <DeleteOutlined />
//                 </IconButton>
//               </DefTableCell>
//             </TableRow>
//           ))}
//           <TableRow>
//             <DefTableCell sx={{ p: 1, textAlign: "center" }}>
//               <IconButton
//                 onClick={() => {
//                   setRows([
//                     ...rows,
//                     {
//                       sn: rows.length + 1,
//                       shareType: "",
//                       commissionRate: 0,
//                       rangeFrom: 0,
//                       rangeTo: 0,
//                     },
//                   ]);
//                 }}
//                 sx={{
//                   bgcolor: theme.palette.primary[1100],
//                   color: "#fff",
//                   p: 0,
//                   "&:hover": {
//                     bgcolor: theme.palette.secondary.main,
//                   },
//                 }}
//               >
//                 <Add sx={{ fontSize: "1.2rem" }} />
//               </IconButton>
//             </DefTableCell>
//             <DefTableCell></DefTableCell>
//             <DefTableCell></DefTableCell>
//             <DefTableCell></DefTableCell>
//             <DefTableCell></DefTableCell>
//             <DefTableCell></DefTableCell>
//           </TableRow>
//         </TableBody>
//       </Table>

//       <Box
//         sx={{
//           display: "flex",
//           gap: 1,
//           my: 2,
//         }}
//       >
//         <Button
//           variant="contained"
//           onClick={handleAddRow}
//           size="small"
//           sx={{
//             boxShadow: "none",
//             display: "flex",
//             flexDirection: "row",
//             gap: 1,
//             alignItems: "center",
//             justifyContent: "center",
//             borderRadius: "100px",
//             bgcolor: theme.palette.background.light,
//             color: theme.palette.primary[1100],
//             "&:hover": {
//               bgcolor: theme.palette.secondary[300],
//               boxShadow: "none",
//             },
//           }}
//         >
//           <Box
//             sx={{
//               bgcolor: theme.palette.primary[1100],
//               color: "#fff",
//               display: "flex",
//               borderRadius: "50%",
//             }}
//           >
//             <Add sx={{ fontSize: "1.2rem" }} />
//           </Box>
//           <Typography sx={{ fontSize: "14px" }}>Add Lines</Typography>
//         </Button>

//         <Button
//           variant="outlined"
//           onClick={handleClear}
//           size="small"
//           sx={{
//             borderRadius: "100px",
//           }}
//         >
//           Clear Lines
//         </Button>
//       </Box>

//       <RoundedButton title1="Add Entry" onClick1={handleAddEntry} />
//     </Box>
// );
// }

// import React, { useEffect, useState } from "react";

// import {
//   Box,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Typography,
//   Button,
//   TextField,
//   IconButton,
//   Autocomplete,
// } from "@mui/material";
// import { TableCellProps } from "@mui/material/TableCell";
// import { useTheme, styled } from "@mui/material/styles";

// import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
// import Add from "@mui/icons-material/Add";

// import RoundedButton from "components/Button/Button";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";

// import { usePatchCommissionRate } from "services/CommissionRate/CommissionRate";

// const columns = [
//   {
//     label: "S.No",
//     width: "7%",
//   },
//   {
//     label: "Share Type",
//     width: "20%",
//   },
//   {
//     label: "Commission Rate",
//     width: "20%",
//   },
//   {
//     label: "Range From",
//     width: "20%",
//   },
//   {
//     label: "Range To",
//     width: "20%",
//   },
// ];

// const DefTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
//   height: "1rem",
//   padding: "0rem",
//   lineHeight: 1.5,
//   fontFamily: "inherit",
//   borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
//   borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,

//   "&.MuiTableCell-root:last-child": {
//     borderRight: "none",
//   },
// }));

// export default function CommissionEntry() {
//   const theme = useTheme();
//   let totalDebit = 0;
//   let totalCredit = 0;
//   const [rows, setRows] = useState([
//     {
//       sn: 1,
//       shareType: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//       commissionRate: 0,
//     },
//     {
//       sn: 2,
//       shareType: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//       commissionRate: 0,
//     },
//   ]);

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
//   const [ledgerHeadOptions, setLedgerHeadOptions] = useState([]);

//   const {
//     data: journalEntriesData,
//     mutate: journalEntryMutate,
//     isSuccess: journalEntrySuccess,
//     isError: journalEntryError,
//   } = usePatchCommissionRate();

//   useEffect(() => {
//     const shareTypeOptions = [
//       { label: "share", id: 1 },
//       { label: "debenture", id: 2 },
//       { label: "mutual_fund", id: 3 },
//       { label: "exchange", id: 4 },
//       { label: "bonds", id: 5 },
//       { label: "derivatives", id: 6 },
//     ];

//     if (shareTypeOptions) {
//       shareTypeOptions.map((item) => {
//         const ledgerHeadObj = { label: item.label, id: item.id };
//         setLedgerHeadOptions((prev) => [...prev, ledgerHeadObj]);
//       });
//     }
//   }, []);

//   useEffect(() => {
//     if (journalEntriesData?.isSuccess) {
//       setSnackbarOpen(true);
//       setRows([
//         {
//           sn: 1,
//           shareType: "",
//           rangeFrom: 0,
//           rangeTo: 0,
//           commissionRate: 0,
//         },
//         {
//           sn: 2,
//           shareType: "",
//           rangeFrom: 0,
//           rangeTo: 0,
//           commissionRate: 0,
//         },
//       ]);
//     }
//   }, [journalEntrySuccess, journalEntriesData]);

//   const handleRowChange = (index: number, field: number | string, value) => {
//     const updatedRows = [...rows];
//     if (typeof value === "object" && "id" in value) {
//       updatedRows[index][field] = value.label;
//       //   updatedRows[index][`${field}_id`] = value.id;
//     } else {
//       updatedRows[index][field] = value;
//     }
//     setRows(updatedRows);
//   };

//   const handleAddRow = () => {
//     const firstRow = {
//       sn: rows.length + 1,
//       shareType: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//       commissionRate: 0,
//     };
//     const secondRow = {
//       sn: rows.length + 2,
//       shareType: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//       commissionRate: 0,
//     };
//     const thirdRow = {
//       sn: rows.length + 3,
//       shareType: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//       commissionRate: 0,
//     };
//     setRows([...rows, firstRow, secondRow, thirdRow]);
//   };

//   const handleClear = () => {
//     setRows([
//       {
//         sn: 1,
//         shareType: "",
//         rangeFrom: 0,
//         rangeTo: 0,
//         commissionRate: 0,
//       },
//       {
//         sn: 2,
//         shareType: "",
//         rangeFrom: 0,
//         rangeTo: 0,
//         commissionRate: 0,
//       },
//     ]);
//   };

//   const handleDeleteClick = (index) => {
//     if (rows.length === 2) {
//       return;
//     }
//     const updatedRows = [...rows];
//     updatedRows.splice(index, 1);
//     setRows(updatedRows);
//   };

//   totalDebit = rows.reduce((total, item) => {
//     const debit = Number(item.rangeFrom);
//     if (!isNaN(debit)) {
//       total += debit;
//     }
//     return total;
//   }, 0);

//   totalCredit = rows.reduce((total, item) => {
//     const debit = Number(item.rangeTo);
//     if (!isNaN(debit)) {
//       total += debit;
//     }
//     return total;
//   }, 0);

//   console.log("rows", rows);

//   const handleAddEntry = () => {
//     const finalData = {
//       share_types: rows[0].shareType,
//       min_range: totalCredit,
//       max_range: Number(rows[0].commissionRate),
//       commission_rate: totalDebit,
//     };

//     journalEntryMutate(finalData, {
//       onSuccess: () => {
//         setSnackbarOpen(true);
//       },
//       onError: () => {
//         setSnackbarErrorOpen(true);
//       },
//     });
//   };

//   return (
//     <Box>
//       {snackbarOpen && (
//         <SuccessBar
//           snackbarOpen={snackbarOpen}
//           message="Journal Entry updated successfully"
//           setSnackbarOpen={setSnackbarOpen}
//         />
//       )}

//       {journalEntryError && (
//         <ErrorBar
//           snackbarOpen={snackbarErrorOpen}
//           message={"Error in submitting data!"}
//           setSnackbarOpen={setSnackbarErrorOpen}
//         />
//       )}

//       <Box sx={{ display: "flex", flexDirection: "row", gap: 2, my: 3 }}></Box>
//       <Box sx={{ my: 2 }}>
//         <HeaderDesc title="Set Commission Rate" />
//       </Box>
//       <Table sx={{ width: { xs: "110%", lg: "165%" } }}>
//         <TableHead>
//           <TableRow>
//             {columns?.map((item, index) => (
//               <DefTableCell
//                 key={index}
//                 sx={{
//                   width: item.width,
//                   p: 1.5,
//                   textAlign: index === 2 || index === 3 ? "end" : "start",
//                 }}
//               >
//                 {item.label}
//               </DefTableCell>
//             ))}
//             <DefTableCell
//               sx={{
//                 p: 1,
//               }}
//             ></DefTableCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {rows.map((row, rowIndex) => (
//             <TableRow key={rowIndex}>
//               {Object.keys(row).map(
//                 (field, cellIndex) =>
//                   field !== "ledgerHead_id" && (
//                     <DefTableCell key={cellIndex} sx={{}}>
//                       {cellIndex === 1 ? (
//                         <Autocomplete
//                           size="small"
//                           value={row[field]}
//                           onChange={(event: any, newValue: string | null) =>
//                             handleRowChange(rowIndex, field, newValue)
//                           }
//                           options={ledgerHeadOptions}
//                           renderInput={(params) => (
//                             <TextField
//                               {...params}
//                               sx={{
//                                 p: 0,
//                                 borderRadius: 0,
//                                 "& .MuiOutlinedInput-input": {
//                                   color: theme.palette.secondary[700],
//                                 },
//                                 "& .MuiOutlinedInput-root": {
//                                   "&:hover fieldset": {
//                                     borderColor: "#B2BAC2",
//                                   },
//                                   "&.Mui-focused fieldset": {
//                                     borderColor: theme.palette.secondary.main,
//                                   },
//                                 },
//                                 "& MuiOutlinedInput-input:Mui-focused": {
//                                   borderColor: theme.palette.secondary[700],
//                                 },
//                                 "& .MuiOutlinedInput-notchedOutline": {
//                                   border: "1px solid transparent",
//                                   borderRadius: 0,
//                                 },
//                               }}
//                             />
//                           )}
//                         />
//                       ) : (
//                         <TextField
//                           fullWidth
//                           size="small"
//                           value={row[field] === 0 ? "" : row[field]}
//                           onChange={(e) =>
//                             handleRowChange(rowIndex, field, e.target.value)
//                           }
//                           inputProps={{
//                             readOnly: cellIndex === 0 ? true : false,
//                             style: {
//                               textAlign:
//                                 cellIndex === 2 || cellIndex === 3
//                                   ? "end"
//                                   : cellIndex === 0
//                                   ? "center"
//                                   : "start",
//                             },
//                           }}
//                           sx={{
//                             p: 0,
//                             borderRadius: 0,
//                             "& .MuiOutlinedInput-input": {
//                               color: theme.palette.secondary[700],
//                             },
//                             "& .MuiOutlinedInput-root": {
//                               "&:hover fieldset": {
//                                 borderColor: "#B2BAC2",
//                               },
//                               "&.Mui-focused fieldset": {
//                                 borderColor: theme.palette.secondary.main,
//                               },
//                             },
//                             "& .MuiOutlinedInput-notchedOutline": {
//                               border: "1px solid transparent",
//                               borderRadius: 0,
//                             },
//                           }}
//                         />
//                       )}
//                     </DefTableCell>
//                   )
//               )}
//               <DefTableCell sx={{ textAlign: "center" }}>
//                 <IconButton onClick={handleDeleteClick}>
//                   <DeleteOutlined />
//                 </IconButton>
//               </DefTableCell>
//             </TableRow>
//           ))}
//           <TableRow>
//             <DefTableCell sx={{ p: 1, textAlign: "center" }}>
//               <IconButton
//                 onClick={() => {
//                   setRows([
//                     ...rows,
//                     {
//                       sn: rows.length + 1,
//                       shareType: "",
//                       rangeFrom: 0,
//                       rangeTo: 0,
//                       commissionRate: 0,
//                     },
//                   ]);
//                 }}
//                 sx={{
//                   bgcolor: theme.palette.primary[1100],
//                   color: "#fff",
//                   p: 0,
//                   "&:hover": {
//                     bgcolor: theme.palette.secondary.main,
//                   },
//                 }}
//               >
//                 <Add sx={{ fontSize: "1.2rem" }} />
//               </IconButton>
//             </DefTableCell>
//             <DefTableCell></DefTableCell>
//             <DefTableCell></DefTableCell>
//             <DefTableCell></DefTableCell>
//             <DefTableCell></DefTableCell>
//             <DefTableCell></DefTableCell>
//           </TableRow>
//         </TableBody>
//       </Table>

//       <Box
//         sx={{
//           display: "flex",
//           gap: 1,
//           my: 2,
//         }}
//       >
//         <Button
//           variant="contained"
//           onClick={handleAddRow}
//           size="small"
//           sx={{
//             boxShadow: "none",
//             display: "flex",
//             flexDirection: "row",
//             gap: 1,
//             alignItems: "center",
//             justifyContent: "center",
//             borderRadius: "100px",
//             bgcolor: theme.palette.background.light,
//             color: theme.palette.primary[1100],
//             "&:hover": {
//               bgcolor: theme.palette.secondary[300],
//               boxShadow: "none",
//             },
//           }}
//         >
//           <Box
//             sx={{
//               bgcolor: theme.palette.primary[1100],
//               color: "#fff",
//               display: "flex",
//               borderRadius: "50%",
//             }}
//           >
//             <Add sx={{ fontSize: "1.2rem" }} />
//           </Box>
//           <Typography sx={{ fontSize: "14px" }}>Add Lines</Typography>
//         </Button>

//         <Button
//           variant="outlined"
//           onClick={handleClear}
//           size="small"
//           sx={{
//             borderRadius: "100px",
//           }}
//         >
//           Clear Lines
//         </Button>
//       </Box>

//       <RoundedButton title1="Add Entry" onClick1={handleAddEntry} />
//     </Box>
//   );
// }

// import { Box, Button, IconButton, MenuItem, Select, Table, TableBody, TableCell, TableCellProps, TableHead, TableRow, TextField, Typography, styled, useTheme } from "@mui/material";

// //mui icons
// import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
// import Add from '@mui/icons-material/Add'
// import { useState } from "react";
// // import { ledgerHeadOptions } from "constants/Ledger Head Data/LedgerHeadData";
// import RoundedButton from "components/Button/Button";
// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import {usePatchCommissionRate} from "services/CommissionRate/CommissionRate"
// import ErrorBar from "components/Snackbar/ErrorBar";
// import SuccessBar from "components/Snackbar/SuccessBar";

// const columns = [
//     {
//         label: "S.No",
//         width: '10%'
//     },
//     {
//         label: "Share Type",
//         width: '30%'
//     },
//     {
//         label: "Commission Rate",
//         width: '20%'
//     },

//     {
//         label: "Range From",
//         width: '20%'
//     },
//     {
//         label: "Range To",
//         width: '20%'

//     },

// ]

// const DefTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
//     height: '1rem',
//     padding: '0rem',
//     lineHeight: 1.5,
//     fontFamily: 'inherit',
//     borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
//     borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,

//     '&.MuiTableCell-root:last-child': {
//         borderRight: 'none'
//     },

// }))

// const validationSchema = yup.object().shape({
//     rows: yup.array().of(
//         yup.object().shape({
//             shareType: yup.string().optional(),
//             rangeFrom: yup.number().required(),
//             rangeTo: yup.number().required(),
//             commissionRate: yup.number().required()
//         })
//     )
// })

// export default function CommissionRate() {

//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [errorBarOpen, setErrorBarOpen] = useState(false);

//     const { control, handleSubmit, reset , formState: {errors} } = useForm({
//         resolver: yupResolver(validationSchema),
//         defaultValues: {
//             rows: [
//                 { shareType: '', rangeFrom: 0, rangeTo: 0, commissionRate: 0 },
//                 { shareType: '', rangeFrom: 0, rangeTo: 0, commissionRate: 0 },
//             ]
//         }
//     });

//     const theme = useTheme();
//     let TotalRangeFrom = 0
//     let TotalRangeTo = 0
//     let TotalcommissionRate = 0

//     // const handleSearch = () => {
//     //     console.log("search button");
//     // };

//     const [rows, setRows] = useState([
//         {
//             sn: 1,
// shareType: '',
// rangeFrom: 0,
// rangeTo: 0,
// commissionRate: 0,
//             // ledgerHead_id: null
//         },
//         {
//             sn: 2,
//             shareType: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             commissionRate: 0,
//             // ledgerHead_id: null

//         }
//     ]);

//     let min_range = null;

//     min_range = rows.reduce((total, item) => {
//         const debit = Number(item.rangeFrom);
//         if (!isNaN(debit)) {
//           total += debit;
//         }
//         return total;
//       }, 0);

//     const {mutate: CommissionRateAdded , isError: CommissionRateError } = usePatchCommissionRate();

//     const RateSubmit = (data) => {
//         console.log("Form Data:", data);
//         // const tempData = data.rows.map((item) => {
//         //     return {
//         //         share_types: item.shareType,
//         //         min_range: item.rangeFrom,
//         //         max_range: item.rangeTo,
//         //         commission_rate: item.commissionRate,
//         //     }
//         // })
//         const tempData = {
//             share_types: data.rows[0].shareType,
//             min_range: min_range,
//             max_range: data.rows[0].rangeTo,
//             commission_rate: data.rows[0].commissionRate,
//         }
//         CommissionRateAdded(tempData , {
//             onSuccess: () => {
//               setSnackbarOpen(true);
//                 reset()
//             },
//             onError: () => {
//                 setErrorBarOpen(true);
//             }
//         });
//     };

//     const handleRowChange = (index: number, field: number | string, value) => {
//         const updatedRows = [...rows];
//         if (typeof value === 'object' && 'id' in value) {
//             updatedRows[index][field] = value.label;
//             updatedRows[index][`${field}_id`] = value.id;
//         } else {
//             updatedRows[index][field] = value;
//         }
//         setRows(updatedRows);
//     };
//     const handleAddRow = () => {
//         const firstRow =
//         {
//             sn: rows.length + 1,
//             shareType: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             commissionRate: 0,
//             // ledgerHead_id: null

//         }
//         const secondRow = {
//             sn: rows.length + 2,
//             shareType: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             commissionRate: 0,
//             // ledgerHead_id: null

//         }
//         const thirdRow = {
//             sn: rows.length + 3,
//             shareType: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             commissionRate: 0,
//             // ledgerHead_id: null

//         }
//         setRows([...rows, firstRow, secondRow, thirdRow]);
//     };
//     const handleClear = () => {
//         setRows([{
//             sn: 1,
//             shareType: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             commissionRate: 0,
//             // ledgerHead_id: null

//         },
//         {
//             sn: 2,
//             shareType: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             commissionRate: 0,
//             // ledgerHead_id: null

//         },

//         ])
//     }
//     const handleDeleteClick = (index) => {
//         if (rows.length === 2) {
//             return
//         }
//         const updatedRows = [...rows];
//         updatedRows.splice(index, 1);
//         setRows(updatedRows);
//     };

//     TotalcommissionRate = rows.reduce((total, item) => {
//         const debit = Number(item.commissionRate);
//         if (!isNaN(debit)) {
//             total += debit;
//         }
//         return total;
//     }, 0);

//     TotalRangeFrom = rows.reduce((total, item) => {
//         const debit = Number(item.rangeFrom);
//         if (!isNaN(debit)) {
//             total += debit;
//         }
//         return total;
//     }, 0);
//     TotalRangeTo = rows.reduce((total, item) => {
//         const debit = Number(item.rangeTo);
//         console.log("debit:", debit);
//         if (!isNaN(debit)) {
//             total += debit;
//         }
//         return total;
//     }, 0);

//     console.log("rows", rows)

//     return (
//         <>
//          {snackbarOpen && (
//         <SuccessBar
//           snackbarOpen={snackbarOpen}
//           message={"Successfully Submitted!"}
//           setSnackbarOpen={setSnackbarOpen}
//         />
//       )}

//      {CommissionRateError && (
//         <ErrorBar
//           snackbarOpen={errorBarOpen}
//           message={"Error in submitting data!"}
//           setSnackbarOpen={setErrorBarOpen}
//         />

//       )}

//         <Box component="form" onSubmit={handleSubmit(RateSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 1 }}>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <Box sx={{ width: "50px" }}>
//                     <Typography
//                         sx={{
//                             fontSize: "16px",
//                             fontWeight: 600,
//                             lineHeight: "19px",
//                             color: "#212121",
//                             textAlign: "center",
//                             width: "max-content",
//                             borderBottom: `1px solid ${theme.palette.secondary.main}`,
//                         }}
//                     >
//                         {" "}
//                         Set Commission Rate{" "}
//                     </Typography>
//                 </Box>
//             </Box>

//             <Table sx={{ width: { xs: '110%', lg: '165%' } }}>
//                 <TableHead>
//                     <TableRow>
//                         {columns?.map((item, index) => (
//                             <DefTableCell key={index}
//                                 sx={{
//                                     width: item.width,
//                                     p: 1.5,
//                                     textAlign: index === 2 || index === 3 ? 'end' : "start"

//                                 }}>
//                                 {item.label}
//                             </DefTableCell>
//                         ))}
//                         <DefTableCell sx={{
//                             p: 1,
//                         }}>

//                         </DefTableCell>
//                     </TableRow>
//                 </TableHead>

//                 <TableBody>
//                     {rows.map((row, rowIndex) => (
//                         <TableRow key={rowIndex}>
//                             {columns?.map((item, cellIndex) => (
//                                 <DefTableCell key={cellIndex}
//                                     sx={{
//                                         width: item.width,
//                                         p: 1.5,
//                                         textAlign: cellIndex === 2 || cellIndex === 3 ? 'end' : "start"
//                                     }}>
//                                     {cellIndex === 0 ? row.sn : (
//                                         cellIndex === 1 ?
//                                             // <Autocomplete
//                                             //     size="small"
//                                             //     value={row[item.label.toLowerCase()]}
//                                             //     onChange={(event: any, newValue: string | null) => handleRowChange(rowIndex, item.label.toLowerCase(), newValue)}
//                                             //     options={ledgerHeadOptions}
//                                             //     renderInput={(params) =>
//                                             //         <TextField {...params}
//                                             //             sx={{
//                                             //                 p: 0,
//                                             //                 borderRadius: 0,
//                                             //                 '& .MuiOutlinedInput-input': {
//                                             //                     color: theme.palette.secondary[700]
//                                             //                 },
//                                             //                 '& .MuiOutlinedInput-root': {
//                                             //                     '&:hover fieldset': {
//                                             //                         borderColor: '#B2BAC2',
//                                             //                     },
//                                             //                     '&.Mui-focused fieldset': {
//                                             //                         borderColor: theme.palette.secondary.main,
//                                             //                     },
//                                             //                 },
//                                             //                 '& MuiOutlinedInput-input:Mui-focused': {
//                                             //                     borderColor: theme.palette.secondary[700]
//                                             //                 },
//                                             //                 '& .MuiOutlinedInput-notchedOutline': {
//                                             //                     border: '1px solid transparent',
//                                             //                     borderRadius: 0
//                                             //                 }
//                                             //             }} />
//                                             //     }
//                                             // />
//                                             <Controller
//                                             name={`rows.${rowIndex}.shareType`}
//                                             defaultValue="share"
//                                             control={control}
//                                             render={({ field }) => (
//                                               <Select {...field} size="small" >
//                                                 <MenuItem value="debenture">Debenture</MenuItem>
//                                                 <MenuItem value="bond">Bond</MenuItem>
//                                               </Select>
//                                             )}
//                                           />
//                                             :
//                                             <TextField
//                                                 fullWidth
//                                                 size='small'
//                                                 value={row[item.label.toLowerCase()]}
//                                                 onChange={(e) => handleRowChange(rowIndex, item.label.toLowerCase(), e.target.value)}
//                                                 inputProps={{
//                                                     readOnly: cellIndex === 0 ? true : false,
//                                                     style: { textAlign: cellIndex === 2 || cellIndex === 3 ? 'end' : cellIndex === 0 ? 'center' : "start" }
//                                                 }}
//                                                 sx={{
//                                                     p: 0,
//                                                     borderRadius: 0,
//                                                     '& .MuiOutlinedInput-input': {
//                                                         color: theme.palette.secondary[700]
//                                                     },
//                                                     '& .MuiOutlinedInput-root': {
//                                                         '&:hover fieldset': {
//                                                             borderColor: '#B2BAC2',
//                                                         },
//                                                         '&.Mui-focused fieldset': {
//                                                             borderColor: theme.palette.secondary.main,
//                                                         },
//                                                     },
//                                                     '& .MuiOutlinedInput-notchedOutline': {
//                                                         border: '1px solid transparent',
//                                                         borderRadius: 0
//                                                     }
//                                                 }}
//                                             />
//                                     )}
//                                 </DefTableCell>
//                             ))}
//                             <DefTableCell sx={{ textAlign: 'center' }} >
//                                 <IconButton onClick={() => handleDeleteClick(rowIndex)} >
//                                     <DeleteOutlined />
//                                 </IconButton>
//                             </DefTableCell>
//                         </TableRow>
//                     ))}
//                     <TableRow>
//                         <DefTableCell sx={{ p: 1, textAlign: 'center' }}>
//                             <IconButton onClick={handleAddRow}
//                                 sx={{
//                                     bgcolor: theme.palette.primary[1100], color: '#fff', p: 0, '&:hover': {
//                                         bgcolor: theme.palette.secondary.main
//                                     }
//                                 }}>
//                                 <Add sx={{ fontSize: '1.2rem', }} />
//                             </IconButton>
//                         </DefTableCell>
//                         {[...Array(columns.length - 1)].map((_, index) => (
//                             <DefTableCell key={index}></DefTableCell>
//                         ))}
//                     </TableRow>
//                     <TableRow sx={{ bgcolor: theme.palette.background.light, borderBottom: 'none' }}>
//                         <TableCell colSpan={2} sx={{
//                             p: '0.3rem', textAlign: 'center', color: theme.palette.secondary[700]
//                         }}>
//                             Total
//                         </TableCell>
//                         <TableCell sx={{
//                             p: '0.3rem', textAlign: 'center', color: theme.palette.secondary[700]
//                         }}>
//                             {TotalcommissionRate}
//                         </TableCell>
//                         <TableCell sx={{
//                             p: '0.3rem', textAlign: 'center', color: theme.palette.secondary[700]
//                         }}>
//                             {TotalRangeFrom}
//                         </TableCell>
//                         <TableCell sx={{
//                             p: '0.3rem', textAlign: 'center', color: theme.palette.secondary[700]
//                         }}>
//                             {TotalRangeTo}
//                         </TableCell>
//                         <TableCell></TableCell>
//                         <TableCell></TableCell>
//                     </TableRow>
//                 </TableBody>

//             </Table>
//             <Box sx={{
//                 display: 'flex', gap: 1, my: 2,
//             }}>
//                 <Button variant='contained' onClick={handleAddRow} size='small'
//                     sx={{
//                         boxShadow: 'none',
//                         display: 'flex',
//                         flexDirection: 'row',
//                         gap: 1,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         borderRadius: '100px',
//                         bgcolor: theme.palette.background.light,
//                         color: theme.palette.primary[1100],
//                         '&:hover': {
//                             bgcolor: theme.palette.secondary[300],
//                             boxShadow: 'none',
//                         }
//                     }}
//                 >
//                     <Box sx={{ bgcolor: theme.palette.primary[1100], color: '#fff', display: 'flex', borderRadius: '50%', }}>
//                         <Add sx={{ fontSize: '1.2rem', }} />
//                     </Box>
//                     <Typography sx={{ fontSize: '14px', }}>
//                         Add Lines
//                     </Typography>
//                 </Button>

//                 <Button variant='outlined' onClick={handleClear} size='small'
//                     sx={{
//                         borderRadius: '100px'
//                     }}
//                 >
//                     Clear Lines
//                 </Button>
//             </Box>
//             <RoundedButton
//                 title1='Set Commission Rate'
//             // onClick1={handleAddEntry}
//             />
//         </Box>
//         </>
//     );
// }
