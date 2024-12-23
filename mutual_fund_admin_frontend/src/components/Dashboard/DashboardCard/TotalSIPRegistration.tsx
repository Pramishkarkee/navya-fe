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

import SIPRegistrationChart from "../Charts/SIPRegistrationChart";

import { useGetDashboardSIPRegister } from "services/Dashboard/dashboardServices";

const TotalSIPRegistration = () => {
  const theme = colorTokens;
  const { control } = useForm();

  const [timeData, setTimeData] = useState("1week");
  const [valueData, setValueData] = useState("amount");

  const [isDataLoading, setIsDataLoading] = useState(true);

  const {
    isLoading,
    isError,
    data: SIPRegistrationData,
    refetch,
  } = useGetDashboardSIPRegister(timeData, valueData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }
  , []);

  const handleChangeValue = (e: { target: { value: any } }) => {
    const newTimefield = e.target.value as string;
    setValueData(newTimefield);
  };

  const handleChangeTime = (e: { target: { value: any } }) => {
    const newAmountfield = e.target.value as string;
    setTimeData(newAmountfield);
  };

  useEffect(() => {
    refetch();
  }, [valueData, timeData, refetch]);

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
              // border: "0.1rem solid gray",
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
              height: 447,
            }}
          >
            <Typography>Error at Fetching Data</Typography>
          </Box>
        </Card>
      ) : (
        <Card
          sx={{
            // width: 400,
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
            title="Total SIP Registration"
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
                NPR{" "}
                {formatIndianNumber(SIPRegistrationData.meta.sip_reg_amount)}
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
                {formatIndianNumber(SIPRegistrationData.meta.sip_reg)}
              </Typography>
              <Typography sx={{ textAlign: "center", color: theme.grey[500] }}>
                SIPs
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
                name="filterAmount"
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
                    <MenuItem value="amount">Registration Amount</MenuItem>
                    <MenuItem value="unit">Number of SIPs</MenuItem>
                  </Select>
                )}
              />
            </Box>
          </Box>
          <Box>
            <SIPRegistrationChart data={SIPRegistrationData} />
          </Box>
        </Card>
      )}
    </>
  );
};

export default TotalSIPRegistration;
