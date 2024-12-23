import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Button, Typography, useTheme } from "@mui/material";
// import { colorTokens } from "../../theme";
import { useGetIncomeExpenseData } from "services/Dashboard/DashboadServices";
import dayjs from "dayjs";

const IncomeExpenses: React.FC = () => {
  const theme = useTheme();

  const [filter, setFilter] = useState<"1d" | "1w" | "1m" | "3m" | "6m" | "1y">(
    "1m"
  );

  const { data: IncomeExpensesData, isSuccess } =
    useGetIncomeExpenseData(filter);

  // const [chartData, setChartData] = useState<number[]>([]);
  // const [xAxisCategories, setXAxisCategories] = useState<string[]>([]);
  const [noData, setNoData] = useState(false);

  // const totalAmount = SecurityTypeData?.meta?.total_invest || 0;
  // const changeAmount = SecurityTypeData?.meta?.change || 0;
  // const changePercentage = Math.abs(SecurityTypeData?.meta?.percentage_change) || 0;

  const filterTimeRange = [
    { value: "1w", label: "1W" },
    { value: "1m", label: "1M" },
    { value: "3m", label: "3M" },
    { value: "6m", label: "6M" },
    { value: "1y", label: "1Y" },
  ];


  const Income = IncomeExpensesData?.responseData?.map(
    (entry: any) => entry?.income
  );
  const Expense = IncomeExpensesData?.responseData?.map(
    (entry: any) => entry?.expense
  );
  const TxnDate = IncomeExpensesData?.responseData?.map((entry: any) =>
    dayjs(entry?.txn_date).format("DD MMM YYYY")
  );

  useEffect(() => {
    if (isSuccess) {
      if (IncomeExpensesData?.responseData?.length > 0) {
        // setChartData(dataPoints);
        // setXAxisCategories(categories);
        setNoData(false);
      } else {
        // setChartData([]);
        // setXAxisCategories([]);
        setNoData(true);
      }
    }
  }, [IncomeExpensesData, isSuccess]);

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      height: 300,
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
      categories: TxnDate,
      crosshair: true,
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
      // pointFormat: `{series.name}: <b>{point.y}</b>`,
      formatter: function () {
        return `<span style="font-size: 11px;">${
          this.x
        }</span><br/> Amount: <b>${this.y.toLocaleString()}</b>`;
      },
    },
    plotOptions: {
      area: {
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 0,
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
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "column",
        name: "Income",
        data: Income,
        color: "#16A34A",
      },
      {
        type: "column",
        name: "Expense",
        data: Expense,
        color: "#DC2626",
      },
    ],
  };

  return (
    <Box
      sx={{
        mt: 2,
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
          gap: "20px",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "20px",
            }}
          >
            Income and Expenses
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>

        {filterTimeRange.map((item)=> (
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
            border: filter === item.value ? `1px solid ${theme.palette.primary.main}`: "1px solid #ccc",
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

      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default IncomeExpenses;
