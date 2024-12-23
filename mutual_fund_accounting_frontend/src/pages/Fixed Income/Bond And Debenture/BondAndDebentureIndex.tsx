import React from "react";
import BasicTabComponent from "components/Tab/Tab";
import SalesListOfDebenture from "./SalesListOfDebenture";
import TransactionSettlement from "./TransactionSettlement";
import ListOfDebentureAndBond from "./ListOfDebentureAndBond";
import BondAndDebenturePosting from "./BondAndDebenturePosting";
import BondDebenturePurchaseEntry from "./BondDebenturePurchase";
import BondAndDebentureSellPosting from "./BondDebentureSellPosting";
import BondAndDebentureSettlementPosting from "./BondAndDebentureSettlementPosting";

const DebentureIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Purchase Entry",
      value: 0,
      component: <BondDebenturePurchaseEntry />,
    },
    {
      label: "Purchase Entry Posting",
      value: 1,
      component: <BondAndDebenturePosting />,
    },
    {
      label: "Transaction Settlement",
      value: 2,
      component: <TransactionSettlement />,
    },
    {
      label: "Settlement Posting",
      value: 3,
      component: <BondAndDebentureSettlementPosting />,
    },
    {
      label: "Bonds and Debenture List",
      value: 4,
      component: <ListOfDebentureAndBond />,
    },
    // {
    //   label: "Sales Posting",
    //   value: 4,
    //   component: <BondAndDebentureSellPosting />,
    // },
    {
      label: "Sales List",
      value: 5,
      component: <SalesListOfDebenture />,
    },
  ];

  return (
    <React.Fragment>
      <BasicTabComponent tabData={tabData} />
    </React.Fragment>
  );
};

export default DebentureIndex;
