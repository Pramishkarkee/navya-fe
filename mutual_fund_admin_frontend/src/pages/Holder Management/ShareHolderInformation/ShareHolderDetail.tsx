import { Box, Button, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetShareHolderDetails } from "../../../services/ShareHolderDetails/shareHolderDetails";
import { useNavigate } from "react-router-dom";
import { useNavStore } from "../../../store/NavbarStore";
// import { colorTokens } from "../../../theme";

// const formatNumber = (number) => {
//   return new Intl.NumberFormat("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(number);

// };

const formatNumber = (number : number) => {

  if (number === 0) {
    return "0.00";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const ShareHolderDetail = ({ id, boid }: { id: number; boid: string }) => {
  const theme = useTheme();
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  const { setSipId } = useNavStore();
  const { setUnitBOID } = useNavStore();

  const { data: shareHolderDetails } = useGetShareHolderDetails(id);

  const handleClickSipDetail = () => {
    setSipId(boid);
    navigate(`/sip-details`);
  };

  const handleClickUnitDetail = () => {
    setUnitBOID(boid);
    navigate(`/unit-details`);
  };

  useEffect(() => {
    const fetchShareHolderDetails = async () => {
      try {
        setDetails(shareHolderDetails);
      } catch (error) {
        // console.error("Error fetching shareholder details:", error);
      }
    };

    fetchShareHolderDetails();
  }, [id, shareHolderDetails]);

  const totalInvestmentAmount =
    (shareHolderDetails?.meta?.unit_model?.total_investment ?? 0) +
    (shareHolderDetails?.meta?.sip_model?.total_investment ?? 0);

  const totalPortfolioAmount =
    (shareHolderDetails?.meta?.sip_model?.portfolio_amount ?? 0) +
    (shareHolderDetails?.meta?.unit_model?.portfolio_amount ?? 0);

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          border: "1px solid",
          width: "36rem",
          mt: 3,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: 500,
              fontSize: "1.2rem",
              mt: 2,
              borderBottom: `2px solid ${theme.palette.primary.fullDarkmainColor}`,
            }}
          >
            Shareholder Information
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
          <Box>
            <Typography sx={{ fontWeight: 500 }}>BOID</Typography>
            <Typography sx={{ color: theme.palette.grey[500] }}>
              {shareHolderDetails?.responseData?.boid_no ?? "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 500 }}>Shareholder Number</Typography>
            <Typography sx={{ color: theme.palette.grey[500] }}>
              {shareHolderDetails?.responseData?.share_holder_number ?? "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 500 }}>Name</Typography>
            <Typography sx={{ color: theme.palette.grey[500] }}>
              {shareHolderDetails?.responseData?.full_name ?? "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 500 }}>Citizenship Number</Typography>
            <Typography sx={{ color: theme.palette.grey[500] }}>
              {shareHolderDetails?.responseData?.citizenship_no ?? "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 500 }}>Email</Typography>
            <Typography sx={{ color: theme.palette.grey[500] }}>
              {shareHolderDetails?.responseData?.email ?? "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 500 }}>Mobile Number</Typography>
            <Typography sx={{ color: theme.palette.grey[500] }}>
              {shareHolderDetails?.responseData?.phone ?? "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 500 }}>Shareholder From</Typography>
            <Typography sx={{ color: theme.palette.grey[500] }}>
              {shareHolderDetails?.responseData?.created_at.split("T")[0] ??
                "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 500 }}>
              Total Portfolio Amount
            </Typography>
            <Typography sx={{ color: theme.palette.grey[500] }}>
              {formatNumber(totalPortfolioAmount) ?? "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 500 }}>
              Total Investment Amount
            </Typography>
            <Typography sx={{ color: theme.palette.grey[500] }}>
              {formatNumber(totalInvestmentAmount) ?? "N/A"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 3, width: "120%", flexWrap: "wrap" }}>
        <Box
          sx={{
            borderRadius: 2,
            border: "1px solid",
            mt: 3,
            minWidth: "36rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: 12,
              mr: 3,
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: 500,
                fontSize: "1.2rem",
                mt: 2,
                borderBottom: `2px solid ${theme.palette.primary.fullDarkmainColor}`,
              }}
            >
              SIP Information
            </Typography>
            <Typography
              sx={{
                textAlign: "end",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: theme.palette.primary[700],
                mt: 2,
              }}
            >
              <Button
                sx={{
                  padding: 0,
                  textTransform: "none",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  border: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
                onClick={handleClickSipDetail}
              >
                View Details
              </Button>
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
                Total SIP Registrations
              </Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {shareHolderDetails?.meta?.sip_model?.total_sip_reg 
                ? formatNumber(shareHolderDetails?.meta?.sip_model?.total_sip_reg) : '-'}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Portfolio Amount</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                 {shareHolderDetails?.meta?.sip_model?.portfolio_amount 
                  ? formatNumber(shareHolderDetails?.meta?.sip_model?.portfolio_amount) : '-'}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>
                Total Invested Amount
              </Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
              {shareHolderDetails?.meta?.sip_model?.total_investment 
                ? formatNumber(shareHolderDetails?.meta?.sip_model?.total_investment) : '-'}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>
                Last Payment Date
              </Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
                {shareHolderDetails?.meta?.sip_model?.last_payment_date ?? "-"}
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Refund Amount</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
              {shareHolderDetails?.meta?.sip_model?.refund_amount 
                ? formatNumber(shareHolderDetails?.meta?.sip_model?.refund_amount) 
                : shareHolderDetails?.meta?.sip_model?.refund_amount === 0 ? '0.00'
                : '-'}

                {/* {
                  shareHolderDetails?.meta?.sip_model?.refund_amount 
                  ? formatNumber(shareHolderDetails?.meta?.sip_model?.refund_amount) 
                  : '-'
                } */}
                  
              </Typography>
            </Box>
            <Box sx={{}}>
              <Typography sx={{ fontWeight: 500 }}>Total SIP Units</Typography>
              <Typography sx={{ color: theme.palette.grey[500] }}>
              {shareHolderDetails?.meta?.sip_model?.total_units 
                ? formatNumber(shareHolderDetails?.meta?.sip_model?.total_units) : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            borderRadius: 2,
            border: "1px solid",
            mt: 3,
            minWidth: "36rem",
          }}
        >
          <Box>
            <Box
              sx={{ display: "flex", justifyContent: "end", gap: 12, mr: 3 }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: 500,
                  fontSize: "1.2rem",
                  mt: 2,
                  borderBottom: `2px solid ${theme.palette.primary.fullDarkmainColor}`,
                }}
              >
                Unit Holder Summary
              </Typography>
              <Typography
                sx={{
                  textAlign: "end",
                  fontWeight: 500,
                  color: theme.palette.primary[700],
                  fontSize: "0.9rem",
                  mt: 2,
                }}
              >
                <Button
                  sx={{
                    padding: 0,
                    textTransform: "none",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                  onClick={handleClickUnitDetail}
                >
                  View Details
                </Button>
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
                  Total Units Held
                </Typography>
                <Typography sx={{ color: theme.palette.grey[500] }}>
                  {( shareHolderDetails?.meta?.unit_model?.total_units ?
                  formatNumber(shareHolderDetails?.meta?.unit_model?.total_units) : '-')}
                </Typography>
              </Box>
              <Box sx={{}}>
                <Typography sx={{ fontWeight: 500 }}>
                  Portfolio Amount
                </Typography>
                <Typography sx={{ color: theme.palette.grey[500] }}>
                {( shareHolderDetails?.meta?.unit_model?.total_units ?
                  formatNumber(shareHolderDetails?.meta?.unit_model?.portfolio_amount) : '-')}
                </Typography>
              </Box>
              <Box sx={{}}>
                <Typography sx={{ fontWeight: 500 }}>
                  Total Invested Amount
                </Typography>
                <Typography sx={{ color: theme.palette.grey[500] }}>
                  {( shareHolderDetails?.meta?.unit_model?.total_units ?
                  formatNumber(shareHolderDetails?.meta?.unit_model?.total_investment) : '-')}
                </Typography>
              </Box>
              <Box sx={{}}>
                <Typography sx={{ fontWeight: 500 }}>
                  Last Unit Purchase Date
                </Typography>
                <Typography sx={{ color: theme.palette.grey[500] }}>
                  {shareHolderDetails?.meta?.unit_model?.last_payment_date ??
                    "-"}
                </Typography>
              </Box>
              <Box sx={{}}>
                <Typography sx={{ fontWeight: 500 }}>Redeemed Units</Typography>
                <Typography sx={{ color: theme.palette.grey[500] }}>
                {( shareHolderDetails?.meta?.unit_model?.total_units ?
                  formatNumber(shareHolderDetails?.meta?.unit_model?.redeemed_units) : '-')}
                </Typography>
              </Box>
              <Box sx={{}}>
                <Typography sx={{ fontWeight: 500 }}>
                  Redeemed Amount
                </Typography>
                <Typography sx={{ color: theme.palette.grey[500] }}>
                {( shareHolderDetails?.meta?.unit_model?.total_units ?
                  formatNumber(shareHolderDetails?.meta?.unit_model?.redeemed_amount) : '-')}
                </Typography>
              </Box>
            
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ShareHolderDetail;
