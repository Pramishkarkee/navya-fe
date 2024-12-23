import React, { useState, useCallback } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  debounce,
  useTheme,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import SearchText from "components/Button/Search";
import RoundedButton from "components/Button/Button";
import DateField from "components/DateFilter/DateField";
import HeaderDesc from "components/HeaderDesc/HeaderDesc";
import DownloadButton from "components/Button/DownloadExcel";
import { useGetInvestmentStatusSummarized } from "services/Reporting/InvestmentStatus/InvestmentStatusServices";

export default function InvestmentStatusReport() {
  const theme = useTheme();
  const { control, handleSubmit, setValue } = useForm({});

  const categorie = [
    { name: "Equity Investment", key: "equity_investment" },
    { name: "Mutual Fund", key: "mutual_fund" },
    { name: "Fixed Income", key: "fixed_income" },
    { name: "Cash and Cash Equivalents", key: "cash_and_cash_equivalents" },
  ];

  const [id, setId] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState({});
  const [view, setView] = useState<string>("Summary View");
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: string;
  }>({
    equity_investment: "",
    mutual_fund: "",
    fixed_income: "",
    cash_and_cash_equivalents: "",
  });

  const { data: summarizedInfodata } = useGetInvestmentStatusSummarized(
    view === "all" ? "" : view
  );

  const debouncedSetId = useCallback(
    debounce((value) => {
      setId(value);
    }, 500),
    [setValue]
  );

  const handleViewChange = (e) => {
    const newView = e.target.value;
    setView(newView);

    if (newView === "Summary View") {
      setExpandedRows({});
    } else if (newView === "Detailed View") {
      const allExpanded = categorie.reduce((acc, category) => {
        acc[category.key] = true;
        return acc;
      }, {});
      setExpandedRows(allExpanded);
    }
  };
  const handleToggleExpand = (categoryKey) => {
    setExpandedRows((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  // const handleDownloadExcel = () => {};

  const getTotalMarketValue = (categoryKey) => {
    const categoryData = summarizedInfodata?.responseData[categoryKey] || [];
    if (selectedCategories[categoryKey]) {
      const selectedItem = categoryData.find(
        (item) => item.sector === selectedCategories[categoryKey]
      );
      return selectedItem ? selectedItem.market_value || 0 : 0;
    }
    return categoryData?.data?.reduce(
      (total, item) => total + (item.market_value || 0),
      0
    );
  };

  const getTotalInvestmentAmount = (categoryKey) => {
    const categoryData = summarizedInfodata?.responseData[categoryKey] || [];
    if (selectedCategories[categoryKey]) {
      const selectedItem = categoryData.find(
        (item) => item.sector === selectedCategories[categoryKey]
      );
      return selectedItem ? selectedItem.investment_amount || 0 : 0;
    }
    return categoryData?.data?.reduce(
      (total, item) =>
        total +
        (item.investment_amount ||
          item.fixed_deposit_above_90_days ||
          item.bond_debenture ||
          item.bank ||
          0),
      0
    );
  };

  const getThresholdValues = (categoryKey) => {
    const categoryThreshold =
      summarizedInfodata?.responseData[categoryKey] || [];

    return {
      min: categoryThreshold ? categoryThreshold.min_value : "-",
      max: categoryThreshold ? categoryThreshold.max_value : "-",
    };
  };

  const getColorForMarketValue = (
    totalMarketValue,
    marketValue,
    min_value,
    max_value
  ) => {
    const sectorExposure = (marketValue / totalMarketValue) * 100;

    const minYellowThreshold = min_value * (1 + 0.1);
    const maxYellowThreshold = max_value * (1 - 0.1);

    if (sectorExposure <= min_value || sectorExposure >= max_value) {
      return "#B71C1C";
    } else if (
      (sectorExposure <= minYellowThreshold && sectorExposure > min_value) ||
      (sectorExposure >= maxYellowThreshold && sectorExposure < max_value)
    ) {
      return "#CA8A04";
    } else {
      return "#008C1F";
    }
  };

  const getColorForInvestmentAmount = (
    totalInvestmentAmount,
    investmentAmount,
    min_value,
    max_value
  ) => {
    const sectorExposure = (investmentAmount / totalInvestmentAmount) * 100;

    const minYellowThreshold = min_value * (1 + 0.1);
    const maxYellowThreshold = max_value * (1 - 0.1);

    if (sectorExposure <= min_value || sectorExposure >= max_value) {
      return "#B71C1C";
    } else if (
      (sectorExposure <= minYellowThreshold && sectorExposure > min_value) ||
      (sectorExposure >= maxYellowThreshold && sectorExposure < max_value)
    ) {
      return "#CA8A04";
    } else {
      return "#008C1F";
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ mt: 2, mb: 2 }}>
        <HeaderDesc title="Investment Status Details" />
        <Box
          component="form"
          onSubmit={handleSubmit(() => {})}
          sx={{
            mt: 2,
            width: "100%",
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          ,
          <SearchText
            title="Search for Symbol"
            onChange={(e) => debouncedSetId(e.target.value)}
            onClick={handleSubmit(() => {})}
          />
          <Box sx={{ mt: -2 }}>
            <DateField
              control={control}
              dateLabel1="Date (From)"
              dateLabel2="Date (To)"
              maxDateValue={dayjs()}
            />
          </Box>
          <RoundedButton title1="Load" onClick1={handleSubmit(() => {})} />
        </Box>
      </Box>

      <FormControl size="small" sx={{ width: "30%" }}>
        <Select
          labelId="securities-select-label"
          id="securities-select"
          value={view}
          onChange={handleViewChange}
          open={isDropdownOpen}
          onClose={() => setDropdownOpen(false)}
          onOpen={() => setDropdownOpen(true)}
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
          <MenuItem value="Summary View">Summary View</MenuItem>
          <MenuItem value="Detailed View">Detailed View</MenuItem>
        </Select>
      </FormControl>

      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "110%", lg: "150%", xl: "160%" },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row-reverse", mb: 2 }}>
          {/* <DownloadButton
            sx={{ justifyContent: "flex-end" }}
            onClick={handleDownloadExcel}
          /> */}
        </Box>
        <Table
          sx={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <TableHead
            sx={{
              borderCollapse: "collapse",
            }}
          >
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "3%",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  padding: "8px",
                }}
              >
                S.No
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "17%",
                  fontSize: "0.9rem",
                  textAlign: "left",
                  padding: "8px",
                }}
              >
                Sector
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "13.33%",
                  fontSize: "0.9rem",
                  textAlign: "right",
                  padding: "8px",
                }}
              >
                Investment Threshold <br /> (Min)
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "13.33%",
                  fontSize: "0.9rem",
                  textAlign: "right",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  padding: "8px",
                }}
              >
                Investment Threshold <br />
                (Max)
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "13.33%",
                  fontSize: "0.9rem",
                  textAlign: "right",
                  padding: "8px",
                }}
              >
                Market Valuation (NPR)
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "13.33%",
                  fontSize: "0.9rem",
                  textAlign: "right",
                  padding: "8px",
                }}
              >
                Sector Exposure
                <br /> (Market Value)
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "13.33%",
                  fontSize: "0.9rem",
                  textAlign: "right",
                  padding: "8px",
                }}
              >
                Investment Amount (NPR)
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: "13.33%",
                  fontSize: "0.9rem",
                  textAlign: "right",
                  padding: "8px",
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    textAlign: "right",
                  }}
                >
                  Sector Exposure
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    textAlign: "right",
                  }}
                >
                  (Cost Basis)
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categorie.map((category, catIndex) => (
              <React.Fragment key={category.key}>
                <TableRow sx={{ borderBottom: "none" }}>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      width: "3%",
                      border: "none",
                    }}
                  >{`${catIndex + 1}`}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "4px 8px",
                      border: "none",
                    }}
                  >
                    {category.name}
                    <IconButton
                      size="small"
                      onClick={() => handleToggleExpand(category.key)}
                    >
                      {expandedRows[category.key] ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "right",
                      width: "13.33%",
                      border: "none",
                    }}
                  >
                    {getThresholdValues(category.key).min}%
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "right",
                      width: "13.33%",
                      border: "none",
                    }}
                  >
                    {getThresholdValues(category.key).max}%
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "4px 4px",
                      width: "13.33%",
                      border: "none",
                    }}
                  >
                    {getTotalMarketValue(category.key)
                      ? getTotalMarketValue(category.key)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : getTotalMarketValue(category.key)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "right",
                      width: "13.33%",
                      border: "none",
                      color: getColorForMarketValue(
                        summarizedInfodata?.responseData?.total_market_amount,
                        getTotalMarketValue(category.key),
                        getThresholdValues(category.key).min,
                        getThresholdValues(category.key).max
                      ),
                    }}
                  >
                    {(
                      (getTotalMarketValue(category.key) /
                        summarizedInfodata?.responseData?.total_market_amount) *
                      100
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    %
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "4px",
                      width: "13.33%",
                      border: "none",
                    }}
                  >
                    {getTotalInvestmentAmount(category.key)
                      ? getTotalInvestmentAmount(category.key)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : getTotalInvestmentAmount(category.key)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "4px",
                      width: "13.33%",
                      border: "none",
                      color: getColorForInvestmentAmount(
                        summarizedInfodata?.responseData
                          ?.total_investment_amount,
                        getTotalMarketValue(category.key),
                        getThresholdValues(category.key).min,
                        getThresholdValues(category.key).max
                      ),
                    }}
                  >
                    {(
                      (getTotalInvestmentAmount(category.key) /
                        summarizedInfodata?.responseData
                          ?.total_investment_amount) *
                      100
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    %
                  </TableCell>
                </TableRow>
                {expandedRows[category.key] &&
                  (view === "Summary View" || view === "Detailed View") && (
                    <TableRow
                      sx={{
                        borderBottom: "none",
                      }}
                    >
                      <TableCell
                        colSpan={8}
                        style={{
                          paddingBottom: 0,
                          paddingTop: 0,
                          border: "none",
                        }}
                      >
                        <Collapse
                          in={expandedRows[category.key]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <Table
                              sx={{
                                borderCollapse: "collapse",
                                borderSpacing: 0,
                                width: "102%",
                              }}
                            >
                              <TableBody>
                                {(
                                  summarizedInfodata?.responseData[
                                    category.key
                                  ] || []
                                )?.data?.map((item, index) => (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      backgroundColor:
                                        index % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                                      borderBottom: "none",
                                    }}
                                  >
                                    <TableCell
                                      sx={{
                                        border: "none",
                                        textAlign: "center",
                                        padding: "8px 8px",
                                        width: "3%",
                                      }}
                                    >
                                      <Box component="span">
                                        {`${catIndex + 1}.${index + 1}`}
                                      </Box>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "none",
                                        textAlign: "left",
                                        padding: "8px 8px",
                                        width: "17%",
                                      }}
                                    >
                                      <Box component="span">
                                        {item.sector || "N/A"}
                                      </Box>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "none",
                                        textAlign: "right",
                                        padding: "8px 16px",
                                        width: "13.33%",
                                      }}
                                    >
                                      <Box component="span">
                                        {item.min_value}%
                                      </Box>
                                    </TableCell>

                                    <TableCell
                                      sx={{
                                        border: "none",
                                        textAlign: "right",
                                        padding: "8px 16px",
                                        width: "13.33%",
                                      }}
                                    >
                                      <Box component="span">
                                        {item.max_value}%
                                      </Box>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "none",
                                        textAlign: "right",
                                        padding: "8px 12px",
                                        width: "13.33%",
                                      }}
                                    >
                                      <Box component="span">
                                        {item.market_value
                                          ?.toFixed(2)
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          ) || 0}
                                      </Box>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "none",
                                        textAlign: "right",
                                        padding: "8px 18px",
                                        width: "13.33%",
                                        color: getColorForMarketValue(
                                          getTotalMarketValue(category.key),
                                          item.market_value,
                                          item.min_value,
                                          item.max_value
                                        ),
                                      }}
                                    >
                                      <Box component="span">
                                        {(isNaN(
                                          (item.market_value /
                                            getTotalMarketValue(category.key)) *
                                            100
                                        )
                                          ? 0
                                          : (
                                              (item.market_value /
                                                getTotalMarketValue(
                                                  category.key
                                                )) *
                                              100
                                            )
                                              .toFixed(2)
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                              )) || 0}
                                        %
                                      </Box>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "none",
                                        textAlign: "right",
                                        padding: "8px",
                                        width: "13.33%",
                                      }}
                                    >
                                      <Box component="span">
                                        {item.investment_amount
                                          ?.toFixed(2)
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          ) || 0}
                                      </Box>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "none",
                                        textAlign: "right",
                                        padding: "8px 4px",
                                        width: "13.33%",
                                        color: getColorForInvestmentAmount(
                                          getTotalMarketValue(category.key),
                                          item.investment_amount,
                                          item.min_value,
                                          item.max_value
                                        ),
                                      }}
                                    >
                                      <Box component="span">
                                        {(isNaN(
                                          (item.investment_amount /
                                            getTotalInvestmentAmount(
                                              category.key
                                            )) *
                                            100
                                        )
                                          ? 0
                                          : (
                                              (item.investment_amount /
                                                getTotalInvestmentAmount(
                                                  category.key
                                                )) *
                                              100
                                            )
                                              .toFixed(2)
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                              )) || 0}
                                        %
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
              </React.Fragment>
            ))}
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  border: "none",
                }}
              ></TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "left",
                  backgroundColor: theme.palette.primary.light,
                  border: "none",
                }}
              >
                Total
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  border: "none",
                }}
              ></TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  border: "none",
                }}
              ></TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "right",
                  backgroundColor: theme.palette.primary.light,
                  border: "none",
                  padding: "8px",
                }}
              >
                {summarizedInfodata?.responseData?.total_market_amount
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </TableCell>

              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  border: "none",
                }}
              ></TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "right",
                  backgroundColor: theme.palette.primary.light,
                  border: "none",
                  padding: "8px",
                }}
              >
                {summarizedInfodata?.responseData?.total_investment_amount
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  border: "none",
                }}
              ></TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  border: "none",
                }}
              ></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </React.Fragment>
  );
}
