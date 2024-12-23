import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Box, MenuItem, Select } from "@mui/material";
import { colorTokens } from "../../../theme";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { Controller, useForm } from "react-hook-form";
import ColumnChartSkeleton from "components/Skeleton/ColumnChartSkeleton";

import SIPPaymentChart from "../Charts/SIPPaymentChart";

import { useGetDashboardSIPPayment } from "services/Dashboard/dashboardServices";

const SIPPayment = () => {
  const theme = colorTokens;
  const { control } = useForm();

  const [timeData, setTimeData] = useState("1week");
  const [valueData, setValueData] = useState("amount");
  const [isDataLoading, setIsDataLoading] = useState(true);

  const {
    isLoading,
    isError,
    data: SIPPaymentData,
  } = useGetDashboardSIPPayment(timeData, valueData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChangeTime = (e: { target: { value: any } }) => {
    const newTimeField = e.target.value as string;
    setTimeData(newTimeField);
  };

  const handleChangeValue = (e: { target: { value: any } }) => {
    const newValueField = e.target.value as string;
    setValueData(newValueField);
  };

  const formatIndianNumber = (amount: number | undefined | null): string => {
    const formattedAmount = amount ?? 0;
    return formattedAmount.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      {(isLoading || isDataLoading) ? (
        <Box
          sx={{
            height: 225,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ColumnChartSkeleton />
        </Box>
      ) : isError ? (
        <Card
          sx={{
            width: 315,
            height: 447,
            borderRadius: "0.8rem",
            "&.MuiCard-root": {
              boxShadow: "none",
              // border: `0.1rem solid ${theme.grey[400]}`,
              border: "2px solid #D4D4D4",


              // width: 320,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: `0.1rem solid ${theme.grey[400]}`,

              height: 447,
            }}
          >
            <Typography>Error at Fetching Data</Typography>
          </Box>
        </Card>
      ) : (
        <Card
          sx={{
            width: "100%",
            height: "fit-content",
            minHeight: 460,
            borderRadius: "0.8rem",
            "&.MuiCard-root": {
              boxShadow: "none",
              // border: `0.1rem solid ${theme.grey[400]}`,
            border: "2px solid #D4D4D4",

              // lg: { width: 400 },
              // xl:{width: 400},

              // width: 320,
            },
          }}
        >
          <CardHeader
            titleTypographyProps={{
              fontSize: 20,
              fontWeight: 400,
              display: "flex",
              justifyContent: "center",
            }}
            sx={{ fontSize: "1rem" }}
            title="SIP Payment"
          />

          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              p: 0,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "1.6rem",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                NPR {formatIndianNumber(SIPPaymentData.meta.total_amount)}
              </Typography>
              <Typography sx={{ textAlign: "center", color: theme.grey[500] }}>
                Amount
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{}} />

            <Box>
              <Typography
                sx={{
                  fontSize: "1.6rem",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {formatIndianNumber(SIPPaymentData.meta.total_units)}
              </Typography>
              <Typography sx={{ textAlign: "center", color: theme.grey[500] }}>
                Units
              </Typography>
            </Box>
          </CardContent>

          <Box sx={{ width: "100%", p: 2 }}>
            <TypographyLabel title="Filters" />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Controller
                name="filterDay"
                control={control}
                defaultValue="1week"
                render={({ field }) => (
                  <Select
                    {...field}
                    size="small"
                    fullWidth
                    onChange={handleChangeTime}
                    value={timeData}
                  >
                    <MenuItem value="1week">1 Week</MenuItem>
                    <MenuItem value="1month">1 Month</MenuItem>
                    <MenuItem value="3month">3 Month</MenuItem>
                    <MenuItem value="6month">6 Month</MenuItem>
                  </Select>
                )}
              />
              <Controller
                name="filterSIPPayment"
                control={control}
                defaultValue="amount"
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={handleChangeValue}
                    size="small"
                    fullWidth
                    value={valueData}
                  >
                    <MenuItem value="amount">Payment Amount</MenuItem>
                    <MenuItem value="unit">Number of Payment</MenuItem>
                  </Select>
                )}
              />
            </Box>
          </Box>

          {/* SIP Payment Chart  */}
          <Box>
            <SIPPaymentChart data={SIPPaymentData} />
          </Box>
        </Card>
      )}
    </>
  );
};

export default SIPPayment;
