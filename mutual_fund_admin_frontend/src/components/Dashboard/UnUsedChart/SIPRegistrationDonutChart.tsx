import React, { useState, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import PieChart from "highcharts-react-official";

import { useGetSIPPurchase } from 'services/Dashboard/dashboardServices'
import { useTheme } from "@mui/material";

const colors = Highcharts.getOptions().colors;

const SIPRegistrationChart = () => {
const theme = useTheme();
  const [totalRequests, setTotalRequests] = useState(0);
  const [data, setData] = useState([
    {
      y: 0,
      color: colors[0],
      drilldown: {
        name: "Approved",
        categories: [],
        data: [],
      },
    },
    {
      y: 0,
      color: colors[1],
      drilldown: {
        name: "Pending",
        categories: [],
        data: [],
      },
    },
    {
      y: 0,
      color: colors[2],
      drilldown: {
        name: "Rejected",
        categories: [],
        data: [],
      },
    },
  ]);

  const { isLoading, isError, data: sipPurchaseAmount, error } = useGetSIPPurchase();

  useEffect(() => {
    if (!isLoading && !isError && sipPurchaseAmount) {
      const rawData = {
        data: [
          {
            y: sipPurchaseAmount?.responseData?.approved_sip,
            // color: '#420909',
            color: theme.palette.primary[1100],
            drilldown: {
              name: "Approved",
              categories: [],
              data: [],
            },
          },
          {
            y: sipPurchaseAmount?.responseData?.pending_sip,
            // color: '#e57373',
            color: theme.palette.primary[700],
            drilldown: {
              name: "Pending",
              categories: [],
              data: [],
            },
          },
          {
            y: sipPurchaseAmount?.responseData?.rejected_sip,
            // color: '#b71c1c',
            color: theme.palette.primary[300],
            drilldown: {
              name: "Rejected",
              categories: [],
              data: [],
            },
          },
        ],
      };

      const total = rawData?.data?.reduce((acc, item) => acc + item.y, 0);
      setTotalRequests(total);
      setData(rawData?.data);
    }
  }, [isLoading, isError, sipPurchaseAmount, theme.palette.primary]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !sipPurchaseAmount) {
    return <div>Error: {error ? error.message : 'Failed to fetch data'}</div>;
  }

  const getSubtitle = () => {
    return `
    <div style="text-align:center">
       <div style="font-size: 40px">${totalRequests}</div>
       <div style="font-size: 16px">Requests</div>
    </div>`;
  };

  const browserData = [];
  data.forEach((item) => {
    browserData.push({
      name: "",
      y: item.y,
      color: item.color,
    });
  });

  const options = {
    chart: {
      type: "pie",
      height: 200,
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      enabled: false
  },
    subtitle: {
      useHTML: true,
      text: getSubtitle(),
      floating: false,
      verticalAlign: "middle",
      // y: 12,
      // x: 8,
    },
    plotOptions: {
      pie: {
        shadow: false,
        cursor: 'pointer',
        size: 100,
        chart: {},
      },
    },
    tooltip: {
      valueSuffix: " Requests",
    },
    series: [
      {
        name: "Data",
        data: browserData,
        colorByPoint: true,
        size: "120%",
        innerSize: "70%",
        dataLabels: {
          formatter: function () {
            return this.y > 1 ? this.point.name : null;
          },
          color: "black",
          distance: 0,
        },
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 10,
          },
          chartOptions: {
            series: [
              {},
              {
                id: "versions",
                dataLabels: {
                  enabled: false,
                },
              },
            ],
          },
        },
      ],
    },
  };

  return <PieChart highcharts={Highcharts} options={options} />;
};

export default SIPRegistrationChart;