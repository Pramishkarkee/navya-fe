import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";

import UnitRedemptionCard from "../components/Dashboard/DashboardCard/UnitRedemption";
import UnitPurchaseCard from "../components/Dashboard/DashboardCard/UnitPurchase";
import TotalSIPRegistration from "components/Dashboard/DashboardCard/TotalSIPRegistration";
import SIPPayment from "components/Dashboard/DashboardCard/SIPPayments";
import CurrentNAV from "components/Dashboard/DashboardCard/CurrentNAV";
import PaymentGatewayTransactions from "components/Dashboard/DashboardCard/PaymentGatewayTransactions";
import SIPCancelationAndAmendment from "components/Dashboard/DashboardCard/SIPCancellationAndAmendment";

export default function Dashboard() {
  return (
    <>
  <Box sx={{ width: {md:'110%', lg: "115%", xl: "120%" }, maxWidth:'1900px'}}>
        <Divider />
        <CurrentNAV />
        <Box
          sx={{
            display: "grid",
            mt:3,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(3, 1fr)",
              xxl: "repeat(4, 1fr)",
            },
            // width: { md: "118%", lg: "95%", xl: "100%" },
            gap: 3,
          }}
        >
          <TotalSIPRegistration />
          <SIPPayment />
          <PaymentGatewayTransactions />
          <UnitPurchaseCard />
          <SIPCancelationAndAmendment />
          <UnitRedemptionCard />
        </Box>
      </Box>
    </>
  );
}


