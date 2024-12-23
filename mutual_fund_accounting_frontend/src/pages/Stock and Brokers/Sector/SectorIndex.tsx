import React from "react";

import { Box } from "@mui/material";
import InvestmentSector from "./InvestmentSector";
// import SecurityTypes from "./SecurityTypes";

import BasicTabComponent from "components/Tab/Tab";

interface TabData {
  label: string;
  value: number;
  component: any;
}

export default function Sector() {
  const tabData: TabData[] = [
    {
      label: "Investment Sector",
      value: 0,
      component: <InvestmentSector />,
    },
    // {
    //   label: "Security Types",
    //   value: 1,
    //   component: <SecurityTypes />,
    // },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
}
