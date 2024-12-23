import MarketCapEntry from "./MarketCapEntry";
import MarketcapList from "./MarketCapList";
import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";

const MarketCapIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Market Cap Entry",
      value: 0,
      component: <MarketCapEntry />,
    },
    {
      label: "List of Market Cap",
      value: 1,
      component: <MarketcapList />,
    },
  ];

  return (
    <Box sx={{ py: 1 }}>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default MarketCapIndex;
