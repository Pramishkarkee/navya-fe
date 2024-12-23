import React from "react";
// import Highcharts from "highcharts/highstock";
// import HighchartsReact from "highcharts-react-official";
import { Box } from "@mui/material";

const NAVHistoryChart = ({ data }) => {
    // const transformedData = data?.responseData?.data?.map((item: { created_at: string | number | Date; nav_value: string; }) => {
    //   return {
    //     x: new Date(item.created_at).getTime(),
    //     y: parseFloat(item.nav_value),
    //   };
    // });
    // transformedData.sort((a: { x: number; }, b: { x: number; }) => a.x - b.x);

    if (!data || !data.responseData || !Array.isArray(data.responseData.data) || data.responseData.data.length === 0) {
        return <Box sx={{ height: 225, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No data available</Box>;
    }

    const transformedData = data?.responseData?.data?.map(
        (item: {
            created_at: string | number | Date;
            nav_value: number | string | any;
        }) => {
            const created_at =
                item.created_at instanceof Date
                    ? item.created_at.getTime()
                    : new Date(item.created_at).getTime();

            return {
                x: created_at,
                y: parseFloat(item.nav_value ?? 0),
            };
        }
    )
        ?.sort((a: { x: number }, b: { x: number }) => a.x - b.x);

    const options = {
        chart: {
            height: 265,
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
                        [0, "rgba(229, 57, 53, 0)"],
                        [1, "rgba(129, 57, 53, 0.2)"],
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
                color: "rgba(116, 18, 18, 1)",
                tooltip: {
                    pointFormat: `NAV Value: {point.y}`,
                },
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
        ],
    };

    return (
        <Box sx={{ p: 0 }}>
            {/* <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      /> */}
        </Box>
    );
};

export default NAVHistoryChart;
