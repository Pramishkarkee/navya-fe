import React, { useState } from "react";
import { Box } from "@mui/material";
import BankAndBranchesSetup from "./BankAndBranchesSetup";
import AccountTypeSetup from "./AccountTypeSetup";
import BankInterest from "./BankInterest";
import BasicTabComponent from "components/Tab/Tab";

export default function BankAccountSetup() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Bank and Branches Setup",
      value: 0,
      component: <BankAndBranchesSetup />,
    },
    {
      label: "Account Type Setup",
      value: 0,
      component: <AccountTypeSetup />,
    },
    {
      label: "Bank Interest",
      value: 0,
      component: <BankInterest />,
    },
  ];

  return (
    <Box>
      <BasicTabComponent tabData={tabData} />
    </Box>
  );
}
