import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableRow,
  styled,
  useTheme,
  Collapse,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Empty } from "antd";

import { useForm } from "react-hook-form";
import DateFormatter from "utils/DateFormatter";
import RoundedButton from "components/Button/Button";
import DateField from "components/DateFilter/DateField";
import { useGetIncomeExpenseStatement } from "services/Reporting/IncomeStatement/IncomeStatementServices";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import { Link } from "react-router-dom";

// const debounce = (func, delay) => {
//   let timeoutId;
//   return (...args) => {
//     if (timeoutId) clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => {
//       func(...args);
//     }, delay);
//   };
// };

const DefTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1rem",
  lineHeight: 1.5,
  padding: "8px",
  fontFamily: "inherit",
  color: theme.palette.secondary[700],

  "&.MuiTableCell-root:last-child": {
    borderRight: "none",
    borderBottom: "none",
  },
}));

export default function IncomeStatement() {
  const { handleSubmit, control } = useForm({});
  const theme = useTheme();
  const [expandedMainCategories, setExpandedMainCategories] = useState({
    income: true,
    expenses: true,
  });
  const [expandedRows, setExpandedRows] = useState({});

  const { data: incomeExpenseData } = useGetIncomeExpenseStatement();

  const IncomeExpenseData =
    incomeExpenseData && incomeExpenseData?.responseData;

  const incomeData = IncomeExpenseData?.[0]?.income || [];
  const expensesData = IncomeExpenseData?.[1]?.expenses || [];

  const handleRowClick = (index) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [index]: !prevExpandedRows[index],
    }));
  };

  const [loadClicked, setLoadClicked] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");

  const handleLoad = (data) => {
    if (data?.startDate && data?.endDate) {
      const fromDate = new Date(data?.startDate);
      const toDate = new Date(data?.endDate);

      const formattedFromDate = DateFormatter.format(fromDate.toISOString());
      const formattedToDate = DateFormatter.format(toDate.toISOString());

      if (formattedFromDate && formattedToDate) {
        setSearchData({
          from_date: formattedFromDate,
          to_date: formattedToDate,
        });
      }
      setLoadClicked(true);
    } else {
      setErrorMsgs("Both start and end dates must be selected.");
      setSnackbarErrorOpen(true);
    }
  };

  const handleMainCategoryClick = (category) => {
    setExpandedMainCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const TotalIncome =
    incomeExpenseData && incomeExpenseData?.meta[0]?.total_income;
  const TotalExpenses =
    incomeExpenseData && incomeExpenseData?.meta[0]?.total_expenses;
  const NetIncome = incomeExpenseData && incomeExpenseData?.meta[0]?.net_income;

  // const handleDownloadExcel = () => {
  //   console.log("Implement logic to download Excel file");
  // };

  // const debouncedSetId = useCallback(
  //   debounce((value) => {
  //     setId(value);
  //     //   setValue("id", value);
  //   }, 500),
  //   [setValue]
  // );

  return (
    <Box>
      <HeaderDesc title="Report Filters" />
      <Box
        component="form"
        sx={{
          width: "100%",
          display: "flex",
          gap: 2,
          marginTop: 2,
          alignItems: "center",
        }}
      >
        <DateField
          control={control}
          dateLabel1="Date (From)"
          dateLabel2="Date (To)"
        />
        <Box mt={1.5}>
          <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
        </Box>
      </Box>

      <Box sx={{ margin: 0, padding: 0, mt: 2 }}>
        <HeaderDesc title="Income Statement" />
        <Box
          sx={{
            width: {
              xs: "95%",
              sm: "100%",
              md: "110%",
            },
            overflowX: "auto",
          }}
        >
          {/* <Box sx={{ display: "flex", flexDirection: "row-reverse", mb: 2 }}>
            <DownloadButton sx={{ justifyContent: "flex-end" }} onClick={handleDownloadExcel} />
          </Box> */}

          {IncomeExpenseData?.length > 0 ? (
            <Table>
              <TableBody>
                {["Income", "Expenses"].map((category) => (
                  <React.Fragment key={category}>
                    <TableRow>
                      <DefTableCell
                        sx={{
                          textAlign: "left",
                          borderBottom: "none",
                          color: theme.palette.secondary[1000],
                          width: "95%",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {category}
                        <IconButton
                          size="medium"
                          onClick={() =>
                            handleMainCategoryClick(category.toLowerCase())
                          }
                        >
                          {expandedMainCategories[category.toLowerCase()] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </DefTableCell>
                      <DefTableCell
                        sx={{
                          textAlign: "right",
                          borderBottom: "none",
                          color: theme.palette.secondary[1000],
                        }}
                      >
                        {category === "Income"
                          ? Number(TotalIncome?.toFixed(2)).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : Number(TotalExpenses?.toFixed(2)).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                      </DefTableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} style={{ padding: 0 }}>
                        <Collapse
                          in={expandedMainCategories[category.toLowerCase()]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box>
                            <Table size="small" aria-label="sub-data">
                              <TableBody>
                                {(category === "Income"
                                  ? incomeData
                                  : expensesData
                                )?.map((row, rowIndex) => (
                                  <React.Fragment key={rowIndex}>
                                    <TableRow>
                                      <DefTableCell
                                        sx={{
                                          width: "15%",
                                          textAlign: "left",
                                          borderBottom: "none",
                                        }}
                                      >
                                        {row?.ledger_code}
                                      </DefTableCell>
                                      <DefTableCell
                                        sx={{
                                          borderBottom: "none",
                                          width: "60%",
                                          display: "flex",
                                          flexDirection: "row",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        {row?.ledger_head}
                                        <IconButton
                                          size="medium"
                                          onClick={() =>
                                            handleRowClick(
                                              `${category.toLowerCase()}-${rowIndex}`
                                            )
                                          }
                                        >
                                          {expandedRows[
                                            `${category.toLowerCase()}-${rowIndex}`
                                          ] ? (
                                            <KeyboardArrowUp />
                                          ) : (
                                            <KeyboardArrowDown />
                                          )}
                                        </IconButton>
                                      </DefTableCell>
                                      <DefTableCell
                                        sx={{
                                          borderBottom: "none",
                                          textAlign: "right",
                                        }}
                                      >
                                        {row?.total_amount?.toLocaleString(
                                          undefined,
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }
                                        )}
                                      </DefTableCell>
                                    </TableRow>
                                    {row?.txn?.map((item) => (
                                      <TableRow sx={{}}>
                                        <TableCell
                                          colSpan={3}
                                          sx={{
                                            padding: 0,
                                            borderBottom: "none",
                                          }}
                                        >
                                          <Collapse
                                            in={
                                              expandedRows[
                                                `${category.toLowerCase()}-${rowIndex}`
                                              ]
                                            }
                                            timeout="auto"
                                            unmountOnExit
                                          >
                                            <Box>
                                              <Table
                                                size="small"
                                                aria-label="sub-data"
                                              >
                                                <TableBody>
                                                  <TableRow
                                                    sx={{
                                                      borderBottom: "none",
                                                    }}
                                                  >
                                                    <DefTableCell
                                                      sx={{
                                                        textAlign: "right",
                                                        borderBottom: "none",
                                                        width: "15%",
                                                        fontWeight: 400,
                                                      }}
                                                    >
                                                      {item.sub_ledger_code}
                                                    </DefTableCell>
                                                    <DefTableCell
                                                      sx={{
                                                        paddingLeft: 4,
                                                        textAlign: "left",
                                                        borderBottom: "none",
                                                        fontWeight: 400,
                                                      }}
                                                    >
                                                      <Link
                                                        to={`/sub-ledger/${item.sub_ledger_code}/transaction`}
                                                        style={{
                                                          // fontSize: 14,
                                                          fontWeight: 400,
                                                          color: "#2f84d3",
                                                          textDecoration:
                                                            "none",
                                                        }}
                                                      >
                                                        {item.sub_ledger_head}
                                                      </Link>
                                                    </DefTableCell>
                                                    <DefTableCell
                                                      sx={{
                                                        textAlign: "right",
                                                        borderBottom: "none",
                                                        fontWeight: 400,
                                                      }}
                                                    >
                                                      {item?.amount?.toLocaleString(
                                                        undefined,
                                                        {
                                                          minimumFractionDigits: 2,
                                                          maximumFractionDigits: 2,
                                                        }
                                                      )}
                                                    </DefTableCell>
                                                  </TableRow>
                                                </TableBody>
                                              </Table>
                                            </Box>
                                          </Collapse>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </React.Fragment>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                <TableRow>
                  <DefTableCell
                    sx={{
                      textAlign: "left",
                      borderBottom: "none",
                    }}
                  >
                    Net Income
                  </DefTableCell>
                  <DefTableCell
                    sx={{
                      borderBottom: "none",
                      textAlign: "right",
                    }}
                  >
                    {Number(NetIncome?.toFixed(2)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </DefTableCell>
                </TableRow>
              </TableBody>
            </Table>
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
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
