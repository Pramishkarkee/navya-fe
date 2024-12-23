import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { Box, CardContent, Divider, MenuItem, Select } from "@mui/material";

import PaymentTransactionChart from "../Charts/PaymentGatewayChart";

import { useGetPaymentTransaction } from "../../../services/Dashboard/dashboardServices";
import { Controller, useForm } from "react-hook-form";

import TypographyLabel from "components/InputLabel/TypographyLabel";
import { colorTokens } from "../../../theme";

import StockChartSkeleton from "components/Skeleton/PaymentGatewaySkeleton";

export default function Dashboard() {
  const theme = colorTokens;
  const { control } = useForm();

  const [timeData, setTimeData] = useState("1month");
  const [methodData, setMethodData] = useState(" ");
  const [isDataLoading, setIsDataLoading] = useState(true);

  const {
    isLoading,
    isError,
    data: PaymentTransaction,
    refetch,
  } = useGetPaymentTransaction(timeData, methodData);

  useEffect(() => { 
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChangeTime = (e: { target: { value: any } }) => {
    const newTimefield = e.target.value as string;
    setTimeData(newTimefield);
  };

  const handleChangeMethod = (e: { target: { value: any } }) => {
    const newMethodfield = e.target.value as string;
    setMethodData(newMethodfield);
  };

  useEffect(() => {
    refetch();
  }, [timeData, refetch]);

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
            // height: 215,
            // mr: 12,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StockChartSkeleton />
        </Box>
      ) : isError ? (
        <Card
          sx={{
            width: 315,
            height: 450,
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
              // xl: { width: 400 },
            },
          }}
        >
          <CardHeader
            titleTypographyProps={{
              fontSize: 20,
              display: "flex",
              justifyContent: "center",
            }}
            sx={{ fontSize: "1rem" }}
            title="Gateway Wise Transactions"
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
                {formatIndianNumber(
                  PaymentTransaction.meta.total_investment_amount
                )}
                {/* NPR {formatIndianNumber(25620)} */}
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
                {formatIndianNumber(PaymentTransaction.meta.total_applied_unit)}
                {/* {formatIndianNumber(64)} */}
              </Typography>
              <Typography sx={{ textAlign: "center", color: theme.grey[500] }}>
                Transaction
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
                name="filterUnitPurchase"
                control={control}
                defaultValue=" "
                render={({ field }) => (
                  <Select
                    {...field}
                    size="small"
                    fullWidth
                    onChange={handleChangeMethod}
                    value={methodData}
                  >
                    <MenuItem value=" ">ALL</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="esewa">Esewa</MenuItem>
                    <MenuItem value="khalti">Khalti</MenuItem>
                    <MenuItem value="ime">IME</MenuItem>
                    <MenuItem value="connectips">Connect IPS</MenuItem>
                  </Select>
                )}
              />
            </Box>
          </Box>

          {/* Payment Gateway Chart */}
          <CardContent
            sx={{
              p: 0,
              "&.MuiCardContent-root": {
                pb: 0,
              },
            }}
          >
            <PaymentTransactionChart data={PaymentTransaction} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
