import React, { useState } from "react";
import dayjs from "dayjs";
import { Empty } from "antd";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import DateFormatter from "utils/DateFormatter";
import ErrorBar from "components/Snackbar/ErrorBar";
import RoundedButton from "components/Button/Button";
import DateField from "components/DateFilter/DateField";
import TrialBalancetable from "components/Table/TrialBalanceTable";
import { TrialBalanceColumns } from "constants/Reporting/TrialBalanceTableHeader";
import { useGetTrialBalance } from "services/Reporting/TrialBalance/TrialBalanceServices";

const columns = [
  {
    label: "Description",
    width: "20%",
  },
  {
    label: "Debit",
    width: "10%",
  },
  {
    label: "Credit",
    width: "10%",
  },
  {
    label: "Debit",
    width: "10%",
  },
  {
    label: "Credit",
    width: "10%",
  },
  {
    label: "Debit",
    width: "10%",
  },
  {
    label: "Credit",
    width: "10%",
  },
];

const DefTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  height: "2.5rem",
  padding: "0rem",
  lineHeight: 1.5,
  fontFamily: "inherit",
  fontSize: "14px",
  borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
  borderTop: `1px solid ${theme.palette.secondary.lightGrey}`,
}));

const MuiTypographyHead = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 500,
  textAlign: "right",
  paddingRight: "1rem",
  color: theme.palette.secondary[700],
}));

const Row = ({ detailData }) => {
  return (
    <>
      {detailData.map((items) => (
        <TableRow>
          <DefTableCell>
            <Link
              to={`/ledger/${items.code}/transaction`}
              style={{ textDecoration: "none" }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  textAlign: "left",
                  paddingLeft: 2,
                  color: "#2f84d3",
                }}
              >
                {items.code} {items.ledger_name}
              </Typography>
            </Link>
          </DefTableCell>

          <DefTableCell>
            <MuiTypographyHead>
              {Number(items?.opening_balance_dr?.toFixed(2)).toLocaleString()}
            </MuiTypographyHead>
          </DefTableCell>

          <DefTableCell>
            <MuiTypographyHead>
              {Number(items?.opening_balance_cr?.toFixed(2)).toLocaleString()}
            </MuiTypographyHead>
          </DefTableCell>

          <DefTableCell>
            <MuiTypographyHead>
              {Number(items?.debit_sum?.toFixed(2)).toLocaleString()}
            </MuiTypographyHead>
          </DefTableCell>

          <DefTableCell>
            <MuiTypographyHead>
              {Number(items?.credit_sum?.toFixed(2)).toLocaleString()}
            </MuiTypographyHead>
          </DefTableCell>

          <DefTableCell>
            <MuiTypographyHead>
              {Number(items?.closing_balance_dr?.toFixed(2)).toLocaleString()}
            </MuiTypographyHead>
          </DefTableCell>

          <DefTableCell>
            <MuiTypographyHead>
              {Number(items?.closing_balance_cr?.toFixed(2)).toLocaleString()}
            </MuiTypographyHead>
          </DefTableCell>
        </TableRow>
      ))}
    </>
  );
};

