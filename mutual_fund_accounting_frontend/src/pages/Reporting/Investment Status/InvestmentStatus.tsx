import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import SearchText from "components/Button/Search";
import DateField from "components/DateFilter/DateField";
import { useForm } from "react-hook-form";
import DateFormatter from "utils/DateFormatter";
// import RoundedButton from "components/Button/Button";
import { useState, useCallback, useEffect } from "react";
import DownloadButton from "components/Button/DownloadExcel";
import { useGetAllSectorData } from "services/SectorData/SectorDataServices";
import TuneIcon from "@mui/icons-material/Tune";
import debounce from "utils/Debounce";

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

const staticDataSectorwise = [
  {
    sn: 1,
    sector: "finance",
    Market_value: 50000,
    investment_threshold_min: 15000,
    investment_threshold_max: 35000,
    investment_amount: 505555,
    marketValue: 100000000,
  },
  {
    sn: 2,
    sector: "finance",
    Market_value: 50000,
    investment_threshold_min: 15000,
    investment_threshold_max: 35000,
    investment_amount: 505555,
    marketValue: 100000000,
  },
  {
    sn: 3,
    sector: "finance",
    Market_value: 50000,
    investment_threshold_min: 15000,
    investment_threshold_max: 35000,
    investment_amount: 505555,
    marketValue: 100000000,
  },
];

const staticDataDetailed = [
  {
    sn: 1,
    symbol: "NTC",
    totalUnits: 50000,
    effectiveRate: 15000,
    investment_amount: 35000,
    ltp: 492.12,
    marketValue: 100000000,
    status: "+35000",
  },
  {
    sn: 2,
    symbol: "NTC",
    totalUnits: 50000,
    effectiveRate: 15000,
    investment_amount: 35000,
    ltp: 492.12,
    marketValue: 100000000,
    status: "-35000",
  },
  {
    sn: 3,
    symbol: "NTC",
    totalUnits: 50000,
    effectiveRate: 15000,
    investment_amount: 35000,
    ltp: 492.12,
    marketValue: 100000000,
    status: "+35000",
  },
];

const DetailedviewColumns = [
  {
    label: "S.No",
    width: "5%",
  },
  {
    label: "Symbol",
    width: "14.5%",
  },
  {
    label: "Total Units",
    width: "14.5%",
  },
  {
    label: "WACC Rate",
    width: "14.5%",
  },
  {
    label: "Investment Amount",
    width: "14.5%",
  },
  {
    label: "LTP",
    width: "10%",
  },
  {
    label: "Market Value",
    width: "14.5%",
  },
  {
    label: "Gain/Loss Status",
    width: "14.5%",
  },
];

const SectorwiseColumns = [
  {
    label: "S.No",
    width: "5%",
  },
  {
    label: "Sector",
    width: "14.5%",
  },
  {
    label: "Market Valuation (NPR)",
    width: "14.5%",
  },
  {
    label: "Investment Threshold (Min)",
    width: "14.5%",
  },
  {
    label: "Investment Threshold (Max)",
    width: "14.5%",
  },
  {
    label: "Investment Amount",
    width: "14.5%",
  },
  {
    label: "Sector Exposure",
    width: "14.5%",
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
    // borderRight: "none",
    borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
  },
}));

