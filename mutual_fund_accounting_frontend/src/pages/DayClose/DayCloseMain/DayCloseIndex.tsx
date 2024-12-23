import React from "react";
import DayCloseEntry from "./DayCloseEntry";
import DayCloseList from "./DayCloseList";
import DayClosePosting from "./DayClosePosting";
import BasicTabComponent from "components/Tab/Tab";

export default function DayCloseIndex() {
  interface TabData {
    label: string;
    value: number;
    component: any;
  }

  const tabData: TabData[] = [
    {
      label: "Day Close Entry",
      value: 0,
      component: <DayCloseEntry />,
    },
    // {
    //   label: "Day Close Posting (WIP)",
    //   value: 1,
    //   component: <DayClosePosting />,
    // },
    // {
    //   label: "Day Close List",
    //   value: 1,
    //   component: <DayCloseList />,
    // },
  ];

  return (
    <React.Fragment>
      <BasicTabComponent tabData={tabData} />
    </React.Fragment>
  );
}
