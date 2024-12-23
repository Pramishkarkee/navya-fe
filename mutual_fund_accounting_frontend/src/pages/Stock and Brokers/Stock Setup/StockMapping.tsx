import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import StockEntry from "./Stock Entry/StockEntry";
import StockList from "./Stock List/StockList";
import BondList from "./Bond List/BondList";
// import StockMappingPosting from "./Stock Mapping Posting/StockMappingPosting";
export default function StockMappingIndex() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Stock Entry",
      value: 0,
      component: <StockEntry />,
    },
    {
      label: "Stock List",
      value: 1,
      component: <StockList />,
    },
    {
      label: "Bond List",
      value: 2,
      component: <BondList />,
    },

    // {
    //   label: "Stock Posting (WIP)",
    //   value: 2,
    //   component: <StockMappingPosting />,
    // },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
}
