import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetUnitDetails } from "../../../services/ShareHolderDetails/shareHolderDetails";
// import { colorTokens } from "../../../theme";

const ShareHolderDetail = ({ boid, selectedUnitId }) => {
  const theme = useTheme();
  const [details, setDetails] = useState(null);

  const { data: UserUnitDetails } = useGetUnitDetails(boid);

  useEffect(() => {
    const fetchShareHolderDetails = async () => {
      try {
        setDetails(UserUnitDetails);
      } catch (error) {
        // console.error("Error fetching shareholder details:", error);
      }
    };

    fetchShareHolderDetails();
  }, [boid, UserUnitDetails]);

  // console.log(details, "details");
  const selectedUnitDetails = UserUnitDetails?.responseData?.results?.filter(
    (result: { id: number }) => result.id === selectedUnitId
  );

  const transactionDate = new Date(selectedUnitDetails?.map((result) => result.created_at));
  const nepaliTime = transactionDate.toLocaleTimeString("en-US");

  return (
    <>
      {/* {UserUnitDetails?.results.map((result, index) => ( */}
      {selectedUnitDetails?.map((result, index) => (
        <Box
          key={index}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            width: "fit-content",
            mt: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "start", ml: 2 }}>
            <Typography
              sx={{
                textAlign: "start",
                fontWeight: 500,
                fontSize: "1.2rem",
                mt: 2,
                borderBottom: `2px solid ${theme.palette.primary.fullDarkmainColor}`,
              }}
            >
              SIP No. {result.share_holder_number}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: "repeat(3, 1fr)",
              p: 2,
            }}
          >
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Transaction Type</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.Transaction_type}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Units</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {Number(result.applied_units)
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Amount</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {Number(result?.amount)
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>
                Transaction Method
              </Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.portal === "Online" ? "Online" : result.portal === "Office" ? "Counter" : "-"}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Transaction Date</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.created_at.split("T")[0]}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Transaction Timestamp</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {nepaliTime}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Is Approved</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.is_approved ? "Yes" : "No"}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>NAV Value</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.purchased_nav_value}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default ShareHolderDetail;
