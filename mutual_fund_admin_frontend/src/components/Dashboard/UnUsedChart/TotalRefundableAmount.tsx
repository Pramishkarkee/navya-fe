import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";

import { useGetSIPPurchase } from 'services/Dashboard/dashboardServices'


const TotalRefundableAmount = () => {
  const [check, setCheck] = useState("SIP");
  const [amount, setAmount] = useState(null);

  const { isLoading, isError, data : sipRefundableAmount } = useGetSIPPurchase();

  useEffect(() => {
    if (sipRefundableAmount && sipRefundableAmount.responseData) {
      setAmount(sipRefundableAmount.responseData.sip_refundable);
    }
  }, [sipRefundableAmount]);
 
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setCheck(newAlignment);
    if (newAlignment === "SIP" && sipRefundableAmount && sipRefundableAmount.responseData) {
      setAmount(sipRefundableAmount.responseData.sip_refundable);
    } else if (newAlignment === "Unit") {
      setAmount(10000000.00);
    }
  };

  // const formatIndianNumber = (amount: number): string => {
  //   return amount.toLocaleString(undefined, {maximumFractionDigits:2}) 
  //   // return amount.toLocaleString("en-IN");
  // };
  
  const formatIndianNumber = (amount: number | undefined | null): string => {
    const formattedAmount = amount ?? 0;
    return formattedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <Card
      sx={{
        width: 525,
        borderRadius: "0.8rem",
        "&.MuiCard-root": {
          boxShadow: "none",
          border: "0.1rem solid gray",
        },
      }}
    >
      <CardHeader
        titleTypographyProps={{
          fontSize: 20,
          display: "flex",
          justifyContent: "center",
        }}
        sx={{ fontSize: "1rem", p: 2 }}
        title="Total Refundable Amount"
      />

      <CardContent sx={{ p: 0 }}>
        <ToggleButtonGroup
          color="primary"
          value={check}
          exclusive
          onChange={handleChange}
          aria-label="Toggle menu"
          sx={{ display: "flex", justifyContent: "center", height: "2rem" }}
        >
          <ToggleButton sx={{ borderRadius: "4rem" }} value="SIP">
            {check === "SIP" && (
              <CheckIcon sx={{ height: "1rem", width: "1rem" }} />
            )}
            <Typography sx={{ fontSize: "0.8rem" }}>
              SIP Refundable Amount
            </Typography>
          </ToggleButton>
          <ToggleButton sx={{ borderRadius: "4rem" }} value="Unit">
            {check === "Unit" && (
              <CheckIcon sx={{ height: "1rem", width: "1rem" }} />
            )}
            Unit Refundable Amount
          </ToggleButton>
        </ToggleButtonGroup>

        {isLoading ? <Typography sx={{textAlign:'center', mt:2}}>Loading...</Typography>: isError ? <Typography sx={{textAlign:'center', mt:2}}>Error at Fetching Data</Typography> :
          <Typography
          sx={{
            fontSize: "1.5rem",
            mt: 2,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          
          {amount !== null ? (
            <>

              {/* NPR {amount.toFixed(2)} */}
              {/* NPR {formatIndianNumber(data.responseData.total_amount)} */}
              NPR {formatIndianNumber(amount)}
            </>
          ) : (
            ""
          )}
        </Typography>
        }

      
      </CardContent>
    </Card>
  );
};

export default TotalRefundableAmount;
