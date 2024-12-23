import React, { useState } from "react";
import BasicTabComponent from "components/Tab/Tab";
import SubRedeemEntry from "./SubRedeemEntry";
import SubRedeemPosting from "./SubRedeemPosting";


export default function InvestmentParameter() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Subscription Redeem Entry",
      value: 0,
      component: <SubRedeemEntry />,
    },
    {
      label: "Subscription Redeem Posting",
      value: 1,
      component: <SubRedeemPosting />,
    },
  ];


  return (
    <div >
      <BasicTabComponent
        tabData={tabData}

      />
    </div>
  );
}
