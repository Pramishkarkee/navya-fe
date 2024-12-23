import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography, useTheme } from "@mui/material";
import { useGetPayableReceivableData } from "services/Dashboard/DashboadServices";

const PayablesReceivablesChart = () => {
  const theme = useTheme();
  const [payable, setPayable] = useState<number>(0);
  const [receivable, setReceivable] = useState<number>(0);

  const { data: PayableReceivablesData } = useGetPayableReceivableData();

  useEffect(() => {
    if (PayableReceivablesData) {
      setPayable(PayableReceivablesData?.responseData[0]?.payable || 0);
      setReceivable(PayableReceivablesData?.responseData[0]?.receivables || 0);
    }
  }, [PayableReceivablesData]);

  const totalAmount = receivable - payable;

  const chartOptions = {
    chart: {
      type: "pie",
      height: 250,
    },
    accessibility: {
      enabled: false,
    },
    title: {
      text: "",
    },
    tooltip: {
      enabled: false,
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },

    plotOptions: {
      series: {
        allowPointSelect: false,
        cursor: "pointer",
        borderRadius: 2,
        dataLabels: [
          {
            enabled: false,
            distance: 80,
            format: "{point.y}",
          },
          {
            enabled: false,
            distance: -15,
            format: "{point.y}",
            style: {
              fontSize: "0.9em",
            },
          },
        ],
        showInLegend: false,
      },
    },
    series: [
      {
        name: "Amount",
        // colorByPoint: true,
        innerSize: "70%",
        data: [
          {
            name: "Payable",
            y: payable,
            color: "#00BCD4",
          },
          {
            name: "Receivable",
            y: receivable,
            color: "#3D6CAF",
          },
        ],
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <>
      <Box
        sx={{
          padding: 2,
          borderRadius: "15px",
          border: "2px solid #D4D4D4",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 500,
            mb: 0.5,
          }}
        >
          Trade Payables and Trade Receivables
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "250px",
                height: "250px",
                mr: "10px",
              }}
            >
              <HighchartsReact highcharts={Highcharts} options={chartOptions} />

              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "18px",
                    color:
                      totalAmount > 0
                        ? "#16A34A"
                        : totalAmount < 0
                        ? "#DC2626"
                        : "black",
                  }}
                >
                  NPR{" "}
                  {totalAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: theme.palette.grey[500],
                  }}
                >
                  Net Balance
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Payable and Receivable Text */}
          <Box sx={{ textAlign: "left" }}>
            <Typography sx={{ fontWeight: "bold", color: "#3D6CAF" }}>
              NPR{" "}
              {receivable.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: theme.palette.grey[500],
              }}
            >
              Trade Receivable
            </Typography>
            <br />
            <Typography sx={{ fontWeight: "bold", color: "#00BCD4" }}>
              NPR{" "}
              {payable.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: theme.palette.grey[500],
              }}
            >
              Trade Payable
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PayablesReceivablesChart;
