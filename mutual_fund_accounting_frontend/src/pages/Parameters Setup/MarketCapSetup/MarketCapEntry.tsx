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

import { usePatchMarketCap } from "services/MarketCap/MarketCapService";
import axios from "axios";

const columns = [
  {
    label: "S.No",
    width: "7%",
  },
  {
    label: "Market Cap Name",
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

export default function MarketCapEntry() {
  const theme = useTheme();
  const [rows, setRows] = useState([
    {
      sn: 1,
      marketCap: "",
      rangeFrom: 0,
      rangeTo: 0,
    },
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  //   const [ledgerHeadOptions, setLedgerHeadOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    data: journalEntriesData,
    mutate: journalEntryMutate,
    isSuccess: journalEntrySuccess,
    isError: journalEntryError,
  } = usePatchMarketCap();

  useEffect(() => {
    if (journalEntriesData?.isSuccess) {
      setSnackbarOpen(true);
      setRows([
        {
          sn: 1,
          marketCap: "",
          rangeFrom: 0,
          rangeTo: 0,
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
        return updatedRow;
      }
      return row;
    });

    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const newRows = Array.from({ length: 3 }, (_, i) => ({
      sn: rows.length + i + 1,
      marketCap: "",
      rangeFrom: 0,
      rangeTo: 0,
    }));
    setRows([...rows, ...newRows]);
  };

  const handleClear = () => {
    setRows([
      {
        sn: 1,
        marketCap: "",
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

  const handleAddEntry = () => {
    const finalData = rows.map((item) => {
      const { marketCap, rangeFrom, rangeTo } = item;
      return {
        market_cap: marketCap,
        range_from: rangeFrom,
        range_to: rangeTo,
      };
    });

    journalEntryMutate(finalData, {
      onSuccess: () => {
        setSnackbarOpen(true);
      },
      onError: (error) => {
        setSnackbarErrorOpen(true);

        // if(axios.isAxiosError(error)) {
        //   setErrorMessage(
        //     error.response?.data?.responseData.error
        //     ? error.response?.data?.responseData.error :
        //     'Error in submitting dataaaaaaaaa!'

        //   );
        // }

        if (axios.isAxiosError(error)) {
          const errorData = error.response?.data?.responseData.error || "";
          const errorMatch = errorData.match(/(?<=string=').*?(?=', code=)/);
          const extractedErrorMessage = errorMatch
            ? errorMatch[0]
            : "Error in submitting data!";
          setErrorMessage(extractedErrorMessage);
        } else {
          setErrorMessage("Error in submitting!");
        }
      },
    });
  };

  return (
    <Box>
      {snackbarOpen && (
        <SuccessBar
          snackbarOpen={snackbarOpen}
          message="Market Cap Created Successfully"
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
        <HeaderDesc title="Set Market Cap" />
      </Box>
      <Table sx={{ width: { xs: "110%", lg: "140%" } }}>
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
                        // <Autocomplete
                        //   size="small"
                        //   value={row[field]}
                        //   onChange={(event: any, newValue: string | null) =>
                        //     handleRowChange(rowIndex, field, newValue)
                        //   }
                        //   options={ledgerHeadOptions}
                        //   renderInput={(params) => (
                        //     <TextField
                        //       {...params}
                        //       sx={{
                        //         p: 0,
                        //         borderRadius: 0,
                        //         "& .MuiOutlinedInput-input": {
                        //           color: theme.palette.secondary[700],
                        //         },
                        //         "& .MuiOutlinedInput-root": {
                        //           "&:hover fieldset": {
                        //             borderColor: "#B2BAC2",
                        //           },
                        //           "&.Mui-focused fieldset": {
                        //             borderColor: theme.palette.secondary.main,
                        //           },
                        //         },
                        //         "& MuiOutlinedInput-input:Mui-focused": {
                        //           borderColor: theme.palette.secondary[700],
                        //         },
                        //         "& .MuiOutlinedInput-notchedOutline": {
                        //           border: "1px solid transparent",
                        //           borderRadius: 0,
                        //         },
                        //       }}
                        //     />
                        //   )}
                        // />
                        <TextField
                          size="small"
                          value={row[field]}
                          onChange={(event: any) =>
                            handleRowChange(rowIndex, field, event.target.value)
                          }
                          fullWidth
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
              <DefTableCell sx={{ textAlign: "center", width: "10%" }}>
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
                      marketCap: "",
                      rangeFrom: 0,
                      rangeTo: 0,
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
            {/* <DefTableCell></DefTableCell> */}
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
// //   Autocomplete,
// } from "@mui/material";
// import { TableCellProps } from "@mui/material/TableCell";
// import { useTheme, styled } from "@mui/material/styles";

// import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
// import Add from "@mui/icons-material/Add";

// import RoundedButton from "components/Button/Button";
// import HeaderDesc from "components/HeaderDesc/HeaderDesc";
// import SuccessBar from "components/Snackbar/SuccessBar";
// import ErrorBar from "components/Snackbar/ErrorBar";

// import { usePatchMarketCap } from "services/MarketCap/MarketCapService";

// const columns = [
//   {
//     label: "S.No",
//     width: "7%",
//   },
//   {
//     label: "Market Cap Name",
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

// export default function MarketCapEntry() {
//   const theme = useTheme();
//   let totalDebit = 0;
//   let totalCredit = 0;
//   const [rows, setRows] = useState([
//     {
//       sn: 1,
//       marketCap: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//     //   commissionRate: 0,
//     },
//     {
//       sn: 2,
//       marketCap: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//     //   commissionRate: 0,
//     },
//   ]);

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
// //   const [ledgerHeadOptions, setLedgerHeadOptions] = useState([]);

//   const {
//     data: journalEntriesData,
//     mutate: journalEntryMutate,
//     isSuccess: journalEntrySuccess,
//     isError: journalEntryError,
//   } = usePatchMarketCap();

// //   useEffect(() => {
// //     const shareTypeOptions = [
// //       { label: "share", id: 1 },
// //       { label: "debenture", id: 2 },
// //       { label: "mutual_fund", id: 3 },
// //       { label: "exchange", id: 4 },
// //       { label: "bond", id: 5 },
// //       { label: "derivatives", id: 6 },
// //     ];

// //     if (shareTypeOptions) {
// //       shareTypeOptions.map((item) => {
// //         const ledgerHeadObj = { label: item.label, id: item.id };
// //         setLedgerHeadOptions((prev) => [...prev, ledgerHeadObj]);
// //       });
// //     }
// //   }, []);

//   useEffect(() => {
//     if (journalEntriesData?.isSuccess) {
//       setSnackbarOpen(true);
//       setRows([
//         {
//           sn: 1,
//           marketCap: "",
//           rangeFrom: 0,
//           rangeTo: 0,
//         //   commissionRate: 0,
//         },
//         {
//           sn: 2,
//           marketCap: "",
//           rangeFrom: 0,
//           rangeTo: 0,
//         //   commissionRate: 0,
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
//       marketCap: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//     //   commissionRate: 0,
//     };
//     const secondRow = {
//       sn: rows.length + 2,
//       marketCap: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//     //   commissionRate: 0,
//     };
//     const thirdRow = {
//       sn: rows.length + 3,
//       marketCap: "",
//       rangeFrom: 0,
//       rangeTo: 0,
//     //   commissionRate: 0,
//     };
//     setRows([...rows, firstRow, secondRow, thirdRow]);
//   };

//   const handleClear = () => {
//     setRows([
//       {
//         sn: 1,
//         marketCap: "",
//         rangeFrom: 0,
//         rangeTo: 0,
//         // commissionRate: 0,
//       },
//       {
//         sn: 2,
//         marketCap: "",
//         rangeFrom: 0,
//         rangeTo: 0,
//         // commissionRate: 0,
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

//   const handleAddEntry = () => {
//     const finalData = {
//         market_cap: rows[0].marketCap,
//       range_from: totalDebit,
//       range_to: totalCredit,
//     //   max_range: Number(rows[0].commissionRate),
//     //   commission_rate: totalDebit,
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
//                         // <Autocomplete
//                         //   size="small"
//                         //   value={row[field]}
//                         //   onChange={(event: any, newValue: string | null) =>
//                         //     handleRowChange(rowIndex, field, newValue)
//                         //   }
//                         //   options={ledgerHeadOptions}
//                         //   renderInput={(params) => (
//                         //     <TextField
//                         //       {...params}
//                         //       sx={{
//                         //         p: 0,
//                         //         borderRadius: 0,
//                         //         "& .MuiOutlinedInput-input": {
//                         //           color: theme.palette.secondary[700],
//                         //         },
//                         //         "& .MuiOutlinedInput-root": {
//                         //           "&:hover fieldset": {
//                         //             borderColor: "#B2BAC2",
//                         //           },
//                         //           "&.Mui-focused fieldset": {
//                         //             borderColor: theme.palette.secondary.main,
//                         //           },
//                         //         },
//                         //         "& MuiOutlinedInput-input:Mui-focused": {
//                         //           borderColor: theme.palette.secondary[700],
//                         //         },
//                         //         "& .MuiOutlinedInput-notchedOutline": {
//                         //           border: "1px solid transparent",
//                         //           borderRadius: 0,
//                         //         },
//                         //       }}
//                         //     />
//                         //   )}
//                         // />
//                         <TextField
//                         size="small"
//                         value={row[field]}
//                         onChange={(event: any) => handleRowChange(rowIndex, field, event.target.value)}
//                         sx={{
//                             p: 0,
//                             borderRadius: 0,
//                             "& .MuiOutlinedInput-input": {
//                             color: theme.palette.secondary[700],
//                             },
//                             "& .MuiOutlinedInput-root": {
//                             "&:hover fieldset": {
//                                 borderColor: "#B2BAC2",
//                             },
//                             "&.Mui-focused fieldset": {
//                                 borderColor: theme.palette.secondary.main,
//                             },
//                             },
//                             "& MuiOutlinedInput-input:Mui-focused": {
//                             borderColor: theme.palette.secondary[700],
//                             },
//                             "& .MuiOutlinedInput-notchedOutline": {
//                             border: "1px solid transparent",
//                             borderRadius: 0,
//                             },
//                         }}
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
//                       marketCap: "",
//                       rangeFrom: 0,
//                       rangeTo: 0,
//                     //   commissionRate: 0,
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

// import { Autocomplete, Box, Button, IconButton, Table, TableBody, TableCell, TableCellProps, TableHead, TableRow, TextField, Typography, styled, useTheme } from "@mui/material";

// //mui icons
// import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
// import Add from '@mui/icons-material/Add'
// import { useState } from "react";
// import { ledgerHeadOptions } from "constants/Ledger Head Data/LedgerHeadData";
// import RoundedButton from "components/Button/Button";

// const columns = [
//     {
//         label: "S.No",
//         width: '10%'
//     },
//     {
//         label: "Market Cap Name",
//         width: '40%'
//     },

//     {
//         label: "Range From",
//         width: '25%'
//     },
//     {
//         label: "Range To",
//         width: '25%'

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
// export default function MarketCapSetup() {
//     const theme = useTheme();
//     let TotalRangeFrom = 0
//     let TotalRangeTo = 0

//     const handleSearch = () => {
//     };

//     const [rows, setRows] = useState([
//         {
//             sn: 1,
//             marketCapName: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             // ledgerHead_id: null
//         },
//         {
//             sn: 2,
//             marketCapName: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             // ledgerHead_id: null

//         }
//     ]);

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
//             marketCapName: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             // ledgerHead_id: null

//         }
//         const secondRow = {
//             sn: rows.length + 2,
//             marketCapName: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             // ledgerHead_id: null

//         }
//         const thirdRow = {
//             sn: rows.length + 3,
//             marketCapName: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             // ledgerHead_id: null

//         }
//         setRows([...rows, firstRow, secondRow, thirdRow]);
//     };
//     const handleClear = () => {
//         setRows([{
//             sn: 1,
//             marketCapName: '',
//             rangeFrom: 0,
//             rangeTo: 0,
//             // ledgerHead_id: null

//         },
//         {
//             sn: 2,
//             marketCapName: '',
//             rangeFrom: 0,
//             rangeTo: 0,
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

//     TotalRangeFrom = rows.reduce((total, item) => {
//         const debit = Number(item.rangeFrom);
//         if (!isNaN(debit)) {
//             total += debit;
//         }
//         return total;
//     }, 0);
//     TotalRangeTo = rows.reduce((total, item) => {
//         const debit = Number(item.rangeTo);
//         if (!isNaN(debit)) {
//             total += debit;
//         }
//         return total;
//     }, 0);

//     return (
//         <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 1 }}>
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
//                         Set Market Cap{" "}
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
//                                             <Autocomplete
//                                                 size="small"
//                                                 value={row[item.label.toLowerCase()]}
//                                                 onChange={(event: any, newValue: string | null) => handleRowChange(rowIndex, item.label.toLowerCase(), newValue)}
//                                                 options={ledgerHeadOptions}
//                                                 renderInput={(params) =>
//                                                     <TextField {...params}
//                                                         sx={{
//                                                             p: 0,
//                                                             borderRadius: 0,
//                                                             '& .MuiOutlinedInput-input': {
//                                                                 color: theme.palette.secondary[700]
//                                                             },
//                                                             '& .MuiOutlinedInput-root': {
//                                                                 '&:hover fieldset': {
//                                                                     borderColor: '#B2BAC2',
//                                                                 },
//                                                                 '&.Mui-focused fieldset': {
//                                                                     borderColor: theme.palette.secondary.main,
//                                                                 },
//                                                             },
//                                                             '& MuiOutlinedInput-input:Mui-focused': {
//                                                                 borderColor: theme.palette.secondary[700]
//                                                             },
//                                                             '& .MuiOutlinedInput-notchedOutline': {
//                                                                 border: '1px solid transparent',
//                                                                 borderRadius: 0
//                                                             }
//                                                         }} />
//                                                 }
//                                             /> :
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
//                 title1='Set Market Cap'

//             />
//         </Box>
//     );
// }
