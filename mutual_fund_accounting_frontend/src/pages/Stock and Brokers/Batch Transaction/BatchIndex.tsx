import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import BatchImportApproval from "./BatchImportApproval";
import BatchImport from "./BatchImport";
// import StockBrokerPosting from "./Stock Broker Posting/StockBrokerPosting";

const BatchTransactionIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Batch Import",
      value: 0,
      component: <BatchImport />,
    },
    {
      label: "Batch Import Approval",
      value: 1,
      component: <BatchImportApproval />,
    },
   
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default BatchTransactionIndex;
