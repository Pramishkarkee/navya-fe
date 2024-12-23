import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  Typography,
  styled,
  useTheme,
  Collapse,
  IconButton,
  TableFooter,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import { Empty } from "antd";

const staticData = [
  {
    particular: "Assets",
    totalAmount: "100,000,000",
    amountLastQuarter: "100,000,000",
    amountLastYear: "100,000,000",
    subData: [
      {
        particular: "Accounts Receivable ",
        totalAmount: "50,000,000",
        amountLastQuarter: "50,000,000",
        amountLastYear: "50,000,000",
      },
      {
        particular: "Other Current Assets",
        totalAmount: "50,000,000",
        amountLastQuarter: "50,000,000",
        amountLastYear: "50,000,000",
      },
    ],
  },
  {
    particular: "Liabilities",
    totalAmount: "100,000,000",
    amountLastQuarter: "100,000,000",
    amountLastYear: "100,000,000",
    subData: [
      {
        particular: "Accounts Payable ",
        totalAmount: "50,000,000",
        amountLastQuarter: "50,000,000",
        amountLastYear: "50,000,000",
      },
      {
        particular: "Other Current Liabilities",
        totalAmount: "50,000,000",
        amountLastQuarter: "50,000,000",
        amountLastYear: "50,000,000",
      },
    ],
  },
];

const columns = [
  { label: "Particulars", width: "40%" },
  { label: "Total Amount", width: "20%" },
  { label: "Amount Last Quarter", width: "20%" },
  { label: "Amount Last Year", width: "20%" },
];

const DefTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  fontWeight: 400,
  fontSize: "14px",
  textAlign: "left",
  padding: "8px",
  lineHeight: 1.5,
  color: theme.palette.secondary[700],
  borderBottom: `1px solid ${theme.palette.secondary.lightGrey}`,
}));

export default function BalanceSheet() {
  const { control } = useForm({});
  const theme = useTheme();
  const todayDate = dayjs().format("YYYY-MM-DD");
  const [rows, setRows] = useState(staticData);
  const [expandedRows, setExpandedRows] = useState({});

  const handleRowClick = (index) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [index]: !prevExpandedRows[index],
    }));
  };

  return (
    <Box>
      <HeaderDesc title="Report Filters" />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ margin: 0, padding: 0, mt: 2 }}>
          <TypographyLabel title={"Date"} />
          <Controller
            name="apply_date"
            control={control}
            defaultValue={todayDate}
            render={({ field }) => (
              <DatePicker
                {...field}
                sx={{
                  width: "250px",
                  "& .MuiSvgIcon-root": {
                    width: "16px",
                    height: "16px",
                  },
                }}
                slotProps={{ textField: { size: "small" } }}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) =>
                  field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)
                }
              />
            )}
          />
        </Box>
      </LocalizationProvider>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: {
            xs: "95%",
            sm: "100%",
            md: "110%",
            lg: "150%",
            xl: "160%",
          },
          mt: 2,
        }}
      >
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
          Balance Sheet <br /> (NAVYA LARGE CAP FUND)
        </Typography>
      </Box>

      <Box sx={{ margin: 0, padding: 0, mt: 2 }}>
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
          {rows.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  {columns?.map((item, index) => (
                    <DefTableCell
                      key={index}
                      sx={{
                        fontWeight: 500,
                        width: item.width,
                        textAlign: index === 0 ? "start" : "end",
                        color: theme.palette.secondary[1000],
                      }}
                    >
                      {item.label}
                    </DefTableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <TableRow>
                      <DefTableCell
                        sx={{
                          textAlign: "left",
                          fontWeight: 600,
                          borderBottom: "none",
                        }}
                      >
                        {row.particular}
                        <IconButton
                          size="medium"
                          onClick={() => handleRowClick(rowIndex)}
                          sx={{ padding: "2px" }}
                        >
                          {expandedRows[rowIndex] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </DefTableCell>
                      <DefTableCell
                        sx={{
                          textAlign: "right",
                          fontWeight: 600,
                          borderBottom: "none",
                        }}
                      >
                        {row.totalAmount}
                      </DefTableCell>
                      <DefTableCell
                        sx={{
                          textAlign: "right",
                          fontWeight: 600,
                          borderBottom: "none",
                        }}
                      >
                        {row.amountLastQuarter}
                      </DefTableCell>
                      <DefTableCell
                        sx={{
                          textAlign: "right",
                          fontWeight: 600,
                          borderBottom: "none",
                        }}
                      >
                        {row.amountLastYear}
                      </DefTableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} sx={{ padding: 0 }}>
                        <Collapse
                          in={expandedRows[rowIndex]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box>
                            <Table size="small" aria-label="sub-data">
                              <TableBody>
                                {row.subData.map((subRow, subRowIndex) => (
                                  <TableRow
                                    key={subRowIndex}
                                    sx={{ borderBottom: "none" }}
                                  >
                                    <DefTableCell
                                      sx={{
                                        textAlign: "left",
                                        borderBottom: "none",
                                      }}
                                    >
                                      {subRow.particular}
                                    </DefTableCell>
                                    <DefTableCell
                                      sx={{
                                        textAlign: "right",
                                        borderBottom: "none",
                                      }}
                                    >
                                      {subRow.totalAmount}
                                    </DefTableCell>
                                    <DefTableCell
                                      sx={{
                                        textAlign: "right",
                                        borderBottom: "none",
                                      }}
                                    >
                                      {subRow.amountLastQuarter}
                                    </DefTableCell>
                                    <DefTableCell
                                      sx={{
                                        textAlign: "right",
                                        borderBottom: "none",
                                      }}
                                    >
                                      {subRow.amountLastYear}
                                    </DefTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>

              <TableFooter>
                <DefTableCell
                  colSpan={4}
                  sx={{
                    background: theme.palette.secondary[100],
                    borderBottom: "none",
                    height: "2rem",
                  }}
                ></DefTableCell>
              </TableFooter>
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
