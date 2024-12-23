import CommissionEntry from "./CommissionRate";
import CommissionList from "./CommissionRateList";
import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";

const DepositIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Commission Entry",
      value: 0,
      component: <CommissionEntry />,
    },
    {
      label: "List of Commission",
      value: 1,
      component: <CommissionList />,
    },
  ];

  return (
    <Box sx={{ py: 1 }}>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default DepositIndex;
