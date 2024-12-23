import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import StockBrokerSetup from "./Stock Broker Setup/StockBrokerSetup";
import StockBrokerList from "./Stock Broker List/StockBrokerList";
// import StockBrokerPosting from "./Stock Broker Posting/StockBrokerPosting";

const StockIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Stock Broker Entry",
      value: 0,
      component: <StockBrokerSetup />,
    },

    {
      label: "Stock Broker List",
      value: 1,
      component: <StockBrokerList />,
    },

    // {
    //   label: "Stock Broker Posting (WIP)",
    //   value: 2,
    //   component: <StockBrokerPosting />,
    // },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default StockIndex;
