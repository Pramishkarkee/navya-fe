import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import TransferStock from "./TransferStock";
import TransferStockList from "./StockTransaferList";
import StockTransaferPosting from "./StockTransaferPosting";

export default function StockTransferIndex() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Unlisted Stocks Transfer",
      value: 0,
      component: <TransferStock />,
    },
    {
      label: "Stock Transfer Posting",
      value: 1,
      component: <StockTransaferPosting />,
    },
    {
      label: "Listed Stocks Transfer List",
      value: 2,
      component: <TransferStockList />,
    },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
}
