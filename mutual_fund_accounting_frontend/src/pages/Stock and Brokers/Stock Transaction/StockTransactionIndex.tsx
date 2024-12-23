import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import Settlement from "./Settlement/Settlement";
import StockTransaction from "./Stock Transaction/StockTransaction";
import StockSettlementList from "./Settlement List/StockSettlementList";
import StockTransactionPosting from "./Stock Posting/StockTransactionPosting";
import SettlementPosting from "./Settlement/SettlementPosting";

export default function StockTransactionIndex() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Stock Transaction",
      value: 0,
      component: <StockTransaction />,
    },
    {
      label: "Stock Transaction Posting",
      value: 1,
      component: <StockTransactionPosting />,
    },
    {
      label: "Settlement",
      value: 2,
      component: <Settlement />,
    },
    {
      label: "Settlement Posting",
      value: 3,
      component: <SettlementPosting />,
    },
    {
      label: "Settlement List",
      value: 4,
      component: <StockSettlementList />,
    },

    // {
    //   label: "Rejected List",
    //   value: 4,
    //   component: <StockSettlementList />,
    // },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
}
