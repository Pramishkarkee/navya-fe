import CGTEntry from "./CGTChargeEntry";
import CGTList from "./CGTChargeList";
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
      label: "CGT Charge Entry",
      value: 0,
      component: <CGTEntry />,
    },
    {
      label: "List of CGT Charges",
      value: 1,
      component: <CGTList />,
    },
  ];

  return (
    <Box sx={{ py: 1 }}>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default MarketCapIndex;
