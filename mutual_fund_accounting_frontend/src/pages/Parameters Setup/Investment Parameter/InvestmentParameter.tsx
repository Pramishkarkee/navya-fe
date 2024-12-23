import React, { useState } from "react";
import BasicTabComponent from "components/Tab/Tab";
import ParameterDefinition from "./ParameterDefinition";
import BankDeposit from "./BankDeposit";

export default function InvestmentParameter() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Paramenter Definition",
      value: 0,
      component: <ParameterDefinition />,
    },
    {
      label: "Bank Investment Parameter",
      value: 1,
      component: <BankDeposit />,
    },
  ];

  return (
    <div>
      <BasicTabComponent tabData={tabData} />
    </div>
  );
}
