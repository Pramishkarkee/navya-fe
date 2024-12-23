import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useGetUnitPurchase } from 'services/Dashboard/dashboardServices'

const TotalUnitAmount = () => {
  
  const { isLoading, isError, data : unitPurchaseAmount } = useGetUnitPurchase();
  // console.log(unitPurchaseAmount?.responseData)

  // const formatIndianNumber = (amount: number): string => {
  //   // return amount.toLocaleString("en-IN");
  //   return amount.toLocaleString(undefined, {maximumFractionDigits: 2}) 
  // };

  const formatIndianNumber = (amount: number | undefined | null): string => {
    const formattedAmount = amount ?? 0;
    return formattedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };
  

  return (
    <Card
      sx={{
        width: 314,
        borderRadius: "0.8rem",
        "&.MuiCard-root": {
          boxShadow: "none",
          border: "0.1rem solid gray",
          width: 320,
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
        title="Total Unit Purchase Amount"
      />
      { isLoading ? <Typography sx={{textAlign:'center', mt:2}}>Loading...</Typography> : isError ? <Typography sx={{textAlign:'center',mt:2}}>Error at Fetching Data</Typography> : 
       <CardContent sx={{}}>
       {unitPurchaseAmount.responseData.data.total_unit_amount !== undefined && (
         <Typography
           sx={{
             fontSize: "1.6rem",
             fontWeight: "600",
             textAlign: "center",
           }}
         >
           NPR {formatIndianNumber(unitPurchaseAmount.responseData.data.total_unit_amount)}
         </Typography>
       )}
     </CardContent> }
     
    </Card>
  );
};

export default TotalUnitAmount;
