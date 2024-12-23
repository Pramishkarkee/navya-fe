import React from "react";
import IpoList from "./Ipo List/Ipo";
import IpoEntry from "./Ipo Entry/IpoEntry";
import IpoPosting from "./IPO Posting/IpoPosting";
import BasicTabComponent from "components/Tab/Tab";
import IPOAllotmentPosting from "./IPOAllotmentPosting/IPOAllotmentPosting";

const IPOIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "IPO/FPO/Right Share Entry",
      value: 0,
      component: <IpoEntry />,
    },
    {
      label: "IPO/FPO/Right Share Posting List",
      value: 1,
      component: <IpoPosting />,
    },
    {
      label: "IPO/FPO/Right Share List",
      value: 2,
      component: <IpoList />,
    },
    {
      label: "Allotment Posting",
      value: 3,
      component: <IPOAllotmentPosting />,
    },
    // {
    //   label: "Alloted List",
    //   value: 3,
    //   component: <IPOAllotmentPosting />,
    // },
  ];

  return (
    <React.Fragment>
      <BasicTabComponent tabData={tabData} />
    </React.Fragment>
  );
};

export default IPOIndex;
