import React from "react";
import BasicTabComponent from "components/Tab/Tab";
import AuctionList from "./Auction List/AuctionList";
import AuctionEntry from "./Auction Entry/AuctionEntry";
import AuctionPosting from "./Auction Posting/AuctionPosting";
import AuctionAllotmentPosting from "./AuctionAllotmentPosting/AuctionAllotmentPosting";

const CAIndex = () => {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Auction Entry",
      value: 0,
      component: <AuctionEntry />,
    },
    {
      label: "Auction Posting List",
      value: 1,
      component: <AuctionPosting />,
    },
    {
      label: "Auction List",
      value: 2,
      component: <AuctionList />,
    },
    {
      label: "Allotment Posting",
      value: 2,
      component: <AuctionAllotmentPosting />,
    },
  ];

  return (
    <React.Fragment>
      <BasicTabComponent tabData={tabData} />
    </React.Fragment>
  );
};

export default CAIndex;
