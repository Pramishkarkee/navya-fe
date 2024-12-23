import { useCallback, useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useForm } from "react-hook-form";
import { Empty } from "antd";
import DateField from "components/DateFilter/DateField";
import DateFormatter from "utils/DateFormatter";
import RoundedButton from "components/Button/Button";
import SearchText from "components/Button/Search";
import ErrorBar from "components/Snackbar/ErrorBar";
import { useGetTrialBalance } from "services/Reporting/TrialBalance/TrialBalanceServices";
import ExportButton from "components/Button/ExportButton";
import { useGetCashFlowList } from "services/Cash Flow/CashFlowServices";
import debounce from "utils/Debounce";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 16px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderRight: `1px solid ${theme.palette.divider}`,
  fontSize: "14px",
  "&:first-of-type": {
    fontWeight: 500,
  },
  "&.numeric": {
    textAlign: "right",
  },
  "&.subitem": {
    paddingLeft: "32px",
  },
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  padding: "12px 16px",
  backgroundColor: theme.palette.grey[50],
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderRight: `1px solid ${theme.palette.divider}`,
  fontWeight: 600,
  fontSize: "14px",
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  gap: "8px",
}));

const Section = ({ title, data, expanded, onToggle }) => {
  return (
    <>
      <TableRow>
        <StyledTableCell colSpan={3}>
          <SectionHeader>
            <Typography sx={{ fontWeight: 600, flex: 1, fontSize: "14px" }}>
              {title}{" "}
              <IconButton size="small" onClick={onToggle} sx={{ ml: "auto" }}>
                {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Typography>
            {/* <IconButton size="small" onClick={onToggle} sx={{ ml: "auto" }}>
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton> */}
          </SectionHeader>
        </StyledTableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={3}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Table size="small" sx={{ width: "100%" }}>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className="subitem"
                      sx={{ width: "60%", fontWeight: 400 }}
                    >
                      {item.label}
                    </TableCell>
                    <StyledTableCell
                      className="numeric"
                      sx={{ width: "20%", fontWeight: 400 }}
                    >
                      {formatNumber(item.value2079)}
                    </StyledTableCell>
                    <StyledTableCell className="numeric" sx={{ width: "20%" }}>
                      {formatNumber(item.value2080)}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const formatNumber = (number) => {
  return number?.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + item.value2079, 0);
};

export default function CashFlow() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { control, handleSubmit, setValue } = useForm({});
  const theme = useTheme();
  const [id, setId] = useState("");
  const [view, setView] = useState("summary_view");
  const [expandedRows, setExpandedRows] = useState({});

  const [searchData, setSearchData] = useState({
    from_date: "",
    to_date: "",
  });
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState("");
  const [operatingExpanded, setOperatingExpanded] = useState(false);
  const [equityExpanded, setEquityExpanded] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: cashFlowDataList } = useGetCashFlowList(
    // view,
    id,
    searchData.from_date,
    searchData.to_date,
    pagination.pageIndex + 1
  );

  const cashFlowData = {
    operatingActivities: [
      {
        label: "Net Income for the Year",
        value2080: 10000000,
        value2079: 20000000,
      },
      {
        label: "Decrease in Payables",
        value2080: -40000000,
        value2079: -40000000,
      },
    ],
    financingActivities: [
      {
        label: "Net Issuance Of Units In Continuous Offering",
        value2080: 20000000,
        value2079: 20000000,
      },
      {
        label: "Increase in Unit Reserve Capital Account",
        value2080: 20000000,
        value2079: 20000000,
      },
      {
        label: "Increase in Unit Reserve Capital Account",
        value2080: 20000000,
        value2079: 20000000,
      },
    ],
  };

  const handleViewChange = (event) => {
    setView(event.target.value);
    if (event.target.value === "detailed_view") {
      setOperatingExpanded(true);
      setEquityExpanded(true);
    } else {
      setOperatingExpanded(false);
      setEquityExpanded(false);
    }
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
    } else {
      setErrorMsgs("Both start and end dates must be selected.");
      setSnackbarErrorOpen(true);
    }
  };

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
    }, 500),
    [setValue]
  );

  return (
    <Box
      sx={{
        width: {
          xs: "95%",
          sm: "95%",
          md: "100%",
          lg: "140%",
          xl: "130%",
        },
        overflow: "hidden",
      }}
    >
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
        Cash Flow Statement
      </Typography>
      <Box
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { xs: "stretch", md: "center" },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(handleLoad)}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
            flex: 1,
          }}
        >
          <SearchText
            title="Search for Symbol"
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(handleLoad)}
          />
          <DateField
            control={control}
            dateLabel1="Date (From)"
            dateLabel2="Date (To)"
          />
          <RoundedButton title1="Load" onClick1={handleSubmit(handleLoad)} />
        </Box>
      </Box>
      <FormControl size="small" sx={{ minWidth: 200, mb: 0.5 }}>
        <Select
          value={view}
          onChange={handleViewChange}
          startAdornment={<TuneIcon />}
          variant="outlined"
          sx={{
            borderRadius: "24px",
            backgroundColor: theme.palette.primary.light,
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          <MenuItem value="summary_view">Summary View</MenuItem>
          <MenuItem value="detailed_view">Detailed View</MenuItem>
        </Select>
      </FormControl>
      {/* <Box sx={{ display: "flex", gap: 1, flexDirection: "row-reverse" }}>
        <ExportButton
          filename="DayCloseSummary.csv"
          search={id}
          startDate={searchData.from_date}
          endDate={searchData.to_date}
          title="Download PDF"
          baseURL={`${BASE_URL}/accounting/api/v1/accounting/day-close/export/?export=True`}
        />
        <ExportButton
          filename="DayCloseSummary.csv"
          search={id}
          startDate={searchData.from_date}
          endDate={searchData.to_date}
          title="Download Excel File"
          baseURL={`${BASE_URL}/accounting/api/v1/accounting/day-close/export/?export=True`}
        />
      </Box> */}

      <Box
        sx={{
          overflowX: "auto",
          mt: 3,
          "& .MuiTable-root": {
            minWidth: 650,
            borderCollapse: "collapse",
            width: "100%",
          },
        }}
      >
        <Box
          sx={{ display: "flex", gap: 1, flexDirection: "row-reverse", mb: 2 }}
        >
          <ExportButton
            filename="CashFlow.csv"
            search={id}
            startDate={searchData.from_date}
            endDate={searchData.to_date}
            title="Download PDF"
            baseURL={`${BASE_URL}/accounting/api/v1/accounting/day-close/export/?export=True`}
          />
          <ExportButton
            filename="CashFlow.csv"
            search={id}
            startDate={searchData.from_date}
            endDate={searchData.to_date}
            title="Download Excel File"
            baseURL={`${BASE_URL}/accounting/api/v1/accounting/day-close/export/?export=True`}
          />
        </Box>
        {/* {trialBalanceData?.responseData?.length > 0 || true ? ( */}
        {cashFlowDataList > 0 || true ? (
          <Table
            sx={{
              width: {
                xs: "95%",
                sm: "100%",
                md: "110%",
                lg: "120%",
                xl: "130%",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <StyledHeaderCell
                  sx={{
                    width: "60%",
                    fontSize: "0.9rem",
                    textAlign: "left",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Particulars
                </StyledHeaderCell>
                <StyledHeaderCell
                  align="right"
                  sx={{
                    width: "20%",
                    fontSize: "0.9rem",
                    textAlign: "right",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  FY 2079/80
                </StyledHeaderCell>
                <StyledHeaderCell
                  align="right"
                  sx={{
                    width: "20%",
                    fontSize: "0.9rem",
                    textAlign: "right",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  FY 2080/81
                </StyledHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Section
                title="Cash Flow from Operating Activities "
                data={cashFlowData.operatingActivities}
                expanded={operatingExpanded}
                // expanded={view === "detailed_view" ? true : operatingExpanded}
                onToggle={() => setOperatingExpanded(!operatingExpanded)}
              />
              {/* {expandedRows &&
                (view === "Summary View" || view === "Detailed View") && (
                  <TableRow>
                    <StyledTableCell sx={{ fontWeight: 600 }}>
                      Net Cash Flow from Operations (A)
                    </StyledTableCell>
                    <StyledTableCell
                      className="numeric"
                      sx={{ fontWeight: 600 }}
                    >
                      {formatNumber(
                        calculateTotal(cashFlowData.operatingActivities)
                      )}
                    </StyledTableCell>
                    <StyledTableCell
                      className="numeric"
                      sx={{ fontWeight: 600 }}
                    >
                      {formatNumber(
                        calculateTotal(cashFlowData.operatingActivities)
                      )}
                    </StyledTableCell>
                  </TableRow>
                )
                } */}
              <TableRow>
                <StyledTableCell sx={{ fontWeight: 600 }}>
                  Net Cash Flow from Operations (A)
                </StyledTableCell>
                <StyledTableCell className="numeric" sx={{ fontWeight: 600 }}>
                  {formatNumber(
                    calculateTotal(cashFlowData.operatingActivities)
                  )}
                </StyledTableCell>
                <StyledTableCell className="numeric" sx={{ fontWeight: 600 }}>
                  {formatNumber(
                    calculateTotal(cashFlowData.operatingActivities)
                  )}
                </StyledTableCell>
              </TableRow>
              <Section
                title="Cash Flow by Equity Issue "
                data={cashFlowData.financingActivities}
                expanded={equityExpanded}
                onToggle={() => setEquityExpanded(!equityExpanded)}
              />
              <TableRow>
                <StyledTableCell sx={{ fontWeight: 600 }}>
                  Net Cash Flow from Financing Activities (B)
                </StyledTableCell>
                <StyledTableCell className="numeric" sx={{ fontWeight: 600 }}>
                  {formatNumber(
                    calculateTotal(cashFlowData.financingActivities)
                  )}
                </StyledTableCell>
                <StyledTableCell className="numeric" sx={{ fontWeight: 600 }}>
                  {formatNumber(
                    calculateTotal(cashFlowData.financingActivities)
                  )}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 3,
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
  );
}
