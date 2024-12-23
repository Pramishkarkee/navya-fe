import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";
import { colorTokens } from "../../../theme";

const SIPRegistrationChart = ({ data }) => {
  
  if (!data || !data.responseData || !data.responseData.data || !Array.isArray(data.responseData.data) || data.responseData.data.length === 0) {
    return <Box sx={{height:225 , display:'flex', justifyContent:'center', alignItems:'center'}}>No data available</Box>;
  }

  const transformedData = data?.responseData?.data?.map(
      (item: {
        date: string | number | Date;
        total_units: number | string | any;
        total_amount: number | string | any;
      }) => {
        const date =
          item.date instanceof Date
            ? item.date.getTime()
            : new Date(item.date).getTime();

        return {
          x: date,
          y: parseFloat(item.total_units ?? item.total_amount ?? 0),
        };
      }
    )
    ?.sort((a: { x: number }, b: { x: number }) => a.x - b.x);

  const options = {
    chart: {
      height: 225,
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
    yAxis: {
      labels: {
          align: 'left',
          x: 2,
          // y: -2
         
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
            [0, "rgba(229, 57, 53, 0)"],
            [1, "rgba(129, 57, 53, 0.2)"],
          ],
        },
      },
    },

    tooltip: {
      enabled: true,
      pointFormat: "SIP Value: <b>{point.y:.1fr}</b>",
      positioner: function (labelWidth, labelHeight, point) {
        let tooltipX;
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
        type: "column",
        data: transformedData,
        threshold: null,
        // color: "rgba(116, 18, 18, 1)",
        color: colorTokens.mainColor[1000],
        tooltip: {
          pointFormat: `SIP Value: {point.y}`,
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

export default SIPRegistrationChart;
