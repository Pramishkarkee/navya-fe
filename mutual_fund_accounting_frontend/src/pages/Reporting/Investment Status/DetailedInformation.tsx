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
// import DateFormatter from "utils/DateFormatter";
import { useState, useCallback, useEffect } from "react";
import DownloadButton from "components/Button/DownloadExcel";
import { useGetAllSectorData } from "services/SectorData/SectorDataServices";
import TuneIcon from "@mui/icons-material/Tune";
import debounce from "utils/Debounce";

// const DateFormatterUnit = {
//   format: (dateString: string): string => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     return `${year}-${month < 10 ? "0" + month : month}-${
//       day < 10 ? "0" + day : day
//     }`;
//   },
// };

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

const columns = [
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
    label: "Unrealized Gain/(Loss)",
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
    borderRight: `1px solid ${theme.palette.secondary.lightGrey}`,
  },
}));

export default function DetailedInformation() {
  const {
    control,
    //  handleSubmit,
    setValue,
  } = useForm({});

  const theme = useTheme();
  const [id, setId] = useState();
  const [securitiesType, setSecuritiesType] = useState<string>("all");
  // const [shareType, setShareType] = useState<string>("all_instruments");

  const [sectorOptions, setSectorOptions] = useState([]);

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

  const [rows, setRows] = useState(staticDataDetailed);

  const handleDownloadExcel = () => {};

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
    }, 500),
    [setValue]
  );

  return (
    <Box>
      <Box
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
            // onClick={handleSubmit(handleLoad)}
          />
          <Box sx={{ mt: -1 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
            />
          </Box>

          {/* <FormControl size="small" sx={{ width: "25%" }}>
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
          </FormControl> */}

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
              <MenuItem value="all">All Securities</MenuItem>
              <MenuItem value="listed">Listed Securities</MenuItem>
              <MenuItem value="unlisted">Unlisted Securities</MenuItem>
            </Select>
          </FormControl>
        </Box>

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
                      textAlign:
                        index === 0 ? "center" : index === 1 ? "start" : "end",
                    }}
                  >
                    {item.label}
                  </DefTableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(row).map((field, cellIndex) => {
                    return (
                      <DefTableCell key={cellIndex} sx={{}}>
                        <Box
                          sx={{
                            padding: "10px",
                            textAlign:
                              cellIndex === 1
                                ? "start"
                                : cellIndex === 0
                                ? "center"
                                : "end",
                            // color:
                            //   field === "investment_amount" &&
                            //   (row[field] > 0
                            //     ? "#008C1F"
                            //     : row[field] < 0
                            //     ? "#B71C1C"
                            //     : "#CA8A04"),
                          }}
                        >
                          <Typography>
                            {row[field] === 0 ? "" : row[field]}
                          </Typography>
                        </Box>
                        {/* <TextField
                          fullWidth
                          size="small"
                          value={row[field] === 0 ? "" : row[field]}
                          inputProps={{
                            readOnly: true,
                            style: {
                              textAlign:
                                cellIndex === 1
                                  ? "start"
                                  : cellIndex === 0
                                  ? "center"
                                  : "end",
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
                        /> */}
                      </DefTableCell>
                    );
                  })}
                </TableRow>
              ))}

              <TableRow
                sx={{
                  bgcolor: theme.palette.background.light,
                  borderBottom: "none",
                }}
              >
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
