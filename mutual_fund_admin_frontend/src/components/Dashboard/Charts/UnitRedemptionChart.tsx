import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import { colorTokens } from "../../../theme";

const UnitRedemptionChart = ({ data }) => {

  if (!data || !data.responseData || !data.responseData.data || !Array.isArray(data.responseData.data) || data.responseData.data.length === 0) {
    return <Box sx={{height:225 , display:'flex', justifyContent:'center', alignItems:'center'}}>No data available</Box>;
  }

  const transformedData = data?.responseData?.data?.map(
    (item: { day: string | number | Date; units_redeemed: string ; units_redeemed_amount: string }) => {
      return {
        x: new Date(item.day).getTime(),
        y: parseFloat(item.units_redeemed ?? item.units_redeemed_amount),
      };
    }
  );
  // transformedData.sort((a: { x: number }, b: { x: number }) => a.x - b.x);
  const options = {
    chart: {
      // type: "area",
      height: 225,
      // backgroundColor: theme.palette.mode === "dark" ? "black" : "",
    },
    accessibility: {
      enabled: false,
    },

    rangeSelector: {
      enabled: false,
    },

    scrollbar: {
      enabled: false,
    },

    title: {
      text: null,
    },

    navigator: {
      enabled: false,
    },
    legend: {
      enabled: false,
      title: {
        text: null,
      },
    },

    plotOptions: {
      areaspline: {
        marker: {
          enabled: false,
        },
        fillOpacity: 1,
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 1,
            x2: 0,
            y2: 0,
          },
          stops: [
            // [0, "rgba(229, 57, 53, 0)"],
            // [1, "rgba(129, 57, 53, 0.2)"],
            [0, `${colorTokens.mainColor[1100]}00`],
            [1, `${colorTokens.mainColor[1100]}40`],
          ],
        },
      },
    },

    tooltip: {
      enabled: true,
      pointFormat: "NAV Value: <b>{point.y:.1fr}</b>",
      positioner: function (
        labelWidth: number,
        labelHeight: number,
        point: { plotX: any; plotY: number }
      ) {
        let tooltipX: number;
        if (point.plotX + labelWidth > this.chart.plotWidth) {
          tooltipX = this.chart.plotWidth - labelWidth;
        } else {
          tooltipX = point.plotX;
        }
        const tooltipY = point.plotY - labelHeight;

        return {
          x: tooltipX,
          y: tooltipY,
        };
      },
    },

    credits: {
      enabled: false,
    },

    series: [
      {
        name: null,
        type: "area",
        data: transformedData,
        threshold: null,
        // color: "rgba(116, 18, 18, 1)",
        color: colorTokens.mainColor[1000],
        tooltip: {
          pointFormat: `Value: {point.y}`,
        },
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 1,
            x2: 0,
            y2: 0,
          },
          stops: [
            // [0, "rgba(229, 57, 53, 0)"],
            // [1, "rgba(129, 57, 53, 0.2)"],
            [0, `${colorTokens.mainColor[500]}00`],
            [1, `${colorTokens.mainColor[500]}50`],
          ],
        },
      },
    ],
  };

  return (
    <Box>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </Box>
  );
};

export default UnitRedemptionChart;