export default function TrialBalance() {
  const theme = useTheme();
  const { control, handleSubmit } = useForm({});

  const [errorMsgs, setErrorMsgs] = useState<string>("");
  const [view, setView] = useState<string>("summary_view");
  const [loadClicked, setLoadClicked] = useState<boolean>(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<{ [key: string]: string }>({
    from_date: "",
    to_date: "",
  });

  const { data: trialBalanceData } = useGetTrialBalance(
    searchData.from_date,
    searchData.to_date
  );

  const handleViewChange = (event) => {
    const selectedView = event.target.value;
    setView(selectedView);
  };

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

  // const handleDownloadExcel = () => {
  //   console.log("Implement logic to download Excel file");
  // };

  const totalOpeningBalanceDr =
    trialBalanceData &&
    trialBalanceData?.responseData?.reduce((total, item) => {
      return (
        total +
        item?.transactions?.reduce(
          (acc, value) => acc + value.opening_balance_dr,
          0
        )
      );
    }, 0);

  const totalOpeningBalanceCr =
    trialBalanceData &&
    trialBalanceData?.responseData?.reduce((total, item) => {
      return (
        total +
        item?.transactions?.reduce(
          (acc, value) => acc + value.opening_balance_cr,
          0
        )
      );
    }, 0);

  const totalDebitSum =
    trialBalanceData &&
    trialBalanceData?.responseData?.reduce((total, item) => {
      return (
        total +
        item?.transactions?.reduce((acc, value) => acc + value.debit_sum, 0)
      );
    }, 0);

  const totalCreditSum =
    trialBalanceData &&
    trialBalanceData?.responseData?.reduce((total, item) => {
      return (
        total +
        item?.transactions?.reduce((acc, value) => acc + value.credit_sum, 0)
      );
    }, 0);

  const totalClosingBalanceDr =
    trialBalanceData &&
    trialBalanceData?.responseData?.reduce((total, item) => {
      return (
        total +
        item?.transactions?.reduce(
          (acc, value) => acc + value.closing_balance_dr,
          0
        )
      );
    }, 0);

  const totalClosingBalanceCr =
    trialBalanceData &&
    trialBalanceData?.responseData?.reduce((total, item) => {
      return (
        total +
        item?.transactions?.reduce(
          (acc, value) => acc + value.closing_balance_cr,
          0
        )
      );
    }, 0);

  return (
    <React.Fragment>
      <Box sx={{ mt: 2 }}>
        <ErrorBar
          snackbarOpen={snackbarErrorOpen}
          setSnackbarOpen={setSnackbarErrorOpen}
          message={errorMsgs}
        />
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
          Entries
        </Typography>

        <Box sx={{ mt: 2, mb: 2 }}>
          <Box
            component="form"
            onSubmit={handleSubmit(handleLoad)}
            sx={{
              width: "100%",
              display: "flex",
              gap: 3,
              alignItems: "center",
            }}
          >
            {/* <SearchText
            title="Search for Symbol"
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          /> */}
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
              maxDateValue={dayjs()}
            />
            <Box mt={1.5}>
              <RoundedButton
                title1="Load"
                onClick1={handleSubmit(handleLoad)}
              />
            </Box>
          </Box>
        </Box>

        <FormControl size="small" sx={{ width: { sm: "40%", md: "30%" } }}>
          <Select
            labelId="securities-select-label"
            id="securities-select"
            value={view}
            onChange={handleViewChange}
            startAdornment={<TuneIcon />}
            variant="outlined"
            sx={{
              mt: 1,
              borderBlockColor: "white",
              borderRadius: "24px",
              backgroundColor: theme.palette.primary.light,
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiOutlinedInput-input": {
                ml: "6px",
              },
            }}
          >
            <MenuItem value="summary_view">Summary View</MenuItem>
            <MenuItem value="detailed_view">Detailed View</MenuItem>
          </Select>
        </FormControl>

        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "100%",
              md: "110%",
              lg: "165%",
              xl: "175%",
            },
            overflowX: "auto",
            mt: 3,
          }}
        >
          {/* <Box sx={{ display: "flex", flexDirection: "row-reverse", mb: 2 }}>
          <DownloadButton
            sx={{ justifyContent: "flex-end" }}
            onClick={handleDownloadExcel}
            />
            </Box> */}

          {trialBalanceData?.responseData?.length > 0 ? (
            view === "summary_view" ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
                        "& .MuiTableCell-root": {
                          padding: 0,
                        },
                      }}
                    ></TableCell>
                    <TableCell
                      colSpan={2}
                      sx={{
                        borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
                        textAlign: "center",
                        padding: "0rem",
                      }}
                    >
                      Opening Balance (NPR)
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      sx={{
                        borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
                        textAlign: "center",
                        padding: "0rem",
                      }}
                    >
                      Transaction (NPR)
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      sx={{
                        borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
                        textAlign: "center",
                        padding: "0rem",
                      }}
                    >
                      Closing Balance (NPR)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell
                        key={index}
                        sx={{
                          padding: "8px",
                          width: column.width,
                          fontSize: "14px",
                          textAlign: index === 0 ? "left" : "center",
                          borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {trialBalanceData?.responseData?.map((row) => {
                    return (
                      <Row
                        detailData={row?.transactions ?? []}
                        // open={rowDetails[row?.acc_code]}
                        // handleToggle={handleToggle}
                      />
                    );
                  })}
                </TableBody>

                <TableFooter>
                  <DefTableCell>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        textAlign: "left",
                        paddingLeft: 2,
                      }}
                    >
                      Total
                    </Typography>
                  </DefTableCell>
                  <DefTableCell>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        textAlign: "right",
                        paddingRight: 2,
                      }}
                    >
                      {Number(
                        totalOpeningBalanceDr.toFixed(2)
                      ).toLocaleString()}
                    </Typography>
                  </DefTableCell>
                  <DefTableCell>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        textAlign: "right",
                        paddingRight: 2,
                      }}
                    >
                      {Number(
                        totalOpeningBalanceCr.toFixed(2)
                      ).toLocaleString()}
                    </Typography>
                  </DefTableCell>
                  <DefTableCell>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        textAlign: "right",
                        paddingRight: 2,
                      }}
                    >
                      {Number(totalDebitSum.toFixed(2)).toLocaleString()}
                    </Typography>
                  </DefTableCell>
                  <DefTableCell>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        textAlign: "right",
                        paddingRight: 2,
                      }}
                    >
                      {Number(totalCreditSum.toFixed(2)).toLocaleString()}
                    </Typography>
                  </DefTableCell>
                  <DefTableCell>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        textAlign: "right",
                        paddingRight: 2,
                      }}
                    >
                      {Number(
                        totalClosingBalanceDr.toFixed(2)
                      ).toLocaleString()}
                    </Typography>
                  </DefTableCell>
                  <DefTableCell>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        textAlign: "right",
                        paddingRight: 2,
                      }}
                    >
                      {Number(
                        totalClosingBalanceCr.toFixed(2)
                      ).toLocaleString()}
                    </Typography>
                  </DefTableCell>
                </TableFooter>
              </Table>
            ) : (
              <TrialBalancetable
                data={trialBalanceData?.responseData ?? []}
                columns={TrialBalanceColumns}
              />
            )
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
    </React.Fragment>
  );
}
