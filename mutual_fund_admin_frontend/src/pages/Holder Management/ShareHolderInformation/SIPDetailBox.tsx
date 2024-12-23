import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetSIPDetails } from "../../../services/ShareHolderDetails/shareHolderDetails";
// import { colorTokens } from "../../../theme";

const SIPDetailBox = ({ boid, selectedSIPId }) => {
  const theme = useTheme();
  const [details, setDetails] = useState(null);

  const { data: shareHolderDetails } = useGetSIPDetails(boid);

  useEffect(() => {
    const fetchShareHolderDetails = async () => {
      try {
        setDetails(shareHolderDetails);
      } catch (error) {
        // console.error("Error fetching shareholder details:", error);
      }
    };

    fetchShareHolderDetails();
  }, [boid, shareHolderDetails]);

  const selectedSIPDetails = shareHolderDetails?.responseData?.results.filter(
    (result: { id: number }) => result.id === selectedSIPId
  );

  const transactionDate = new Date(selectedSIPDetails?.map((result) => result.created_at));
  const nepaliTime = transactionDate.toLocaleTimeString("en-US");   
  
  return (
    <>
      {selectedSIPDetails?.map((result, index) => (
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
              <Typography sx={{ fontWeight: 500 }}>
                SIP Registration No
              </Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.ref_id}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Full Name</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.full_name}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>
                Depository Participants
              </Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.scheme_name}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>
                {" "}
                SIP Registration Date
              </Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.sip_start_date}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>
                {" "}
                SIP Registration Timestamp
              </Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {nepaliTime}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Client Type</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.client_type}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>
                Distribution Center
              </Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.db_center}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Contact Number</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.phone}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Email</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.email}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 500 }}>SIP Model</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.sip_model}
              </Typography>
            </Box>

            {result.sip_model === "Limited" ? (
              <>
               <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>SIP Interval</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.sip_interval}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>SIP Term</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.time_period}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>SIP End Date</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.sip_end_date}
              </Typography>
            </Box>
              </>
              ) : null}
            
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>
                SIP Installment Amount
              </Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {Number(result?.amount)
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>
                Dividend Re-Investment Plan
              </Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.enrolled_drep ? "Yes" : "No"}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Total Investment</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {shareHolderDetails?.meta?.total_investment_amount
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Return Amount</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {result.return_amount}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default SIPDetailBox;
