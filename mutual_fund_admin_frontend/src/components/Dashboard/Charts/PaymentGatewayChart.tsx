import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";

interface PaymentData {
  total_units: number | string;
  date: string | number | Date;
}

interface ApiResponse {
  responseData: {
    data: {
      [key: string]: PaymentData[];
    };
  };
  meta: {
    total_returnable_amount: number | string | null;
    total_investment_amount: number | string | null;
    total_applied_unit: number | string;
  };
}

interface ChartProps {
  data: ApiResponse | null;
}


const PaymentGatewayChart: React.FC<ChartProps> = ({ data }) => {
  // if (!data || !data.responseData || !data.responseData.data) {
  //   return <Box sx={{ height: 225, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No data available</Box>;
  // }


  // if (!data?.responseData?.data) {
  //   return <Box sx={{ height: 225, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No data available</Box>;
  // }


  // if (!data || !data.responseData || !data.responseData.data || !Array.isArray(data.responseData.data) || data.responseData.data.length === 0) {
  //   return <Box sx={{height:225 , display:'flex', justifyContent:'center', alignItems:'center'}}>No data available</Box>;
  // }


  if (!data?.responseData?.data || Object.keys(data.responseData.data).length === 0) {
    return <Box sx={{ height: 225, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No data available</Box>;
  }


  const allData: PaymentData[] = Object.values(data.responseData.data).reduce((accumulator: PaymentData[], currentValue: PaymentData[]) => {
    accumulator.push(...currentValue);
    return accumulator;
  }, []);

 
  const seriesData = Object.entries(data.responseData.data).map(([paymentMethod, methodData]) => ({
    name: paymentMethod,
    type: 'line',
    data: methodData.map((item: PaymentData) => ({
      x: new Date(item.date).getTime(),
      y: parseFloat(item.total_units.toString()),
    })),
    threshold: null,
    tooltip: {
      pointFormat: `<b>{series.name}:</b> {point.y}`,
    },
    
  }));

  const options: Highcharts.Options = {
    chart: {
      height: 225,
    },
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  
    rangeSelector: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
    series: seriesData as Highcharts.SeriesOptionsType[],
  };

  return (
    <Box>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
      />
    </Box>
  );
};

export default PaymentGatewayChart;


// import React from "react";
// import Highcharts from "highcharts/highstock";
// import HighchartsReact from "highcharts-react-official";
// import { Box } from "@mui/material";

// const PaymentGatewayChart = ({ data }) => {
//   if (!data || !data.responseData || !data.responseData.data || !Array.isArray(data.responseData.data) || data.responseData.data.length === 0) {
//     return <Box sx={{height:225 , display:'flex', justifyContent:'center', alignItems:'center'}}>No data available</Box>;
//   }

//   const transformedData = data?.responseData?.data?.map(
//     (item: { date: string | number | Date; total_units: string }) => {
//       return {
//         x: new Date(item.date).getTime(),
//         y: parseFloat(item.total_units),
//       };
//     }
//   );
//   transformedData.sort((a: { x: number }, b: { x: number }) => a.x - b.x);


//   const options = {
//     chart: {
//       height: 225,
//       // backgroundColor: theme.palette.mode === "dark" ? "black" : "",
//     },
//     accessibility: {
//       enabled: false,
//     },

//     rangeSelector: {
//       enabled: false,
//     },

//     scrollbar: {
//       enabled: false,
//     },

//     title: {
//       text: null,
//     },

//     navigator: {
//       enabled: false,
//     },
    // legend: {
    //   enabled: false,
    //   title: {
    //     text: null,
    //   },
    // },

//     plotOptions: {
//       areaspline: {
//         marker: {
//           enabled: false,
//         },
//         fillOpacity: 1,
//         fillColor: {
//           linearGradient: {
//             x1: 0,
//             y1: 1,
//             x2: 0,
//             y2: 0,
//           },
//           stops: [
//             [0, "rgba(229, 57, 53, 0)"],
//             [1, "rgba(129, 57, 53, 0.2)"],
//           ],
//         },
//       },
//     },

//     tooltip: {
//       enabled: true,
//       pointFormat: "Payment Value: <b>{point.y:.1fr}</b>",
//       positioner: function (
//         labelWidth: number,
//         labelHeight: number,
//         point: { plotX: any; plotY: number }
//       ) {
//         let tooltipX: number;
//         if (point.plotX + labelWidth > this.chart.plotWidth) {
//           tooltipX = this.chart.plotWidth - labelWidth;
//         } else {
//           tooltipX = point.plotX;
//         }
//         const tooltipY = point.plotY - labelHeight;

//         return {
//           x: tooltipX,
//           y: tooltipY,
//         };
//       },
//     },

//     credits: {
//       enabled: false,
//     },

//     series: [
//       {
//         name: null,
//         type: "line",
//         data: transformedData,
//         threshold: null,
//         color: "rgba(116, 18, 18, 1)",
//         tooltip: {
//           pointFormat: `Payment Value: {point.y}`,
//         },
//         fillColor: {
//           linearGradient: {
//             x1: 0,
//             y1: 1,
//             x2: 0,
//             y2: 0,
//           },
//           stops: [
//             [0, "rgba(229, 57, 53, 0)"],
//             [1, "rgba(129, 57, 53, 0.2)"],
//           ],
//         },
//       },
//       {
//         name: null,
//         type: "line",
//         data: [
//           [new Date('2024-04-15').getTime(), 50000],
//         [new Date('2024-04-16').getTime(), 600000],
//         [new Date('2024-04-17').getTime(), 80000],
//         ],
//         threshold: null,
//         color: "rgba(116, 180, 18, 1)",
//         tooltip: {
//           pointFormat: `Esewa Payment Value: {point.y}`,
//         },
//         fillColor: {
//           linearGradient: {
//             x1: 0,
//             y1: 1,
//             x2: 0,
//             y2: 0,
//           },
//           stops: [
//             [0, "rgba(229, 57, 53, 0)"],
//             [1, "rgba(129, 57, 53, 0.2)"],
//           ],
//         },
//       },
//     ],
//   };

//   return (
//     <Box>
//       <HighchartsReact
//         highcharts={Highcharts}
//         constructorType={"stockChart"}
//         options={options}
//       />
//     </Box>
//   );
// };

// export default PaymentGatewayChart;