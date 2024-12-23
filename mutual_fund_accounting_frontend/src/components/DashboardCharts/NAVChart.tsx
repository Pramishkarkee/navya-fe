import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Button, Typography, useTheme } from "@mui/material";
// import { colorTokens } from "../../theme";
import { useGetNAVChartData } from "services/Dashboard/DashboadServices";
import dayjs from "dayjs";

const EquityInvestmentChart: React.FC = () => {
  const theme = useTheme();

  const [filter, setFilter] = useState<"1d" | "1w" | "1m" | "3m" | "6m" | "1y">(
    "1m"
  );

  const { data: SecurityTypeData, isSuccess } = useGetNAVChartData(filter);

  // const [chartData, setChartData] = useState<number[]>([]);
  // const [xAxisCategories, setXAxisCategories] = useState<string[]>([]);
  const [noData, setNoData] = useState(false);

  const filterTimeRange = [
    {value : "1w", label: "1W"},
    {value : "1m", label: "1M"},
    {value : "3m", label: "3M"},
    {value : "6m", label: "6M"},
    {value : "1y", label: "1Y"},
  ]

  const totalAmount = SecurityTypeData?.meta?.current_nav || 0;
  const changeAmount = SecurityTypeData?.meta?.change || 0;
  const changePercentage =
    Math.abs(SecurityTypeData?.meta?.percentage_change) || 0;

  const dataPoints = SecurityTypeData?.responseData?.map(
    (entry: any) => entry?.nav_value
  );
  const categories = SecurityTypeData?.responseData?.map((entry: any) =>
    dayjs(entry?.created_at).format("DD MMM YYYY")
  );

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

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "area",
      height: 220,
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
      categories: categories,
      labels: {
        formatter: function () {
          return String(this.value).slice(0, 6);
        },
        style: {
          // fontSize: "14px",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        format: "{value}",
      },
    },
    tooltip: {
      pointFormat: "NAV Value: <b>{point.y}</b>",
    },
    plotOptions: {
      //   series: {
      //     lineColor: '#303030'
      //  },
      area: {
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 3,
          states: {
            hover: {
              enabled: true,
              radius: 5,
            },
          },
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
        color: "#008000",
        name: "Investment",
        data: dataPoints,
        type: "area",
        fillOpacity: 0.4,

        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 1,
            x2: 0,
            y2: 0,
          },
          stops: [
            [0, `#00800000`],
            [1, `#00800040`],
          ],
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        // display: "flex",
        // flexDirection: "column",
        // gap: "20px",
        px: "20px",
        paddingTop: "20px",
        border: "2px solid #D4D4D4",
        borderRadius: "15px",
        width: "100%",
        // maxWidth: "500px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          justifyContent: { xs: "start", sm: "start", md: "space-between" },
          gap: "20px",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            NAV Chart
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb: 1,
            }}
          >
            {filterTimeRange.map((item) => (
              <Button
                sx={{
                  backgroundColor:
                    filter === item.value
                      ? theme.palette.secondary.softColor
                      : theme.palette.grey[100],
                  color:
                    filter === item.value
                      ? theme.palette.primary.main
                      : theme.palette.grey[600],
                  border:
                    filter === item.value
                      ? `1px solid ${theme.palette.primary.main}`
                      : "1px solid #ccc",
                  minWidth: "25px",
                  height: "25px",
                  fontSize: "13px",
                }}
                onClick={() => setFilter(item.value as any)}
              >
                {item.label}
              </Button>
            ))}

          </Box>
        </Box>
        <Box sx={{ marginTop: "0px" }}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 500,
              textAlign: "right",
            }}
          >
            {Number(totalAmount).toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </Typography>
          <Typography
            sx={{
              textAlign: { xs: "start", sm: "start", md: "right" },
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

      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default EquityInvestmentChart;
