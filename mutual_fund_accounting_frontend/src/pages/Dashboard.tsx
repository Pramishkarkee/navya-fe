import { Box, Divider } from "@mui/material";
import CurrentNAV from "components/Dashboard/DashboardCard/CurrentNAV";
import SecurityTypeChart from "components/DashboardCharts/SecurityChart";
import NAVChart from "components/DashboardCharts/NAVChart";
import PayableReceivablesChart from "components/DashboardCharts/PayableReceivablesChart";
import AssetsCard from "components/DashboardCharts/AssetsCard";
import LiabilitiesCard from "components/DashboardCharts/LiabilitiesCard";
import IncomeExpenses from "components/DashboardCharts/IncomeExpenses";
import { useGetMutualFundSetupList } from "services/MutualFundSetup/MutualFundSetupServices";
import { useGlobalStore } from "store/GlobalStore";
import { useEffect } from "react";
// import NewsAlerts from "components/DashboardCharts/NewsAlertsCard";

export default function Dashboard() {
  const { data } = useGetMutualFundSetupList(1);
  // console.log(data?.responseData?.results[0].allotment_date);

  const { setAllotmentDate } = useGlobalStore((state) => ({
    setAllotmentDate: state.setAllotmentDate,
    allotmentDate: state.allotmentDate,
  }));

  useEffect(() => {
    const allotmentDateValue = data?.responseData?.results[0]?.allotment_date;
    setAllotmentDate(allotmentDateValue);
  }, [data, setAllotmentDate]);

  return (
    <>
      <Box
        sx={{
          width: { sm: "90%", md: "100%", lg: "160%", xl: "165%" },
          maxWidth: "1900px",
        }}
      >
        <Divider />
        <Box
          sx={{
            mt: 2,
          }}
        >
          <CurrentNAV />
          <SecurityTypeChart />
          <Box
            sx={{
              display: "grid",
              mt: 2,
              gridTemplateColumns: "1fr 1fr",
              width: "100%",
              gap: 2,
            }}
          >
            <NAVChart />
            <PayableReceivablesChart />
          </Box>

          <Box
            sx={{
              display: "grid",
              mt: 2,
              gridTemplateColumns: "1fr 1fr",
              width: "100%",
              gap: 2,
            }}
          >
            <AssetsCard />
            <LiabilitiesCard />
          </Box>
          {/* <NewsAlerts/> */}
          <IncomeExpenses />
        </Box>
      </Box>
    </>
  );
}
