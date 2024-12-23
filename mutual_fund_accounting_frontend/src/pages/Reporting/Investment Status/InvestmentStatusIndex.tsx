import React from "react";
import { Box } from "@mui/material";
import BasicTabComponent from "components/Tab/Tab";
import SummarizedInformation from "./SummarizedInformation";
// import DetailedInformation from "./DetailedInformation";

const InvestmentStatusIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Information Status",
      value: 0,
      component: <SummarizedInformation />,
    },
    // {
    //   label: "Detailed Information",
    //   value: 1,
    //   component: <DetailedInformation />,
    // },
  ];

  return (
    <Box sx={{ py: 1 }}>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
};

export default InvestmentStatusIndex;
