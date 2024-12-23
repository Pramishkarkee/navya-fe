import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Box, MenuItem, Select } from "@mui/material";
import TypographyLabel from "components/InputLabel/TypographyLabel";
import { Controller, useForm } from "react-hook-form";

import SIPCancellationAndAmendmentChart from "../Charts/SIPCancelationAndAmendmentChart";

import StockChartSkeleton from "components/Skeleton/SIPCancelAndAmendedSkeleton";

import { useGetSIPCancellationAndAmendent } from "services/Dashboard/dashboardServices";

import { colorTokens } from "../../../theme";

const UnitRedemption = () => {
  const theme = colorTokens;
  const { control } = useForm();

  const [valueData, setAmountData] = useState("amendment");
  const [timeData, setUnitData] = useState("1week");
  const [isDataLoading, setIsDataLoading] = useState(true); 
  
  const {
    isLoading,
    isError,
    data: SIPCancellationAndAmendent,
  } = useGetSIPCancellationAndAmendent(timeData, valueData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  } , []);
  
    const handleChangeAmount = (e: { target: { value: any } }) => {
      const newAmountfield = e.target.value as string;
      setAmountData(newAmountfield);
    };
  
    const handleChangeUnit = (e: { target: { value: any } }) => {
      const newAmountfield = e.target.value as string;
      setUnitData(newAmountfield);
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
            // mt: 2,
            height: 251,
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <StockChartSkeleton />
        </Box>
      ) : isError ? (
        <Card
          sx={{
            // mt: 2,
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
            borderRadius: "0.8rem",
            height: "fit-content",
            minHeight: 460,
            "&.MuiCard-root": {
              boxShadow: "none",
              // border: `0.1rem solid ${theme.grey[400]}`,
            border: "2px solid #D4D4D4",

              // lg: { width: 400 },
              // xl: { Width: 400 },
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
            title="SIP Cancellation and Amendment"
          />

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
                    onChange={handleChangeUnit}
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
                name="filterRedemption"
                control={control}
                defaultValue="cancleSIP"
                render={({ field }) => (
                  <Select
                    {...field}
                    size="small"
                    fullWidth
                    onChange={handleChangeAmount}
                    value={valueData}
                  >
                    <MenuItem value="rejected">Cancelled SIPs</MenuItem>
                    <MenuItem value="amendment">Amended SIPs</MenuItem>
                  </Select>
                )}
              />
            </Box>
          </Box>

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
                {formatIndianNumber(
                  SIPCancellationAndAmendent.meta.amendment_sip
                )}
                {/* {formatIndianNumber(40)} */}
              </Typography>
              <Typography sx={{ textAlign: "center", color: theme.grey[500] }}>
                SIPs Amended
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
                {formatIndianNumber(
                  SIPCancellationAndAmendent.meta.cancellation_sip
                )}
              </Typography>
              <Typography sx={{ textAlign: "center", color: theme.grey[500] }}>
                SIPs Cancelled
              </Typography>
            </Box>
          </CardContent>

          {/* SIP Cancellation And Amendment Chart */}
          <Box>
            <SIPCancellationAndAmendmentChart
              data={SIPCancellationAndAmendent}
            />
          </Box>
        </Card>
      )}
    </>
  );
};

export default UnitRedemption;