export default function InvestmentStatus() {
  const { control, handleSubmit, setValue } = useForm({});
  const theme = useTheme();
  const [id, setId] = useState();
  const [securitiesType, setSecuritiesType] = useState<string>("listed");
  const [viewType, setViewType] = useState<string>("detailedview");
  const [shareType, setShareType] = useState<string>("all_instruments");

  const [sectorOptions, setSectorOptions] = useState([]);

  const [loadClicked, setLoadClicked] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");

  const { data: stockData } = useGetAllSectorData();

  useEffect(() => {
    if (stockData?.isSuccess) {
      setSectorOptions(
        stockData.responseData.map((sector: any) => ({
          sector_id: sector.id,
          sector_name: sector.name,
          sector_code: sector.code,
        }))
      );
    }
  }, [stockData]);

  // let totalUnits = 0;
  // let effectiveRate = 0;
  // let investmentAmount = 0;
  // let ltp = 0;
  // let marketValue = 0;

  const [rows, setRows] = useState(staticDataDetailed);
  const [sectorSummaryRows, setSectorSummaryRows] =
    useState(staticDataSectorwise);

  // const handleRowChange = (index: number, field: number | string, value) => {
  //   const updatedRows = [...rows];
  //   if (typeof value === "object" && "id" in value) {
  //     updatedRows[index][field] = value.label;
  //     updatedRows[index][`${field}_id`] = value.id;
  //   } else {
  //     updatedRows[index][field] = value;
  //   }
  //   setRows(updatedRows);
  // };

  // totalUnits = rows.reduce((total, item) => {
  //   const debit = Number(item.totalUnits);
  //   if (!isNaN(debit)) {
  //     total += debit;
  //   }
  //   return total;
  // }, 0);

  // effectiveRate = rows.reduce((total, item) => {
  //   const debit = Number(item.effectiveRate);
  //   if (!isNaN(debit)) {
  //     total += debit;
  //   }
  //   return total;
  // }, 0);

  // investmentAmount = rows.reduce((total, item) => {
  //   const debit = Number(item.investmentAmount);
  //   if (!isNaN(debit)) {
  //     total += debit;
  //   }
  //   return total;
  // }, 0);

  // ltp = rows.reduce((total, item) => {
  //   const debit = Number(item.ltp);
  //   if (!isNaN(debit)) {
  //     total += debit;
  //   }
  //   return total;
  // }, 0);

  // const ltpRounded = parseFloat(ltp.toFixed(2));

  // marketValue = rows.reduce((total, item) => {
  //   const debit = Number(item.marketValue);
  //   if (!isNaN(debit)) {
  //     total += debit;
  //   }
  //   return total;
  // }, 0);

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
      setErrorMsgs("Both start and end dates must be selected.");
      setSnackbarErrorOpen(true);
    }
  };

  const handleDownloadExcel = () => {};

  // const handleSectorChange = (event) => {
  //   setSelectedMenu(event.target.value);
  // };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
      //   setValue("id", value);
    }, 500),
    [setValue]
  );

  const columns =
    viewType === "detailedview" ? DetailedviewColumns : SectorwiseColumns;

  // useEffect(() => {
  //   if (viewType === "detailedview") {
  //     setRows(staticDataDetailed);
  //   } else {
  //     setRows(staticDataSectorwise);
  //   }
  // }, [viewType]);

  return (
    <Box>
      <Box
        // component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingTop: 1,
        }}
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
            {" "}
            Investment Status Details{" "}
          </Typography>
        </Box>
        <Box
          // component="form"
          // onSubmit={handleSubmit(handleLoad)}
          sx={{
            width: {
              xs: "95%",
              sm: "100%",
              md: "110%",
              lg: "150%",
              xl: "120%",
            },
            display: "flex",
            gap: 3,
            marginTop: 1,
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <SearchText
            title="Search for Symbol"
            //   {...register("id")}
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          />
          <Box sx={{ mt: -1 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
            />
          </Box>

          <FormControl size="small" sx={{ width: "25%" }}>
            <Select
              labelId="securitytype-select-label"
              id="securitytype-select"
              value={shareType}
              label="Select Security Type"
              onChange={(e) => setShareType(e.target.value)}
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
              <MenuItem value="all_instruments">All Instruments</MenuItem>
              <MenuItem value="equity_shares">Equity Shares</MenuItem>
              <MenuItem value="mutual_funds">Mutual Funds</MenuItem>
              <MenuItem value="corporate_debentures">
                Corporate Debentures
              </MenuItem>
              <MenuItem value="government_bonds">Government Bonds</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ width: "25%" }}>
            <Select
              labelId="securities-select-label"
              id="securities-select"
              value={securitiesType}
              onChange={(e) => setSecuritiesType(e.target.value)}
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
              <MenuItem value="all">All Securties</MenuItem>
              <MenuItem value="listed">Listed Securities</MenuItem>
              <MenuItem value="unlisted">Unlisted Securities</MenuItem>
            </Select>
          </FormControl>

          {/* <Box sx={{ mt: -0.5 }}>
            <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
          </Box> */}
        </Box>

        <Box>
          <FormControl
            size="small"
            sx={{ width: { md: "40%", lg: "40%", xl: "25%" } }}
          >
            <Select
              labelId="securitiesview-select-label"
              id="securitiesview-select"
              value={viewType}
              // label="Select Sector"
              onChange={(e) => setViewType(e.target.value)}
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
              <MenuItem value="detailedview">Detailed View</MenuItem>
              <MenuItem value="sectorwise">Sectorwise Summary</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* <Box sx={{ width: { xs: "95%", lg: "150%", md: "110%", xl: "90%" } }}> */}
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
          <Box sx={{ display: "flex", flexDirection: "row-reverse", mb: 2 }}>
            <DownloadButton
              sx={{ justifyContent: "flex-end" }}
              onClick={handleDownloadExcel}
            />
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                {columns?.map((item, index) => (
                  <DefTableCell
                    key={index}
                    sx={{
                      width: item.width,
                      p: 1.5,
                      textAlign: index === 2 || index === 3 ? "start" : "start",
                    }}
                  >
                    {item.label}
                  </DefTableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {viewType === "detailedview" ? (
                <>
                  {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.keys(row).map((field, cellIndex) => {
                        return (
                          <DefTableCell key={cellIndex} sx={{}}>
                            <TextField
                              fullWidth
                              size="small"
                              value={row[field] === 0 ? "" : row[field]}
                              // onChange={(e) =>
                              //   handleRowChange(rowIndex, field, e.target.value)
                              // }
                              inputProps={{
                                readOnly: true,
                                style: {
                                  textAlign:
                                    cellIndex === 2 || cellIndex === 3
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
                          </DefTableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  {sectorSummaryRows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.keys(row).map((field, cellIndex) => (
                        <DefTableCell key={cellIndex} sx={{}}>
                          <TextField
                            fullWidth
                            size="small"
                            value={row[field] === 0 ? "" : row[field]}
                            // onChange={(e) =>
                            //   handleRowChange(rowIndex, field, e.target.value)
                            // }
                            inputProps={{
                              readOnly: true,
                              style: {
                                textAlign:
                                  cellIndex === 2 || cellIndex === 3
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
                                // color:
                                //   field === "investment_amount" &&
                                //   (row[field] > 0
                                //     ? "#008C1F"
                                //     : row[field] < 0
                                //     ? "#B71C1C"
                                //     : "#CA8A04"),
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
                        </DefTableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              )}

              <TableRow
                sx={{
                  bgcolor: theme.palette.background.light,
                  borderBottom: "none",
                }}
              >
                <TableCell
                // colSpan={2}
                // sx={{
                //   p: "0.1rem",
                //   textAlign: "center",
                //   color: theme.palette.secondary[700],
                // }}
                >
                  {/* Total */}
                </TableCell>
                <TableCell
                // sx={{
                //   p: "0.3rem",
                //   textAlign: "center",
                //   color: theme.palette.secondary[700],
                // }}
                >
                  {/* {totalUnits} */}
                </TableCell>
                <TableCell
                // colSpan={1}
                // sx={{
                //   p: "0.3rem",
                //   textAlign: "center",
                //   color: theme.palette.secondary[700],
                // }}
                >
                  {/* {effectiveRate} */}
                </TableCell>
                <TableCell
                // colSpan={1}
                // sx={{
                //   p: "0.3rem",
                //   textAlign: "center",
                //   color: theme.palette.secondary[700],
                // }}
                >
                  {/* {investmentAmount} */}
                </TableCell>

                <TableCell
                // colSpan={1}
                // sx={{
                //   p: "0.3rem",
                //   textAlign: "center",
                //   color: theme.palette.secondary[700],
                // }}
                >
                  {/* {ltpRounded} */}
                </TableCell>
                <TableCell
                // colSpan={1}
                // sx={{
                //   p: "0.3rem",
                //   textAlign: "center",
                //   color: theme.palette.secondary[700],
                // }}
                >
                  {/* {marketValue} */}
                </TableCell>
                <TableCell></TableCell>
                {viewType === "detailedview" && <TableCell></TableCell>}
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
