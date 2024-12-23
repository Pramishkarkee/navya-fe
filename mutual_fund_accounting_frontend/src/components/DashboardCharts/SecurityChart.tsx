import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material";
// import { colorTokens } from "../../theme";
import { useGetSecurityDataList } from "services/Dashboard/DashboadServices";
import { useGetAllSectorData } from "services/SectorData/SectorDataServices";
import dayjs from "dayjs";
import DropdownWithIcon from "components/Button/DashboardDropDown";

const EquityInvestmentChart: React.FC = () => {
  const theme = useTheme();

  const [securityType, setSecurityType] = useState(" ");
  const [filter, setFilter] = useState<"1w" | "1m" | "3m" | "6m" | "1y">(
    "1m"
  );
  const [bond, setBond] = useState("");

  const BondDropdownOptions = [
    // { label: "All", value: "all" },
    { label: "Government Bonds", value: "government_bond" },
    { label: "Corporate Debentrues", value: "corporate_debenture" },
  ];

  const [sector, setSector] = useState("");
  const [sectorDropdownOptions, setSectorDropdownOptions] = useState([]);

  const { data: SecurityTypeData, isSuccess } = useGetSecurityDataList(
    filter,
    securityType,
    sector,
    bond
  );
  const { data: sectorData } = useGetAllSectorData();

  const filterTimeRange = [
    // { label: "1D", value: "1d" },
    { label: "1W", value: "1w" },
    { label: "1M", value: "1m" },
    { label: "3M", value: "3m" },
    { label: "6M", value: "6m" },
    { label: "1Y", value: "1y" },
  ];

  useEffect(() => {
    if (sectorData?.isSuccess) {
      const sectorOptions = sectorData?.responseData.map((sector: any) => ({
        label: sector.name,
        value: sector.code,
      }));
      const filterSector = sectorOptions.filter(
        (sector: any) => sector.label !== "Mutual Fund"
      );
      const optionsWithAll = [
        // { label: "All", value: "all" },
        ...filterSector,
      ];

      setSectorDropdownOptions(optionsWithAll);
    }
  }, [sectorData]);

  // const [chartData, setChartData] = useState<number[]>([]);
  // const [xAxisCategories, setXAxisCategories] = useState<string[]>([]);
  const [noData, setNoData] = useState(false);

  const totalAmount = SecurityTypeData?.meta?.total_invest || 0;
  const changeAmount = SecurityTypeData?.meta?.change || 0;
  const changePercentage =
    Math.abs(SecurityTypeData?.meta?.percentage_change) || 0;

  const InvestAmount = SecurityTypeData?.responseData?.map(
    (entry: any) => entry?.invest_amount
  );

  const MarketValue = SecurityTypeData?.responseData?.map(
    (entry: any) => entry?.market_value
  );

  const DateRange = SecurityTypeData?.responseData?.map((entry: any) =>
    dayjs(entry?.created_at).format("DD MMM YYYY")
  );

  const handleChangeSector = (event: SelectChangeEvent) => {
    setSector(event.target.value as string);
  };
  const handleChangeBond = (event: SelectChangeEvent) => {
    setBond(event.target.value as string);
  };

  useEffect(() => {
    if (isSuccess) {
      if (SecurityTypeData?.responseData?.length > 0) {
        // setChartData(dataPoints);
        // setXAxisCategories(categories);
        setNoData(false);
      } else {
        // setChartData([]);
        // setXAxisCategories([]);
        setNoData(true);
      }
    }
  }, [SecurityTypeData, isSuccess]);

  const handleChange = (event: SelectChangeEvent) => {
    setSecurityType(event.target.value as string);
    setBond("");
    setSector("");
  };

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "spline",
      height: 225,
    },
    accessibility: {
      enabled: false,
    },
    title: {
      text: noData ? "No data available" : "",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "black",
      },
    },
    xAxis: {
      categories: DateRange,
      labels: {
        formatter: function () {
          return String(this.value).slice(0, 6);
        },
        style: {
          //   fontSize: "12px",
        },
      },
      crosshair: true,
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        formatter: function () {
          return new Intl.NumberFormat("en", { notation: "compact" }).format(
            Number(this.value)
          );
        },
      },
    },
    tooltip: {
      shared: true,
      formatter: function () {
        const investmentColor = this?.points[0]?.color;
        // const marketValueColor = this?.points[1]?.color;

        // <span style="color: ${marketValueColor};">●</span> Market Value: <b>${MarketValue[this.points[1].point.index].toLocaleString()}</b>
        return `<span style="font-size: 11px;">${this.x}</span>
                <br/> 
                <span style="color: ${investmentColor};">●</span> Investment Amount: <b>${this.points[0].y.toLocaleString()}</b>
                `;
      },
    },
    plotOptions: {
      spline: {
        marker: {
          radius: 4,
          lineColor: "#666666",
          lineWidth: 1,
        },
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "spline",
        name: "Investment",
        marker: {
          symbol: "circle",
        },
        data: InvestAmount,
        color: "#3D6CAF",
      },
      // {
      //   type: "spline",
      //   name: "Market Value",
      //   marker: {
      //     symbol: "diamond",
      //   },
      //   // data: MarketValue,
      //   color: "#ff6131",
      // }
    ],
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        px: "20px",
        paddingTop: "20px",
        border: "2px solid #D4D4D4",
        borderRadius: "15px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "start", md: "space-between" },
          gap: "15px",
        }}
      >
        <Box>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={securityType}
            onChange={handleChange}
            sx={{
              fontSize: "25px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
                padding: "0px",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
                padding: "0px",
              },
              "& .MuiSelect-select": {
                padding: "0px",
                fontSize: "25px",
              },
            }}
          >
            <MenuItem value={" "}>Total Investment</MenuItem>
            <MenuItem value={"equity_share"}>Equity Investment</MenuItem>
            <MenuItem value={"bond_debenture"}>Bond and Debenture</MenuItem>
            <MenuItem value={"fixed_deposit"}>Fixed Deposit</MenuItem>
            <MenuItem value={"mutual_fund"}>Mutual Fund</MenuItem>
          </Select>
          <Typography
            sx={{
              color: theme.palette.grey[600],
              fontSize: "16px",
            }}
          >
            Navya Large Cap Fund
          </Typography>
        </Box>
        <Box sx={{ marginTop: "0px" }}>
          <Typography
            sx={{
              textAlign: { xs: "start", md: "right" },
              fontSize: "22px",
              fontWeight: 500,
            }}
          >
            NPR{" "}
            {Number(totalAmount).toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </Typography>
          <Typography
            sx={{
              textAlign: { xs: "start", md: "right" },
              fontSize: "14px",
              color:
                changeAmount > 0
                  ? "#16A34A"
                  : changeAmount < 0
                  ? "#DC2626"
                  : "black",
            }}
          >
            {changeAmount > 0
              ? `+${changeAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}`
              : `${changeAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}`}{" "}
            ({changePercentage}%)
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>

      {filterTimeRange.map((item) => (
        <Button
          key={item.value}
          sx={{
            backgroundColor:
              filter === item.value
                ? theme.palette.secondary.softColor
                : theme.palette.grey[100],
            color:
              filter === item.value
                ? theme.palette.primary.main
                : theme.palette.grey[600],
            border: filter === item.value ? `1px solid ${theme.palette.primary.main}` : "1px solid #ccc",
            minWidth: "25px",
            height: "25px",
            fontSize: "13px",
          }}
          onClick={() => setFilter(item.value as any)}
        >
          {item.label}
        </Button>
      ))}

        <Box sx={{}}>
          {securityType === "equity_share" && (
            <DropdownWithIcon
              label={"Sector"}
              options={sectorDropdownOptions}
              value={sector}
              onChange={handleChangeSector}
            />
          )}

          {securityType === "bond_debenture" && (
            <DropdownWithIcon
              label={"Bond"}
              options={BondDropdownOptions}
              value={bond}
              onChange={handleChangeBond}
            />
          )}
        </Box>
      </Box>

      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default EquityInvestmentChart;
